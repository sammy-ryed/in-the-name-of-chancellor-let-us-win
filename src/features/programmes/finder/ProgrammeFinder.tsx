"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { groupStudyAreas } from "./studyAreas";
import { AreaGallery } from "./AreaGallery";
import { routes } from "@/lib/navigation";
import { ActiveChips, ChoiceList, Icon, SearchBox, SelectField, SortSelect, type ActiveChip } from "./controls";
import { activeCount, buildIndex, campusIndex, facetCounts, filterProgrammes, sortProgrammes } from "./filter";
import { ProgrammeRow, type RowLabels } from "./ProgrammeRow";
import { emptyFilters, sortOptions, type FinderData, type Filters, type SortKey } from "./types";

const PAGE = 12;
const fmt = (n: number) => n.toLocaleString("en-IN");

export function ProgrammeFinder({ data: catalogue, initial, areaId, browseAll = false }: {
  data: FinderData;
  initial?: Partial<Filters>;
  areaId?: string | null;
  browseAll?: boolean;
}) {
  const areas = useMemo(() => groupStudyAreas(catalogue.programmes), [catalogue]);
  const area = areas.find(group => group.id === areaId);
  const data = useMemo(() => {
    if (!area) return catalogue;
    const levels = new Set(area.programmes.flatMap(p => p.level));
    const colleges = new Set(area.programmes.flatMap(p => p.college));
    const departments = new Set(area.programmes.flatMap(p => p.department));
    return {
      ...catalogue,
      programmes: area.programmes,
      levels: catalogue.levels.filter(l => levels.has(l.value)),
      colleges: catalogue.colleges.filter(c => colleges.has(c.value)),
      departments: catalogue.departments.filter(d => departments.has(d.value)),
      campuses: catalogue.campuses.filter(c => c.colleges.some(id => colleges.has(id))),
    };
  }, [area, catalogue]);
  const [filters, setFilters] = useState<Filters>({ ...emptyFilters, ...initial });
  const [selectedSort, setSort] = useState<SortKey>();
  const [limit, setLimit] = useState(PAGE);
  const [sheetOpen, setSheetOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const sheet = useRef<HTMLDialogElement>(null);
  const sheetClose = useRef<HTMLButtonElement>(null);

  // Every filter change starts the list from the top again.
  const change = (fn: (f: Filters) => Filters) => {
    setFilters(fn);
    setLimit(PAGE);
  };
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => change((f) => ({ ...f, [key]: value }));
  const clearAll = () => change(() => emptyFilters);

  const deferred = useDeferredValue(filters);
  const sort = selectedSort ?? (deferred.query.trim() ? "relevance" : "applications");
  const busy = deferred !== filters;
  const ix = useMemo(() => ({ text: buildIndex(data), campuses: campusIndex(data) }), [data]);
  const results = useMemo(
    () => sortProgrammes(filterProgrammes(data, ix, deferred), sort, data, deferred.query),
    [data, ix, deferred, sort],
  );
  const counts = useMemo(() => facetCounts(data, ix, deferred), [data, ix, deferred]);
  const labels: RowLabels = useMemo(
    () => ({
      department: new Map(data.departments.map(o => [o.value, o.label])),
      college: new Map(data.colleges.map((o) => [o.value, o.label])),
      campus: new Map(data.campuses.map((o) => [o.value, o.label])),
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
  const refineActive = active - (filters.query.trim() ? 1 : 0);

  // "/" focuses the search from anywhere on the page (unless already typing).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (sheet.current?.open || e.key !== "/" || e.metaKey || e.ctrlKey || t.closest("input, textarea, select, [contenteditable]")) return;
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
    const dialog = sheet.current;
    dialog?.showModal();
    sheetClose.current?.focus();
    const desktop = window.matchMedia("(min-width: 961px)");
    const onResize = () => { if (desktop.matches) setSheetOpen(false); };
    desktop.addEventListener("change", onResize);
    return () => {
      dialog?.close();
      html.style.overflow = before;
      desktop.removeEventListener("change", onResize);
    };
  }, [sheetOpen]);
  const closeSheet = () => setSheetOpen(false);

  const shown = results.slice(0, limit);
  const total = data.programmes.length;

  const filterControls = (
    <>
      <div className="pf-refine-head">
        <h2>Filters</h2>
        {refineActive > 0 && (
          <button type="button" className="pf-clear" onClick={() => change(f => ({ ...emptyFilters, query: f.query }))}>
            Clear all
          </button>
        )}
        <button ref={sheetClose} type="button" className="pf-sheet-close" onClick={closeSheet} aria-label="Close filters">
          <Icon name="close" />
        </button>
      </div>
      <div className="pf-refine-body">
        <ChoiceList legend="Study level" name="pf-level" type="checkbox" options={data.levels.slice(0, 3)}
          selected={filters.levels} counts={counts.levels} onChange={(v) => set("levels", v)} />
        {data.levels.length > 3 && <details className="pf-extra" open={filters.levels.some(v => data.levels.slice(3).some(o => o.value === v)) || undefined}>
          <summary>More study levels</summary>
          <ChoiceList legend="Other study levels" name="pf-level-other" type="checkbox" options={data.levels.slice(3)}
            selected={filters.levels} counts={counts.levels} onChange={(v) => set("levels", v)} />
        </details>}
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
          label="School or faculty"
          allLabel="All schools and faculties"
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
        <details className="pf-extra"><summary>Study mode and pattern</summary>
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
        </details>
      </div>
      <div className="pf-sheet-foot">
        <button type="button" className="pf-btn pf-btn-primary" onClick={closeSheet}>
          Show {fmt(results.length)} {results.length === 1 ? "programme" : "programmes"}
        </button>
      </div>
    </>
  );

  return (
    <div className="pf">
      <header className={area ? "pf-hero pf-area-hero" : "pf-hero"}>
        <div className="pf-hero-inner">
          <div className="pf-hero-copy">
            {(area || browseAll) && (
              <Link className="area-return" href="/programmes#study-areas"><Icon name="arrow" /> All study areas</Link>
            )}
            <h1>{area ? area.title : browseAll ? "All programmes" : <>Find <em>your</em> <span>programme</span></>}</h1>
            <SearchBox value={filters.query} onChange={(v) => set("query", v)} inputRef={searchRef}
              placeholder={area ? "Search within this study area" : undefined} />
            {!area && <Link className="pf-quiz" href={routes.finder.href}>No idea? Pick what course is right for you <Icon name="arrow" /></Link>}
          </div>
          <div className="pf-hero-visual">
            <Image src={area?.photo || "/campus/tech-park.webp"} alt="" fill
              sizes="(max-width: 760px) 28vw, (max-width: 1280px) 45vw, 540px" />
          </div>
        </div>
      </header>
      {!area && !browseAll && active === 0 ? (
        <AreaGallery areas={areas} total={catalogue.programmes.length} />
      ) : (
        <div className="pf-main pf-body">
          {sheetOpen ? (
            <dialog className="pf-refine" id="pf-refine" ref={sheet} aria-label="Programme filters"
              onCancel={() => setSheetOpen(false)}>{filterControls}</dialog>
          ) : (
            <aside className="pf-refine" id="pf-refine" aria-label="Programme filters">{filterControls}</aside>
          )}

          {/* 3 — Results */}
          <section className="pf-results" aria-labelledby="pf-results-title">
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
                <SortSelect<SortKey> value={sort} options={sortOptions} onChange={setSort} />
              </div>
            </div>

            <ActiveChips chips={chips} onClear={clearAll} />

            <div className="pf-list-wrap" data-busy={busy ? "" : undefined} aria-busy={busy}>
              <span className="pf-progress" aria-hidden="true" />
              {results.length ? (
                <>
                  <ol className="pf-list">
                    {shown.map((p) => (
                      <ProgrammeRow key={p.id} programme={p} labels={labels} />
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
                    {area && filters.query.trim() && (
                      <Link className="pf-btn" href={`/programmes?q=${encodeURIComponent(filters.query.trim())}`}>Search all study areas</Link>
                    )}
                    {filters.query.trim() && active > 1 && (
                      <button type="button" className="pf-btn" onClick={() => change(() => ({ ...emptyFilters, query: filters.query }))}>
                        Search “{filters.query.trim()}” {area ? "in this study area" : "in all programmes"}
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
      )}
    </div>
  );
}
