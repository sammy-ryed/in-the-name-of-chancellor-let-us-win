"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { Icon } from "@/features/programmes/finder/controls";
import { FeeComparison, slotLetters, SlotMark } from "./FeeComparison";
import type { FeeListing } from "./fee-listing";
import styles from "./fees.module.css";

type CatalogueProps = { records: FeeListing[]; faculties: Record<string, string> };
type FeeFilters = { query: string; faculty: string; campus: string; level: string };
const emptyFilters: FeeFilters = { query: "", faculty: "", campus: "", level: "" };
const pageSize = 12;
const searchable = (value: string) => value.toLowerCase().replaceAll(".", "").trim();

function FilterField({ label, all, field, options, value, onChange }: {
  label: string; all: string; field: keyof FeeFilters; options: [string, string][]; value: string;
  onChange: (field: keyof FeeFilters, value: string) => void;
}) {
  return <label className={styles.field}>
    <span>{label}</span>
    <select value={value} onChange={event => onChange(field, event.target.value)}>
      <option value="">{all}</option>
      {options.map(([id, name]) => <option value={id} key={id}>{name}</option>)}
    </select>
  </label>;
}

export function FeesFromURL(props: CatalogueProps) {
  const params = useSearchParams();
  return <FeeCatalogue {...props} compare={params.get("compare") || ""} />;
}

export function FeeCatalogue({ records, faculties, compare = "" }: CatalogueProps & { compare?: string }) {
  const [filters, setFilters] = useState(emptyFilters);
  const [limit, setLimit] = useState(pageSize);
  const [replacing, setReplacing] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const search = useRef<HTMLInputElement>(null);
  const index = useMemo(() => new Map(records.map(course => [course.id, course])), [records]);
  const slots = useMemo(() => {
    const ids = compare.split(",");
    return slotLetters.map((_, pos) => ids.indexOf(ids[pos]) === pos ? index.get(ids[pos]) : undefined);
  }, [compare, index]);
  const options = useMemo(() => {
    function distinct(field: "campus" | "level"): [string, string][] {
      return [...new Set(records.map(course => course[field]))].sort().map(value => [value, value]);
    }
    return { campuses: distinct("campus"), levels: distinct("level"), faculties: Object.entries(faculties) };
  }, [records, faculties]);
  const results = useMemo(() => {
    const terms = searchable(filters.query).split(/\s+/).filter(Boolean);
    return records.filter(course =>
      (!filters.faculty || course.faculty === filters.faculty) &&
      (!filters.campus || course.campus === filters.campus) &&
      (!filters.level || course.level === filters.level) &&
      (!terms.length || terms.every(term => searchable([course.name, course.degree, faculties[course.faculty], course.campus].join(" ")).includes(term))),
    );
  }, [records, filters, faculties]);
  const isFiltered = Object.values(filters).some(Boolean);
  const firstEmpty = slots.findIndex(slot => !slot);
  const shortlist = slots.map(slot => slot?.id || "").join(",").replace(/,+$/, "");
  const detailQuery = shortlist ? `?compare=${encodeURIComponent(shortlist)}` : "";
  function updateFilter(field: keyof FeeFilters, value: string) {
    setFilters(current => ({ ...current, [field]: value }));
    setLimit(pageSize);
  }
  function clearFilters() {
    setFilters(emptyFilters);
    setLimit(pageSize);
  }
  function setSlot(position: number, course?: FeeListing) {
    const ids = slots.map((current, i) => (i === position ? course : current)?.id || "");
    const query = ids.join(",").replace(/,+$/, "");
    const url = new URL(location.href);
    if (query) url.searchParams.set("compare", query);
    else url.searchParams.delete("compare");
    window.history.replaceState(null, "", url);
    setReplacing(null);
    setAnnouncement(course ? `${course.name} added as option ${slotLetters[position]}.` : `Option ${slotLetters[position]} removed.`);
  }
  function replaceSlot(position: number) {
    setReplacing(position);
    search.current?.focus();
  }

  return (
    <section className={styles.workspace} id="fees" aria-label="Fee explorer">
      <div className={styles.filters}>
        <label className={styles.searchBox}>
          <span>Search programmes</span>
          <span className={styles.searchInput}><Icon name="search" />
            <input ref={search} type="search" value={filters.query} placeholder="Subject, degree or campus" onChange={event => updateFilter("query", event.target.value)} />
          </span>
        </label>
        <FilterField field="faculty" label="Faculty" all="All faculties" options={options.faculties} value={filters.faculty} onChange={updateFilter} />
        <FilterField field="campus" label="Campus" all="All campuses" options={options.campuses} value={filters.campus} onChange={updateFilter} />
        <FilterField field="level" label="Study level" all="All levels" options={options.levels} value={filters.level} onChange={updateFilter} />
      </div>
      <div className={styles.columns}>
        <FeeComparison slots={slots} replacing={replacing} onReplace={replaceSlot} onCancelReplace={() => setReplacing(null)} onRemove={pos => setSlot(pos)} detailQuery={detailQuery} />
        <div className={styles.results}>
          <div className={styles.resultHead}>
            <h2>Fee directory</h2>
            <p role="status">{results.length} {results.length === 1 ? "option" : "options"}</p>
            {isFiltered && <button className={styles.reset} type="button" onClick={clearFilters}>Clear filters</button>}
          </div>
          <ul className={styles.rows}>
            {results.slice(0, limit).map(course => {
              const selected = slots.findIndex(slot => slot?.id === course.id);
              const target = selected >= 0 ? selected : replacing ?? firstEmpty;
              const active = selected >= 0;
              const assigned = slotLetters[selected];
              return <li key={course.id} data-slot={assigned} className={styles.row}>
                <div className={styles.course}>
                  <span className={styles.courseMeta}>{course.degree} <span aria-hidden="true">/</span> {course.campus}{course.shift && ` · Shift ${course.shift}`}</span>
                  <h3><Link href={`/programmes/${course.id}${detailQuery}`}>{course.name} <span aria-hidden="true">↗</span></Link></h3>
                  <span className={styles.courseSub}>{[course.level, course.duration].filter(Boolean).join(" · ")}</span>
                </div>
                <div className={styles.cost}>
                  <strong data-long={course.fee.length > 20 || undefined}>{course.fee}</strong>
                  <span>{course.period}</span>
                </div>
                <button type="button" className={styles.pick} aria-pressed={active}
                  aria-label={active ? `Remove ${course.degree} ${course.name}, ${course.campus} from shortlist` : `${replacing !== null ? "Replace option " + slotLetters[replacing] + " with" : "Compare"} ${course.degree} ${course.name}, ${course.campus}`}
                  disabled={target < 0 || (active && replacing !== null)}
                  onClick={() => setSlot(target, active ? undefined : course)}>
                  {active ? <><SlotMark index={selected} /> Added</> : <><span aria-hidden="true">+</span> {replacing !== null ? `Use for ${slotLetters[replacing]}` : "Compare"}</>}
                </button>
              </li>;
            })}
          </ul>
          {!results.length && <div className={styles.empty}><h3>No matching programmes</h3><p>Try a different subject, campus or study level.</p><button type="button" onClick={clearFilters}>Clear filters</button></div>}
          {results.length > limit && <button type="button" className={styles.more} onClick={() => setLimit(current => current + pageSize)}>Show more programmes <span aria-hidden="true">↓</span></button>}
          <p className={styles.source}>Fee listings checked 5 November 2026. Open a programme for eligibility, additional charges and the official faculty fee schedule.</p>
        </div>
      </div>
      <span className={styles.sr} role="status">{announcement}</span>
    </section>
  );
}
