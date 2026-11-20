"use client";

import Link from "next/link";
import { useState } from "react";
import { familyNames, type FamilyId } from "@/features/explore/course-families";
import { comparisonHref, type Shortlist } from "@/features/explore/shortlist";
import { applicantEdition, applicantSource } from "@/features/programmes/finder/applicants";
import { artsExampleIds, artsExamples, type ArtsSubject } from "./arts-examples";
import type { DegreeOption } from "./degree-options";
import s from "./finder.module.css";

type FinderPicks = {
  catalog: DegreeOption[];
  slots: Shortlist;
  onToggle: (id: string) => void;
  compareUrl: string;
  subjectChoice?: ArtsSubject;
};

function degreeHref(course: DegreeOption, subject?: ArtsSubject) {
  const suffix = course.family === "arts-sciences" && subject ? "&subject=" + subject : "";
  return "/programmes/" + course.id + "?from=finder" + suffix;
}

export function ShortlistSummary({ slots, catalog, onToggle, compareUrl, subjectChoice }: FinderPicks) {
  const count = slots.filter(Boolean).length;
  if (!count) return null;
  return <section className={s.shortlist} aria-labelledby="finder-shortlist">
    <div className={s.shortlistHead}><h2 id="finder-shortlist">Your picks from these results</h2>
      <Link className={s.compareAction} href={compareUrl}>{count === 1 ? "Open comparison" : "Compare " + count + " courses"} <span aria-hidden="true">→</span></Link>
    </div>
    <ul>{slots.map((id, index) => {
      if (!id) return null;
      const course = catalog.find(c => c.id === id);
      if (!course) return null;
      const label = course.title + " · " + course.description;
      return <li key={id}><span className={s.slot}>{'ABC'[index]}</span><Link href={degreeHref(course, subjectChoice)}>{label}</Link>
        <button aria-label={"Remove " + label + " from comparison"} onClick={() => onToggle(id)}>Remove</button></li>;
    })}</ul>
  </section>;
}

export function FamilyDegrees({ family, catalog, slots, onToggle, compareUrl, subjectChoice }: FinderPicks & { family: FamilyId }) {
  const options = catalog.filter(course => course.family === family);
  const campuses = [...new Set(options.map(c => c.campus))].sort();
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [campus, setCampus] = useState("");
  const [limit, setLimit] = useState(5);
  const focus = family === "arts-sciences" && subjectChoice ? artsExamples[subjectChoice] : undefined;
  const artsOptions = family === "arts-sciences"
    ? artsExampleIds(subjectChoice).flatMap(id => options.filter(course => course.id === id)) : [];
  const familyUrl = comparisonHref(slots, "finder") + "&family=" + family + "&pick=1"
    + (focus ? "&subject=" + subjectChoice : "");
  // Exact-campus application counts come pre-sorted from the admissions catalogue.
  // A student's chosen subject takes precedence over those counts.
  const counted = options.filter(course => course.applications !== undefined);
  const suggested = [...new Set([...counted, ...options.filter(course => course.example), ...options])].slice(0, 3);
  const examples = artsOptions.length ? artsOptions : suggested;
  const filtered = options.filter(course => (!campus || course.campus === campus) &&
    query.toLocaleLowerCase("en").trim().split(/\s+/).every(term => (course.title + " " + course.description).toLocaleLowerCase("en").includes(term)));
  const browsing = expanded || Boolean(query.trim()) || Boolean(campus);
  const visible = browsing ? filtered.slice(0, limit) : examples;
  const count = slots.filter(Boolean).length;
  const more = options.length > examples.length;
  const hasCounts = visible.some(course => course.applications !== undefined);
  const id = "degrees-" + family;
  return <section className={s.degreeList} aria-labelledby={id} tabIndex={-1} id={"srm-" + family}>
    <h3 id={id}>Degrees at SRM</h3>
    <p className={s.familyCount}>{options.length} undergraduate course {options.length === 1 ? "listing" : "listings"} across {campuses.length} {campuses.length === 1 ? "campus" : "campuses"}</p>
    {more && <div className={s.degreeFilters}>
      <label>Find a degree<input type="search" placeholder="Degree, subject or campus" value={query}
        onChange={event => { setQuery(event.target.value); setLimit(5); }} /></label>
      {campuses.length > 1 && <label>Campus<select value={campus} onChange={event => { setCampus(event.target.value); setLimit(5); }}>
        <option value="">All campuses</option>{campuses.map(value => <option key={value}>{value}</option>)}</select></label>}
    </div>}
    <p className={s.exampleNote} role="status">{browsing
      ? filtered.length + (filtered.length === 1 ? " matching listing" : " matching listings")
      : focus && artsOptions.length ? "Examples for your interest in " + focus.subject
        : "Degrees to explore"}{count === 0 && " · Use Add to compare up to three degrees."}</p>
    <ul className={s.namedDegrees}>{visible.map(course => {
      const selected = slots.includes(course.id);
      return <li key={course.id}>
        <div><Link href={degreeHref(course, subjectChoice)}>{course.title}</Link><small>{course.description}</small>
          {course.applications !== undefined && <small>{course.applications.toLocaleString("en-IN")} applications</small>}</div>
        <button type="button" aria-label={"Select " + course.title + " at " + course.description + " for comparison"}
          aria-pressed={selected} disabled={!selected && count === 3} onClick={() => onToggle(course.id)}>
          <span aria-hidden="true">{selected ? "✓" : "+"}</span> {selected ? "Added" : "Add"}
        </button>
      </li>;
    })}</ul>
    {hasCounts && <details className={s.applicationNote}><summary>Reported applications at Kattankulathur · {applicantEdition} disclosure</summary>
      <p>SRM publishes the number of applications received for these courses. <a href={applicantSource}>Read SRM’s disclosure</a>.</p></details>}
    {more && !browsing && <button className={s.openOptions} onClick={() => setExpanded(true)}>Browse all {options.length} listings <span aria-hidden="true">→</span></button>}
    {browsing && visible.length < filtered.length && <button className={s.openOptions} onClick={() => setLimit(limit + 10)}>Show more degrees</button>}
    {browsing && !filtered.length && <p>Try a different subject or campus.</p>}
    {expanded && <button className={s.openOptions} onClick={() => { setExpanded(false); setQuery(""); setCampus(""); setLimit(5); }}>Back to examples</button>}
    <div className={s.degreeNext}>
      {count > 0 &&
        <><p aria-live="polite">{count === 3 ? "Your shortlist is full. Remove a course to change your choices." : count === 1 ? "One course selected. Add one more degree to compare them." : count + " courses selected."}</p>
          <Link className={s.compareAction} href={compareUrl}>{count === 1 ? "Open comparison" : "Compare " + count + " courses"} <span aria-hidden="true">→</span></Link></>}
      <Link className={s.familyBrowse} href={familyUrl}>Explore degrees in {familyNames[family]} <span aria-hidden="true">↗</span></Link>
    </div>
  </section>;
}
