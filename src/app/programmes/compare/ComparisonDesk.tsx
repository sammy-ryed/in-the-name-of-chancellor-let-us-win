"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { familyNames, type FamilyId } from "@/features/explore/course-families";
import type { ComparedCourse, Fact, PickerCourse } from "@/features/explore/course-evidence";
import { compareTopics, type Topic } from "@/features/explore/compare-topics";
import { parseShortlist, readShortlist, writeShortlist } from "@/features/explore/shortlist";
import type { TuitionRanking as Pricing } from "@/features/explore/tuition-ranking";
import { ComparisonTable } from "./ComparisonTable";
import { rowsFor, sameFact } from "./fact-rows";
import { TuitionRanking } from "./TuitionRanking";
import { ProgrammeSource, type ProgrammeEntry } from "./ProgrammeSource";
import styles from "./compare.module.css";

const letters = ["A", "B", "C"] as const;
type Slots = (ComparedCourse | null)[];

function FactRow({ label, cells, shared, headings, differences }: { label: string; cells: (Fact | undefined)[]; shared: boolean; headings: string[]; differences: boolean }) {
  if (differences && shared) return null;
  function body(cell: Fact) {
    return <>{cell.text}{cell.link && <a className={styles.source} href={cell.link.href}>{cell.link.label} <span aria-hidden="true">↗</span></a>}</>;
  }
  return <div className={styles.fact}>
    <h3>{label}</h3>
    {shared ? <div className={styles.shared}><span className={styles.sharedLabel}>Shared by your courses</span>{body(cells[0]!)}</div>
      : <div className={styles.factCells} style={{ gridTemplateColumns: "repeat(" + cells.length + ", minmax(0, 1fr))" }}>
        {cells.map((cell, index) => {
          const same = cells.findIndex(other => sameFact(other, cell));
          return <div key={index} role="group" aria-label={headings[index]}>{cell ? same < index
            ? <span className={styles.same}>See {headings[same]}.</span> : body(cell)
            : <span className={styles.same}>No corresponding entry.</span>}</div>;
        })}
      </div>}
  </div>;
}

function TopicFacts({ slots, topic, differences }: { slots: Slots; topic: Topic; differences: boolean }) {
  const courses = slots.flatMap((course, i) => course ? [{ course, i }] : []);
  const byRow = rowsFor(courses.map(({ course }) => course), topic);
  const common = byRow.filter(row => row.shared);
  const unique = byRow.filter(row => !row.shared);
  return <div className={styles.topic}>
    {differences && !unique.length && <p>All the recorded facts in this topic are shared. Turn off “Show differences” to read them.</p>}
    <div className={styles.desktopFacts}>{byRow.map(row => <FactRow {...row} headings={courses.map(({course,i}) => "option " + letters[i] + ", " + course.short)} differences={differences} key={row.label} />)}</div>
    <div className={styles.phoneFacts}>
      {courses.map(({course, i}, col) => unique.some(row => row.cells[col]) && <section className={styles.courseSection} key={course.id}>
        <h3><span className={styles.letter}>{letters[i]}</span>{course.short}</h3>
        <dl>{unique.map(({label, cells}) => {
          const f = cells[col];
          if (!f) return null;
          const first = cells.findIndex(cell => sameFact(cell, f));
          return <div key={label}><dt>{label}</dt><dd>{first < col ? "See option " + letters[courses[first].i] + " above." : <>
            {f.text}{f.link && <a className={styles.source} href={f.link.href}>{f.link.label} ↗</a>}</>}</dd></div>;
        })}</dl>
      </section>)}
      {!differences && common.length > 0 && <section className={styles.commonSection}><h3>Shared by your courses</h3><dl>
        {common.map(({label, cells}) => <div key={label}><dt>{label}</dt><dd>{cells[0]!.text}
          {cells[0]!.link && <a className={styles.source} href={cells[0]!.link.href}>{cells[0]!.link.label} ↗</a>}</dd></div>)}
      </dl></section>}
    </div>
  </div>;
}

function CoursePicker({ catalog, slots, position, initialFamily, initialQuery, onPick, onClose }: {
  catalog: PickerCourse[]; slots: Slots; position: number; initialFamily: FamilyId | ""; initialQuery: string;
  onPick: (course: PickerCourse) => void; onClose?: () => void;
}) {
  const [family, setFamily] = useState<FamilyId | "">(initialFamily);
  const [query, setQuery] = useState(initialQuery);
  const [limit, setLimit] = useState(12);
  const [level, setLevel] = useState(initialFamily ? "Undergraduate" : "");
  const normalise = (s: string) => s.toLowerCase().replaceAll(".", "").replaceAll("/", " ");
  const terms = normalise(query).trim().split(/\s+/).filter(Boolean);
  const results = catalog.filter(c => (!family || c.family === family) && (!level || c.level === level)
    && terms.every(t => normalise([c.title, c.short, c.degree, c.campus, c.shift].join(" ")).includes(t)));
  return <section className={styles.picker} aria-label={"Choose course " + letters[position]}>
    <div className={styles.pickerHead}><h2>Choose course {letters[position]}</h2>{onClose && <button type="button" onClick={onClose}>Cancel</button>}</div>
    <div className={styles.filters}>
      <label>Find a course<input autoComplete="off" type="search" value={query} placeholder="Subject, degree or campus" onChange={e => { setQuery(e.target.value); setLimit(12); }} /></label>
      <label>Course family<select value={family} onChange={e => { setFamily(e.target.value as FamilyId | ""); setLimit(12); }}><option value="">All families</option>
        {Object.entries(familyNames).map(([id,label]) => <option value={id} key={id}>{label}</option>)}</select></label>
      <label>Study level<select value={level} onChange={e => { setLevel(e.target.value); setLimit(12); }}><option value="">All levels</option>
        {[...new Set(catalog.map(c => c.level))].sort().map(v => <option key={v}>{v}</option>)}</select></label>
    </div>
    <p className={styles.resultCount} role="status">{results.length} course and campus {results.length === 1 ? "option" : "options"}</p>
    {!results.length && <p>Try a shorter subject name, another campus or a wider filter.</p>}
    <ul className={styles.options}>{results.slice(0, limit).map(c => {
      const held = slots.findIndex(s => s?.id === c.id);
      return <li key={c.id}><button disabled={held >= 0 && held !== position} onClick={() => onPick(c)}>
        <span><small>{[c.degree, c.campus, c.shift && "Shift " + c.shift, c.mode].filter(Boolean).join(" · ")}</small><strong>{c.title}</strong></span>
        <span className={styles.assign}>{held >= 0 ? letters[held] : "+"}</span>
      </button></li>;
    })}</ul>
    {results.length > limit && <button className={styles.more} onClick={() => setLimit(limit + 24)}>Show more courses</button>}
  </section>;
}

const topicNotes: Record<Topic, string> = {
  study: "Subjects, electives and a project you could try.",
  work: "Possible first roles, daily tasks and further study.",
  pay: "SRM placement outcomes and Indian market salaries.",
  ai: "Tasks AI can help with and decisions you would make.",
  cost: "Tuition from highest to lowest, plus other charges.",
};
export function ComparisonDesk({ slots, catalog, family, initialQuery, explicitCompare, requestedPicker, entry, pricing }: {
  slots: Slots; catalog: PickerCourse[]; family: FamilyId | ""; initialQuery: string; explicitCompare: boolean;
  requestedPicker: boolean; entry?: ProgrammeEntry; pricing: Pricing;
}) {
  const router = useRouter();
  const tableView = useSearchParams().get("view") === "table";
  const [pending, startTransition] = useTransition();
  const [topic, setTopic] = useState<Topic>("study");
  const [differences, setDifferences] = useState(false);
  const [change, setChange] = useState(0);
  const [replace, setReplace] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [copyFallback, setCopyFallback] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const nextFocus = useRef(false);
  const mobileTools = useRef<HTMLDivElement>(null);
  const topicHeading = useRef<HTMLHeadingElement>(null);
  const active = slots.flatMap((course, index) => course ? [{ course, index }] : []);
  const shortlist = slots.map(c => c?.id || "").join(",");
  const shortlistParams = new URLSearchParams({ compare: shortlist });
  if (tableView) shortlistParams.set("view", "table");
  const firstEmpty = slots.findIndex(c => !c);
  const target = firstEmpty >= 0 ? firstEmpty : replace;
  const pickerVisible = !active.length || requestedPicker;
  const topicTitle = compareTopics.find(item => item.id === topic)!.label;

  useEffect(() => {
    if (explicitCompare) {
      writeShortlist(parseShortlist(shortlist));
      return;
    }
    const saved = readShortlist();
    if (!saved.some(Boolean)) return;
    const params = new URLSearchParams(window.location.search);
    params.set("compare", saved.join(","));
    if (requestedPicker) params.set("pick", "1");
    router.replace("/programmes/compare?" + params, { scroll: false });
  }, [explicitCompare, requestedPicker, router, shortlist]);

  useEffect(() => {
    if (!nextFocus.current) return;
    nextFocus.current = false;
    resultHeading.current?.focus({ preventScroll: true });
  }, [shortlist]);

  function update(index: number, id: string) {
    if (pending) return;
    nextFocus.current = true;
    const ids = slots.map((c, i) => i === index ? id : c?.id || "");
    writeShortlist(ids);
    const params = new URLSearchParams({ compare: ids.join(",") });
    if (family) params.set("family", family);
    if (tableView) params.set("view", "table");
    dialog.current?.close();
    setReplace(null);
    setMessage(id ? "Course " + letters[index] + " selected." : "Course " + letters[index] + " removed.");
    setCopyFallback("");
    startTransition(() => router.push("/programmes/compare?" + params, { scroll: false }));
  }

  function changeView(table: boolean) {
    if (table === tableView) return;
    const url = new URL(window.location.href);
    if (table) url.searchParams.set("view", "table");
    else url.searchParams.delete("view");
    window.history.replaceState(null, "", url);
    setCopyFallback("");
    setMessage("");
  }

  function changeTopic(value: Topic) {
    setTopic(value);
    requestAnimationFrame(() => {
      const heading = topicHeading.current;
      if (!heading) return;
      const bar = mobileTools.current;
      const root = getComputedStyle(document.documentElement);
      const siteHeader = Number.parseFloat(root.getPropertyValue("--header-height")) || 52;
      const toolbarHeight = bar && getComputedStyle(bar).position === "sticky" ? bar.offsetHeight : 0;
      const offset = heading.getBoundingClientRect().top - siteHeader - toolbarHeight - 10;
      if (Math.abs(offset) > 4) window.scrollBy({ top: offset, behavior: "instant" });
    });
  }
  function open(index: number) { setChange(index); dialog.current?.showModal(); }
  async function shareList() {
    const url = new URL("/programmes/compare", window.location.origin);
    url.search = shortlistParams.toString();
    try { await navigator.clipboard.writeText(url.href); setMessage("Shortlist link copied."); }
    catch { setCopyFallback(url.href); setMessage("Copy the shortlist link below."); }
  }

  const showOnly = <label className={styles.toggle}><input type="checkbox" checked={active.length > 1 && differences} disabled={active.length < 2}
    onChange={event => setDifferences(event.target.checked)} /> Show differences</label>;
  const courseLabels = active.map(({course,index}) => <div key={course.id} className={styles.courseHead}>
    <span className={styles.letter}>{letters[index]}</span><div className={styles.headText}>
      <small>{course.degree} · {course.campus}{course.shift && " · Shift " + course.shift}</small>
      <h3><Link prefetch={false} href={"/programmes/" + course.id + "?" + shortlistParams} title={course.title}>{course.short}</Link></h3>
      <div className={styles.slotActions}><button disabled={pending} onClick={() => open(index)} aria-label={"Change course " + letters[index]}>Change</button>
        <button disabled={pending} onClick={() => update(index, "")} aria-label={"Remove course " + letters[index]}>Remove</button></div>
    </div>
  </div>);
  return <div className={styles.desk} aria-busy={pending}>
    <div className={styles.deskHead}><div>
      <h2 ref={resultHeading} tabIndex={-1}>{active.length ? "Your shortlist" : "Choose your first course"}</h2>
      {active.length === 1 && <p>Add a second course to see the differences.</p>}
    </div>
      <div className={styles.deskActions}>
        {firstEmpty >= 0 && active.length > 0 && <button className={styles.add} disabled={pending} onClick={() => open(firstEmpty)}>+ Add course {letters[firstEmpty]}</button>}
        {active.length > 0 && <button className={styles.share} onClick={shareList}>Share shortlist</button>}
        <Link className={styles.browse} href="/programmes?resume=compare">Continue browsing programmes <span aria-hidden="true">→</span></Link>
      </div>
    </div>
    <p role="status" className={styles.shareStatus}>{message}</p>
    {copyFallback && <label className={styles.copy}>Shortlist URL<input readOnly value={copyFallback} onFocus={event => event.target.select()} /></label>}
    {pickerVisible && <div className={styles.entryPicker}>
      {active.length > 0 && <div className={styles.pickerPrompt}>
        <p>{target === null ? "Your shortlist is full. Choose a course to replace before adding one from this page."
          : "Choose a course to add to your shortlist" + (family ? " from " + familyNames[family] : "") + "."}</p>
        {firstEmpty < 0 && <label>Replace which course? <select value={replace ?? ""} onChange={event => setReplace(event.target.value ? Number(event.target.value) : null)}>
          <option value="">Choose a slot</option>{active.map(({course,index}) => <option key={course.id} value={index}>{letters[index]} · {course.short} · {course.campus}</option>)}</select></label>}
        <Link href={"/programmes/compare?" + shortlistParams} scroll={false}>Keep my current shortlist</Link>
      </div>}
      {target !== null && <>
        {entry && <ProgrammeSource entry={entry} catalog={catalog} disabledIds={slots.flatMap(c => c ? [c.id] : [])} onPick={id => update(target,id)} />}
        <CoursePicker key={family + "|" + initialQuery} catalog={catalog} slots={slots} position={target} initialFamily={family} initialQuery={initialQuery} onPick={course => update(target,course.id)} />
      </>}
    </div>}
    {active.length > 0 && <>
      <div className={styles.viewToolbar}>
        <div className={styles.viewSwitch} role="group" aria-label="Comparison layout">
          <button type="button" aria-pressed={!tableView} aria-controls="comparison-results" onClick={() => changeView(false)}>
            <span className={styles.topicIcon} aria-hidden="true" />Topic view
          </button>
          <button type="button" aria-pressed={tableView} aria-controls="comparison-results" onClick={() => changeView(true)}>
            <span className={styles.tableIcon} aria-hidden="true" />Table view
          </button>
        </div>
        {tableView && showOnly}
      </div>
      <details className={tableView ? styles.tableShortlist : styles.mobileShortlist}>
        <summary>View or change your {active.length === 1 ? "course" : active.length + " courses"}</summary>
        <div className={styles.editCourses}>{courseLabels}</div>
      </details>
      {tableView ? <div id="comparison-results">
        <ComparisonTable slots={slots} differences={active.length > 1 && differences} pricing={pricing} />
      </div> : <div className={styles.layout}>
        <aside className={styles.rail} aria-label="Comparison topics">
          <h2>Compare by</h2>
          <div className={styles.toc}>{compareTopics.map(item => <button key={item.id} aria-controls="comparison-results" aria-pressed={topic === item.id} onClick={() => changeTopic(item.id)}>
            {item.label}<span aria-hidden="true">›</span></button>)}</div>
          {showOnly}
        </aside>
        <div className={styles.mobileTools} ref={mobileTools}>
          <label className={styles.topicChooser}><span>Compare by</span><select aria-label="Comparison topic" aria-controls="comparison-results" value={topic} onChange={event => changeTopic(event.target.value as Topic)}>
            {compareTopics.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select></label>{showOnly}
        </div>
        <section className={styles.board} id="comparison-results" aria-labelledby="topic-title">
          <header className={styles.topicHead}><h2 id="topic-title" ref={topicHeading}>{topicTitle}</h2><p>{topicNotes[topic]}</p></header>
          <div className={styles.headings} style={{ gridTemplateColumns: "repeat(" + active.length + ", minmax(0, 1fr))" }}>{courseLabels}</div>
          {topic === "cost" && <TuitionRanking {...pricing} />}
          <TopicFacts slots={slots} topic={topic} differences={active.length > 1 && differences} />
        </section>
      </div>}
    </>}
    <dialog ref={dialog} className={styles.dialog} aria-label={"Choose course " + letters[change]}>
      <CoursePicker key={change + "-" + shortlist} catalog={catalog} slots={slots} position={change} initialFamily={family} initialQuery="" onClose={() => dialog.current?.close()} onPick={course => update(change,course.id)} />
    </dialog>
  </div>;
}
