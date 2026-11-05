"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { ActiveChips, ChoiceList, Icon, LevelPills, SearchBox, SelectField, SortSelect, type ActiveChip } from "./controls";
import { activeCount, buildIndex, campusIndex, facetCounts, filterProgrammes, sortProgrammes } from "./filter";
import { ProgrammeRow, type RowLabels } from "./ProgrammeRow";
import { emptyFilters, sortOptions, type FinderData, type Filters, type SortKey } from "./types";

const PAGE = 30;
const fmt = (n: number) => n.toLocaleString("en-IN");

export function ProgrammeFinder({ data, initial }: { data: FinderData; initial?: Partial<Filters> }) {
  const [filters, setFilters] = useState<Filters>({ ...emptyFilters, ...initial });
  const [sort, setSort] = useState<SortKey>("relevance");
  const [limit, setLimit] = useState(PAGE);
  const [sheetOpen, setSheetOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const sheetClose = useRef<HTMLButtonElement>(null);
  const resultsTop = useRef<HTMLDivElement>(null);

  // Every filter change starts the list from the top again.
  const change = (fn: (f: Filters) => Filters) => {
    setFilters(fn);
    setLimit(PAGE);
  };
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => change((f) => ({ ...f, [key]: value }));
  const clearAll = () => change(() => emptyFilters);

  const deferred = useDeferredValue(filters);
  const busy = deferred !== filters;
  const ix = useMemo(() => ({ text: buildIndex(data), campuses: campusIndex(data) }), [data]);
  const results = useMemo(
    () => sortProgrammes(filterProgrammes(data, ix, deferred), sort, data, deferred.query),
    [data, ix, deferred, sort],
  );
  const counts = useMemo(() => facetCounts(data, ix, deferred), [data, ix, deferred]);
  const labels: RowLabels = useMemo(
    () => ({
      level: new Map(data.levels.map((o) => [o.value, o.label])),
      type: new Map(data.types.map((o) => [o.value, o.label])),
      campus: new Map(data.campuses.map((o) => [o.value, o.label])),
      department: new Map(data.departments.map((o) => [o.value, o.label])),
      campusesOf: ix.campuses,
    }),
    [data, ix],
  );

  // Campus narrows faculties, faculty narrows departments — the cascade the SRMIST finder uses.
  const campus = data.campuses.find((c) => c.value === filters.campus);
  const colleges = campus ? data.colleges.filter((c) => campus.colleges.includes(c.value)) : data.colleges;
  const college = data.colleges.find((c) => c.value === filters.college);
  const departments = college?.departments.length
    ? data.departments.filter((d) => college.departments.includes(d.value))
    : data.departments;
  const chooseCampus = (value: string) =>
    change((f) => {
      const allowed = data.campuses.find((c) => c.value === value)?.colleges;
      const keep = !value || !f.college || allowed?.includes(f.college);
      return { ...f, campus: value, college: keep ? f.college : "", department: keep ? f.department : "" };
    });
  const chooseCollege = (value: string) =>
    change((f) => {
      const allowed = data.colleges.find((c) => c.value === value)?.departments;
      const keep = !value || !f.department || !allowed?.length || allowed.includes(f.department);
      return { ...f, college: value, department: keep ? f.department : "" };
    });

  // Active filters as removable chips.
  const label = (list: { value: string; label: string }[], v: string) => list.find((o) => o.value === v)?.label ?? v;
  const chips: ActiveChip[] = [
    ...(filters.query.trim() ? [{ key: "q", label: `“${filters.query.trim()}”`, remove: () => set("query", "") }] : []),
    ...filters.levels.map((v) => ({ key: "l" + v, label: label(data.levels, v), remove: () => set("levels", filters.levels.filter((x) => x !== v)) })),
    ...(filters.campus ? [{ key: "c", label: label(data.campuses, filters.campus).split(" - ")[0], remove: () => chooseCampus("") }] : []),
    ...(filters.college ? [{ key: "f", label: label(data.colleges, filters.college), remove: () => chooseCollege("") }] : []),
    ...(filters.department ? [{ key: "d", label: label(data.departments, filters.department), remove: () => set("department", "") }] : []),
    ...filters.modes.map((v) => ({ key: "m" + v, label: label(data.modes, v), remove: () => set("modes", filters.modes.filter((x) => x !== v)) })),
    ...filters.types.map((v) => ({ key: "t" + v, label: label(data.types, v), remove: () => set("types", filters.types.filter((x) => x !== v)) })),
  ];
  const active = activeCount(filters);
  const refineActive = active - filters.levels.length - (filters.query.trim() ? 1 : 0);

  // "/" focuses the search from anywhere on the page (unless already typing).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key !== "/" || e.metaKey || e.ctrlKey || t.closest("input, textarea, select, [contenteditable]")) return;
      e.preventDefault();
      searchRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Phone filter sheet: lock page scroll, focus its close button, Escape closes.
  useEffect(() => {
    if (!sheetOpen) return;
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = "hidden";
    sheetClose.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheetOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = before;
      document.removeEventListener("keydown", onKey);
    };
  }, [sheetOpen]);
  const closeSheet = () => {
    setSheetOpen(false);
    resultsTop.current?.scrollIntoView({ block: "start" });
  };

  const shown = results.slice(0, limit);
  const total = data.programmes.length;

  return (
    <div className="pf">
      {/* 1 — Search and level: the primary way in */}
      <div className="pf-lead">
        <SearchBox value={filters.query} onChange={(v) => set("query", v)} total={total} inputRef={searchRef} />
        <LevelPills options={data.levels} selected={filters.levels} counts={counts.levels} onChange={(v) => set("levels", v)} />
      </div>

      <div className="pf-body">
        {/* 2 — Refine: secondary filters (a full-screen sheet on phones) */}
        <aside
          id="pf-refine"
          className="pf-refine"
          data-open={sheetOpen ? "" : undefined}
          aria-label="Refine programmes"
          {...(sheetOpen ? { role: "dialog", "aria-modal": true } : {})}
        >
          <div className="pf-refine-head">
            <h2>Refine</h2>
            {refineActive > 0 && (
              <button type="button" className="pf-clear" onClick={clearAll}>
                Clear all
              </button>
            )}
            <button ref={sheetClose} type="button" className="pf-sheet-close" onClick={closeSheet} aria-label="Close filters">
              <Icon name="close" />
            </button>
          </div>
          <div className="pf-refine-body">
            <ChoiceList
              legend="Campus"
              name="pf-campus"
              type="radio"
              allLabel="All campuses"
              options={data.campuses.map((c) => ({ value: c.value, label: c.label.split(" - ")[0] }))}
              selected={filters.campus ? [filters.campus] : []}
              counts={counts.campus}
              onChange={(v) => chooseCampus(v[0] ?? "")}
            />
            <SelectField
              id="pf-college"
              label="Faculty"
              allLabel="All faculties"
              options={colleges}
              counts={counts.college}
              value={filters.college}
              onChange={chooseCollege}
            />
            <SelectField
              id="pf-dept"
              label="Department"
              allLabel="All departments"
              options={departments}
              counts={counts.department}
              value={filters.department}
              onChange={(v) => set("department", v)}
            />
            <ChoiceList
              legend="Mode of delivery"
              name="pf-mode"
              type="checkbox"
              options={data.modes}
              selected={filters.modes}
              counts={counts.modes}
              onChange={(v) => set("modes", v)}
            />
            <ChoiceList
              legend="Study pattern"
              name="pf-type"
              type="checkbox"
              options={data.types}
              selected={filters.types}
              counts={counts.types}
              onChange={(v) => set("types", v)}
            />
          </div>
          <div className="pf-sheet-foot">
            <button type="button" className="pf-btn pf-btn-primary" onClick={closeSheet}>
              Show {fmt(results.length)} {results.length === 1 ? "programme" : "programmes"}
            </button>
          </div>
        </aside>

        {/* 3 — Results */}
        <section className="pf-results" aria-labelledby="pf-results-title" ref={resultsTop}>
          <div className="pf-toolbar">
            <h2 id="pf-results-title" className="pf-result-count" aria-live="polite">
              <strong>{fmt(results.length)}</strong> {results.length === 1 ? "programme" : "programmes"}
              {active > 0 && <span> of {fmt(total)}</span>}
            </h2>
            <div className="pf-toolbar-actions">
              <button
                type="button"
                className="pf-btn pf-filters-btn"
                aria-controls="pf-refine"
                aria-expanded={sheetOpen}
                onClick={() => setSheetOpen(true)}
              >
                <Icon name="filter" />
                Filters
                {refineActive > 0 && <span className="pf-badge">{refineActive}</span>}
              </button>
              <SortSelect value={sort} options={sortOptions} onChange={setSort} />
            </div>
          </div>

          <ActiveChips chips={chips} onClear={clearAll} />

          <div className="pf-list-wrap" data-busy={busy ? "" : undefined} aria-busy={busy}>
            <span className="pf-progress" aria-hidden="true" />
            {results.length ? (
              <>
                <ol className="pf-list">
                  {shown.map((p) => (
                    <ProgrammeRow key={p.id} programme={p} labels={labels} query={deferred.query} />
                  ))}
                </ol>
                {results.length > limit && (
                  <div className="pf-more">
                    <p>
                      Showing {fmt(shown.length)} of {fmt(results.length)}
                    </p>
                    <button type="button" className="pf-btn" onClick={() => setLimit((n) => n + PAGE)}>
                      Show {fmt(Math.min(PAGE, results.length - limit))} more
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="pf-empty" role="status">
                <h3>No programmes match</h3>
                <p>
                  {filters.query.trim()
                    ? `Nothing matches “${filters.query.trim()}” with the current filters. Check the spelling, try a broader word such as “engineering” or “nursing”, or remove a filter.`
                    : "Try removing a filter or choosing a different level."}
                </p>
                <div className="pf-empty-actions">
                  {filters.query.trim() && active > 1 && (
                    <button type="button" className="pf-btn" onClick={() => change(() => ({ ...emptyFilters, query: filters.query }))}>
                      Search “{filters.query.trim()}” in all programmes
                    </button>
                  )}
                  <button type="button" className="pf-btn pf-btn-primary" onClick={clearAll}>
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
