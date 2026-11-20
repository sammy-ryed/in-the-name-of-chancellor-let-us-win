"use client";

import Link from "next/link";
import { applicantEdition, applicantSource } from "@/features/programmes/finder/applicants";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { artsExampleIds, artsExamples, type ArtsSubject } from "@/features/admissions/course-finder/arts-examples";
import { familyNames, type FamilyId } from "@/features/explore/course-families";
import type { ComparedCourse, Fact, PickerCourse } from "@/features/explore/course-evidence";
import { compareTopics, type Topic } from "@/features/explore/compare-topics";
import { parseShortlist, readShortlist, writeShortlist, type ShortlistScope } from "@/features/explore/shortlist";
import type { TuitionRanking as Pricing } from "@/features/explore/tuition-ranking";
import { ComparisonTable } from "./ComparisonTable";
import { routes } from "@/lib/navigation";
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
  const commonFacts = !differences && common.length > 0 && <section className={styles.commonSection}><h3>Shared by your courses</h3><dl>
        {common.map(({label, cells}) => <div key={label}><dt>{label}</dt><dd>{cells[0]!.text}
          {cells[0]!.link && <a className={styles.source} href={cells[0]!.link.href}>{cells[0]!.link.label} ↗</a>}</dd></div>)}
      </dl></section>;
  return <div className={styles.topic}>
    {differences && !unique.length && <p>All the recorded facts in this topic are shared. Turn off “Show differences” to read them.</p>}
    <div className={styles.desktopFacts}>{byRow.map(row => <FactRow {...row} headings={courses.map(({course,i}) => "option " + letters[i] + ", " + course.short)} differences={differences} key={row.label} />)}</div>
    <div className={styles.phoneFacts}>
      {topic === "ai" && commonFacts}
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
      {topic !== "ai" && commonFacts}
    </div>
  </div>;
}

function subjectForCourses(ids: string[]) {
  const subjects = (Object.keys(artsExamples) as ArtsSubject[]).filter(key => ids.some(id => artsExamples[key].ids.includes(id)));
  return subjects.length === 1 ? subjects[0] : undefined;
}

function CoursePicker({ catalog, slots, position, initialFamily, initialQuery, finder = false, subject, onPick, onClose }: {
  catalog: PickerCourse[]; slots: Slots; position: number; initialFamily: FamilyId | ""; initialQuery: string;
  finder?: boolean; subject?: ArtsSubject; onPick: (course: PickerCourse) => void; onClose?: () => void;
}) {
  const [family, setFamily] = useState<FamilyId | "">(initialFamily);
  const [query, setQuery] = useState(initialQuery);
  const batch = 5;
  const [limit, setLimit] = useState(batch);
  const [level, setLevel] = useState(initialFamily ? "Undergraduate" : "");
  const normalise = (s: string) => s.toLowerCase().replaceAll(".", "").replaceAll("/", " ");
  const terms = normalise(query).trim().split(/\s+/).filter(Boolean);
  const results = catalog.filter(c => (!family || c.family === family) && (!level || c.level === level)
    && terms.every(t => normalise([c.title, c.short, c.degree, c.campus, c.shift].join(" ")).includes(t)));
  const featured = finder && family === "arts-sciences" ? artsExampleIds(subject) : [];
  if (featured.length) {
    const priority = new Map(featured.map((id, index) => [id, index]));
    results.sort((a, b) => (priority.get(a.id) ?? featured.length) - (priority.get(b.id) ?? featured.length));
  }
  const examples = featured.length ? results.filter(course => featured.includes(course.id)) : [];
  const showingExamples = !terms.length && limit === batch && examples.length > 0;
  const visible = showingExamples ? examples : results.slice(0, limit);
  let listTitle = "Matching courses";
  if (showingExamples) listTitle = subject ? "Degrees for " + artsExamples[subject].subject : "Degrees to explore";
  else if (!terms.length && examples.length) listTitle = "More degrees in arts, sciences & humanities";
  else if (!terms.length && results[0]?.applications !== undefined) listTitle = "Most applied to";
  const filters = [family && familyNames[family], level].filter(Boolean).join(" · ");
  return <section className={styles.picker} aria-label={"Choose course " + letters[position]}>
    {onClose && <div className={styles.pickerHead}><h2>Choose course {letters[position]}</h2><button type="button" onClick={onClose}>Cancel</button></div>}
    <label className={styles.findCourse}>Find a course
      <input type="search" autoComplete="off" value={query} placeholder="Subject, degree or campus" onChange={e => { setQuery(e.target.value); setLimit(batch); }} />
    </label>
    <details className={styles.pickerFilters}>
      <summary>Filter courses{filters && <small> · {filters}</small>}</summary>
      <div className={styles.filters}>
        <label>Course family<select value={family} onChange={e => { setFamily(e.target.value as FamilyId | ""); setLimit(batch); }}><option value="">All families</option>
          {Object.entries(familyNames).map(([id,label]) => <option value={id} key={id}>{label}</option>)}</select></label>
        <label>Study level<select value={level} onChange={e => { setLevel(e.target.value); setLimit(batch); }}><option value="">All levels</option>
          {[...new Set(catalog.map(c => c.level))].sort().map(v => <option key={v}>{v}</option>)}</select></label>
      </div>
    </details>
    <div className={styles.listHead}>
      <h3>{listTitle}</h3>
      <span className={styles.resultCount} role="status">{showingExamples ? visible.length + " suggestions" : visible.length + " of " + results.length}</span>
    </div>
    {visible.some(c => c.applications !== undefined) && <p className={styles.listSource}><a href={applicantSource}>Applications at Kattankulathur · {applicantEdition} disclosure</a></p>}
    {!results.length && <p>Try a shorter subject name or clear your filters.</p>}
    <ul className={styles.options}>{visible.map(c => {
      const held = slots.findIndex(s => s?.id === c.id);
      return <li key={c.id}><button disabled={held >= 0 && held !== position} onClick={() => onPick(c)}>
        <span><strong>{c.title.replace(/\bW\/S\.?\s+(?:in\s+)?/ig, "with ")}</strong><small>{[c.degree, c.campus, c.shift && "Shift " + c.shift, c.mode].filter(Boolean).join(" · ")}</small></span>
        <span className={styles.rowEnd}>{c.applications !== undefined && <small>{c.applications.toLocaleString("en-IN")} applications</small>}
          <span className={styles.assign} aria-hidden="true">{held >= 0 ? letters[held] : "+"}</span></span>
      </button></li>;
    })}</ul>
    {results.length > visible.length && <button className={styles.more} onClick={() => setLimit(limit + 10)}>
      {showingExamples ? "Browse all " + results.length + " courses in this family" : "Show more courses"}
    </button>}
  </section>;
}

const topicNotes: Record<Topic, string> = {
  study: "Subjects, electives and a project you could try.",
  work: "Possible first roles, daily tasks and further study.",
  pay: "SRM placement outcomes and Indian market salaries.",
  ai: "What AI changes in entry-level hiring and what SRM reports about placements.",
  cost: "Tuition from highest to lowest, plus other charges.",
};
export function ComparisonDesk({ slots, catalog, family, initialQuery, explicitCompare, requestedPicker, entry, pricing, scope, subject }: {
  slots: Slots; catalog: PickerCourse[]; family: FamilyId | ""; initialQuery: string; explicitCompare: boolean;
  requestedPicker: boolean; entry?: ProgrammeEntry; pricing: Pricing; scope: ShortlistScope; subject?: ArtsSubject;
}) {
  const router = useRouter();
  const tableView = useSearchParams().get("view") === "table";
  const [pending, startTransition] = useTransition();
  const [topic, setTopic] = useState<Topic>("study");
  const [differences, setDifferences] = useState(false);
  const [change, setChange] = useState<number | null>(null);
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
  // A shared URL carries only the public A/B/C selections and the table view.
  const shareParams = new URLSearchParams({ compare: shortlist });
  if (tableView) shareParams.set("view", "table");
  const isFinder = scope === "finder";
  const pickerFamily = family || (isFinder ? active[0]?.course.family || (subject && "arts-sciences") : "") || "";
  const artsIds = active.filter(({ course }) => course.family === "arts-sciences").map(({ course }) => course.id);
  const pickerSubject = isFinder && pickerFamily === "arts-sciences" ? subject ?? subjectForCourses(artsIds) : undefined;
  const shortlistParams = new URLSearchParams(shareParams);
  if (isFinder) {
    shortlistParams.set("from", "finder");
    if (pickerFamily) shortlistParams.set("family", pickerFamily);
    if (pickerSubject) shortlistParams.set("subject", pickerSubject);
  }
  const browseHref = isFinder ? routes.finder.href : "/programmes?resume=compare";
  const browseText = isFinder ? "Back to the SRM Course Finder" : "Continue browsing programmes";
  const firstEmpty = slots.findIndex(c => !c);
  const target = firstEmpty >= 0 ? firstEmpty : replace;
  const pickerVisible = !active.length || requestedPicker;
  const topicTitle = compareTopics.find(item => item.id === topic)!.label;

  useEffect(() => {
    if (explicitCompare) {
      writeShortlist(parseShortlist(shortlist), scope);
      return;
    }
    const saved = readShortlist(scope);
    if (!saved.some(Boolean)) return;
    const params = new URLSearchParams(window.location.search);
    params.set("compare", saved.join(","));
    if (requestedPicker) params.set("pick", "1");
    router.replace("/programmes/compare?" + params, { scroll: false });
  }, [explicitCompare, requestedPicker, router, scope, shortlist]);

  useEffect(() => {
    if (!nextFocus.current) return;
    nextFocus.current = false;
    resultHeading.current?.focus({ preventScroll: true });
  }, [shortlist]);

  function update(index: number, id: string) {
    if (pending) return;
    nextFocus.current = true;
    const ids = slots.map((c, i) => i === index ? id : c?.id || "");
    writeShortlist(ids, scope);
    const params = new URLSearchParams({ compare: ids.join(",") });
    if (isFinder) params.set("from", "finder");
    const picked = id ? catalog.find(c => c.id === id) : undefined;
    let nextFamily = family;
    if (isFinder) {
      if (picked && family) nextFamily = picked.family || "";
      if (!ids.some(Boolean)) nextFamily = slots[index]?.family || pickerFamily;
      const continuingFamily = nextFamily || (picked?.family ?? pickerFamily);
      if (continuingFamily === "arts-sciences") {
        const nextSubject = (picked && subjectForCourses([picked.id])) || pickerSubject;
        if (nextSubject) params.set("subject", nextSubject);
      }
    }
    if (nextFamily) params.set("family", nextFamily);
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
  useEffect(() => {
    if (change !== null && !dialog.current?.open) dialog.current?.showModal();
  }, [change]);
  function open(index: number) { setChange(index); }
  async function shareList() {
    const url = new URL("/programmes/compare", window.location.origin);
    url.search = shareParams.toString();
    try { await navigator.clipboard.writeText(url.href); setMessage("Shortlist link copied."); }
    catch { setCopyFallback(url.href); setMessage("Copy the shortlist link below."); }
  }

  const inlinePicker = target === null ? null : isFinder && !pickerFamily && !initialQuery
    ? <p>Choose a family in the course finder to explore its degrees here.</p>
    : <CoursePicker key={[pickerFamily, pickerSubject, initialQuery].join("|")} catalog={catalog} slots={slots} position={target} finder={isFinder} subject={pickerSubject} initialFamily={pickerFamily} initialQuery={initialQuery} onPick={course => update(target,course.id)} />;

  const editing = change === null ? null : slots[change];
  const dialogFamily = (isFinder && editing?.family) || pickerFamily;
  const dialogSubject = isFinder && dialogFamily === "arts-sciences"
    ? subject ?? (editing && subjectForCourses([editing.id])) ?? pickerSubject : undefined;
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
        {active.length > 0 && <Link className={styles.browse} href={browseHref}>{browseText} <span aria-hidden="true">→</span></Link>}
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
        {entry?.candidates.length ? <details className={styles.alternative}><summary>Choose a different programme</summary>{inlinePicker}</details> : inlinePicker}
      </>}
    </div>}
    {!active.length && <Link className={styles.browse} href={browseHref}>{browseText} <span aria-hidden="true">→</span></Link>}
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
    <dialog ref={dialog} className={styles.dialog} onClose={() => setChange(null)} aria-label={change === null ? "Choose course" : "Choose course " + letters[change]}>
      {change !== null && <CoursePicker key={change + "-" + shortlist} catalog={catalog} slots={slots} position={change} finder={isFinder} subject={dialogSubject} initialFamily={dialogFamily} initialQuery="" onClose={() => dialog.current?.close()} onPick={course => update(change,course.id)} />}
    </dialog>
  </div>;
}
