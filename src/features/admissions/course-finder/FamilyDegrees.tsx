"use client";

import Link from "next/link";
import { useState } from "react";
import { familyNames, type FamilyId } from "@/features/explore/course-families";
import { addToShortlist, comparisonHref, readShortlist, writeShortlist, type Shortlist } from "@/features/explore/shortlist";
import type { DegreeOption } from "./degree-options";
import s from "./finder.module.css";

function toggleCourse(id: string) {
  const current = readShortlist();
  writeShortlist(current.includes(id) ? current.map(value => value === id ? "" : value) : addToShortlist(current, id));
}

export function ShortlistSummary({ slots, catalog }: { slots: Shortlist; catalog: DegreeOption[] }) {
  const count = slots.filter(Boolean).length;
  if (!count) return null;
  return <section className={s.shortlist} aria-labelledby="finder-shortlist">
    <div className={s.shortlistHead}><h2 id="finder-shortlist">Your course shortlist</h2>
      <Link className={s.compareAction} href={comparisonHref(slots)}>{count === 1 ? "Open comparison" : "Compare " + count + " courses"} <span aria-hidden="true">→</span></Link>
    </div>
    <ul>{slots.map((id, index) => {
      if (!id) return null;
      const course = catalog.find(c => c.id === id);
      const label = course ? course.title + " · " + course.description : "View selected course " + "ABC"[index];
      return <li key={id}><span className={s.slot}>{'ABC'[index]}</span><Link href={"/programmes/" + id}>{label}</Link>
        <button aria-label={"Remove " + label + " from comparison"} onClick={() => toggleCourse(id)}>Remove</button></li>;
    })}</ul>
  </section>;
}

export function FamilyDegrees({ family, catalog, slots }: { family: FamilyId; catalog: DegreeOption[]; slots: Shortlist }) {
  const options = catalog.filter(course => course.family === family);
  const campuses = [...new Set(options.map(c => c.campus))].sort();
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [campus, setCampus] = useState("");
  const [limit, setLimit] = useState(5);
  const examples = options.filter(course => course.example);
  const filtered = options.filter(course => (!campus || course.campus === campus) &&
    query.toLocaleLowerCase("en").trim().split(/\s+/).every(term => (course.title + " " + course.description).toLocaleLowerCase("en").includes(term)));
  const visible = expanded ? filtered.slice(0,limit) : (examples.length ? examples : options.slice(0,3));
  const count = slots.filter(Boolean).length;
  const more = options.length > examples.length && options.length > 3;
  const id = "degrees-" + family;
  return <section className={s.degreeList} aria-labelledby={id} tabIndex={-1} id={"srm-" + family}>
    <h3 id={id}>Degrees at SRM</h3>
    <p className={s.familyCount}>{options.length} undergraduate course {options.length === 1 ? "listing" : "listings"} across {campuses.length} {campuses.length === 1 ? "campus" : "campuses"}</p>
    {more && <button className={s.openOptions} aria-expanded={expanded} onClick={() => setExpanded(value => !value)}>
      {expanded ? "Back to examples" : "Browse all " + options.length + " listings"} <span aria-hidden="true">{expanded ? "−" : "+"}</span>
    </button>}
    {expanded && <div className={s.degreeFilters}>
      <label>Find a degree<input type="search" placeholder="Degree, subject or campus" value={query}
        onChange={event => { setQuery(event.target.value); setLimit(5); }} /></label>
      {campuses.length > 1 && <label>Campus<select value={campus} onChange={event => { setCampus(event.target.value); setLimit(5); }}>
        <option value="">All campuses</option>{campuses.map(value => <option key={value}>{value}</option>)}</select></label>}
      <span role="status">{filtered.length} matching {filtered.length === 1 ? "listing" : "listings"}</span>
    </div>}
    <ul className={s.namedDegrees}>{visible.map(course => {
      const selected = slots.includes(course.id);
      return <li key={course.id}>
        <div><small>{course.description}</small><Link href={"/programmes/" + course.id}>{course.title}</Link></div>
        <button type="button" aria-label={"Select " + course.title + " at " + course.description + " for comparison"}
          aria-pressed={selected} disabled={!selected && count === 3} onClick={() => toggleCourse(course.id)}>
          <span aria-hidden="true">{selected ? "✓" : "+"}</span> {selected ? "Added" : "Add"}
        </button>
      </li>;
    })}</ul>
    {expanded && visible.length < filtered.length && <button className={s.openOptions} onClick={() => setLimit(limit + 10)}>Show more degrees</button>}
    {expanded && !filtered.length && <p>Try a different subject or campus.</p>}
    <div className={s.degreeNext}>
      {count === 0 ? <p>Select up to three degrees to compare. Open a degree to check fees, entry subjects and how to apply.</p> :
        <><p aria-live="polite">{count === 3 ? "Your shortlist is full. Remove a course to change your choices." : count === 1 ? "One course selected. Add another from this family or another direction." : count + " courses selected."}</p>
          <Link className={s.compareAction} href={comparisonHref(slots)}>{count === 1 ? "Open comparison" : "Compare " + count + " courses"} <span aria-hidden="true">→</span></Link></>}
      <Link className={s.familyBrowse} href={"/programmes/compare?family=" + family}>Explore degrees in {familyNames[family]} <span aria-hidden="true">↗</span></Link>
    </div>
  </section>;
}
