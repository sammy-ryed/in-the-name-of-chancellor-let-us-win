import Link from "next/link";
import { useState } from "react";
import type { DegreeOption } from "./degree-options";
import s from "./finder.module.css";

export function SubjectLookup({ catalog }: { catalog: DegreeOption[] }) {
  const [query, setQuery] = useState("");
  const words = query.trim().toLowerCase().replace(/\bmaths\b/g, "math");
  const terms = words.split(/\s+/);
  const matches = words.length < 2 ? [] : catalog.filter(course => terms.every(term => course.title.toLowerCase().includes(term)));
  return <details className={s.lookup}>
    <summary>Have a different subject in mind?</summary>
    <div className={s.lookupBody}>
      <label>Look up a subject at SRM
        <input type="search" value={query} placeholder="Try psychology, film or maths" onChange={event => setQuery(event.target.value)} />
      </label>
      {words.length >= 2 && <p role="status">{matches.length ? matches.length + (matches.length === 1 ? " matching course and campus listing" : " matching course and campus listings") : "No matching degree titles. Try a broader subject."}</p>}
      {matches.length > 0 && <ul>{matches.slice(0, 4).map(course => <li key={course.id}>
        <Link href={"/programmes/" + course.id + "?from=finder"}><strong>{course.title}</strong><small>{course.description}</small></Link>
      </li>)}</ul>}
      {words.length >= 2 && <Link className={s.openOptions} href={"/programmes?" + new URLSearchParams({ view: "all", q: words })}>Search the full programme directory <span aria-hidden="true">→</span></Link>}
    </div>
  </details>;
}
