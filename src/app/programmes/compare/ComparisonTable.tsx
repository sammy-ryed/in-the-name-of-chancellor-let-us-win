"use client";

import { useId, useRef, useState, type CSSProperties } from "react";
import { compareTopics, type Topic } from "@/features/explore/compare-topics";
import type { ComparedCourse, Fact } from "@/features/explore/course-evidence";
import { rupees, type TuitionRanking } from "@/features/explore/tuition-ranking";
import { comparisonRow, rowsFor, sameFact, type ComparisonRow } from "./fact-rows";
import styles from "./comparison-table.module.css";

const letters = ["A", "B", "C"];
type Column = { course: ComparedCourse; slot: number; headingId: string };

function columnTitle(course: ComparedCourse) {
  if (/^Education \(/.test(course.short) && course.degree === "B.Ed") return "Education";
  return course.short
    .replace(/^Computer Science and Engineering (?:W\/S (?:in )?|with speciali[sz]ation in )/i, "CSE · ")
    .replace(/^Electronics and Communication Engineering (?:W\/S (?:in )?|with speciali[sz]ation in )/i, "ECE · ")
    .replace(/ (?:W\/S (?:in )?|with speciali[sz]ation in )/i, " · ");
}

function courseMetadata(course: ComparedCourse, courses: ComparedCourse[]) {
  const showMode = courses.some(other => other.id !== course.id && other.mode !== course.mode
    && columnTitle(other).toLowerCase() === columnTitle(course).toLowerCase()
    && other.campus === course.campus && other.degree === course.degree && other.shift === course.shift);
  return [course.degree, course.campus, course.shift && "Shift " + course.shift, showMode && (course.mode || "Mode unspecified")].filter(Boolean).join(" · ");
}

function priceOrder(columns: Column[], pricing: TuitionRanking) {
  const label = "Tuition rank";
  const cells = columns.map(({slot}) => {
    const excluded = pricing.excluded.find(entry => entry.slot === slot);
    if (excluded) return { label, text: "Confirm before ranking. " + excluded.explanation };
    const group = pricing.groups.find(group => group.rows.some(row => row.slot === slot));
    const entry = group?.rows.find(row => row.slot === slot);
    if (!group || !entry) return;
    if (!entry.rank) return { label, text: "Only one verified option for this billing period (" + group.period.toLowerCase() + ")." };
    const cheapest = group.rows.filter(row => row.amount === group.lowest).map(row => letters[row.slot]).join(" and ");
    const tied = group.rows.filter(row => row.amount === entry.amount).map(row => letters[row.slot]);
    const rank = tied.length > 1 ? entry.rank + " (" + tied.join(" and ") + ")" : entry.rank;
    const difference = entry.aboveLowest > 0
      ? ". " + rupees(entry.amount) + " − " + rupees(group.lowest) + " = " + rupees(entry.aboveLowest) + " above " + cheapest + "."
      : group.difference === 0 ? ". The difference is ₹0." : ".";
    return { label, text: rank + " · " + group.period.toLowerCase() + difference };
  });
  return comparisonRow(label, cells);
}

function Evidence({ fact }: { fact: Fact }) {
  return <>{fact.text}{fact.link && <a href={fact.link.href}>{fact.link.label} <span aria-hidden="true">↗</span></a>}</>;
}

function EvidenceRow({ row, columns, groupHeader, headerId }: {
  row: ComparisonRow; columns: Column[]; groupHeader: string; headerId: string;
}) {
  return <tr>
    <th scope="row" id={headerId} className={styles.rowLabel}>{row.label}</th>
    {row.shared ? <td colSpan={columns.length} headers={[groupHeader,headerId,...columns.map(c => c.headingId)].join(" ")}>
      <div className={styles.common}><small>Shared by all {columns.length} courses</small><Evidence fact={row.cells[0]!} /></div>
    </td> : row.cells.map((fact, index) => {
      const first = row.label === "Broader SRM cohort" ? row.cells.findIndex(other => sameFact(fact, other)) : index;
      return <td key={columns[index].slot} headers={groupHeader + " " + headerId + " " + columns[index].headingId}>
        {fact ? first < index ? <span className={styles.muted}>Same as option {letters[columns[first].slot]}.</span> : <Evidence fact={fact} />
        : <span className={styles.muted}>No corresponding entry.</span>}
      </td>;
    })}
  </tr>;
}

export function ComparisonTable({ slots, differences, pricing }: {
  slots: (ComparedCourse | null)[]; differences: boolean; pricing: TuitionRanking;
}) {
  const id = useId();
  const region = useRef<HTMLDivElement>(null);
  const columnHeaders = useRef<HTMLTableSectionElement>(null);
  const groupRows = useRef<Partial<Record<Topic, HTMLTableRowElement | null>>>({});
  const [current, setCurrent] = useState<Topic>("study");
  const columns = slots.flatMap((course, slot) => course ? [{course,slot,headingId:id + "-col-" + slot}] : []);
  const courses = columns.map(c => c.course);

  function jump(topic: Topic) {
    const view = region.current, row = groupRows.current[topic], head = columnHeaders.current;
    if (!view || !row || !head) return;
    setCurrent(topic);
    const offset = row.getBoundingClientRect().top - view.getBoundingClientRect().top - head.offsetHeight - view.clientTop;
    view.scrollTo({ top: view.scrollTop + offset, behavior: "instant" });
  }
  function trackSection() {
    const view = region.current, head = columnHeaders.current;
    if (!view || !head) return;
    const visibleTop = view.getBoundingClientRect().top + view.clientTop + head.offsetHeight + 2;
    let topic: Topic = "study";
    for (const item of compareTopics) {
      const row = groupRows.current[item.id];
      if (row && row.getBoundingClientRect().top <= visibleTop) topic = item.id;
    }
    if (view.scrollHeight > view.clientHeight && view.scrollTop >= view.scrollHeight - view.clientHeight - 1) topic = "cost";
    setCurrent(topic);
  }

  if (!columns.length) return <p>Add a course to start your comparison table.</p>;
  return <section className={styles.panel} aria-label="Course comparison table">
    <div className={styles.tools}>
      <label htmlFor={id + "-jump"}>Jump to section</label>
      <select id={id + "-jump"} value={current} aria-controls={id + "-scroll"} onChange={event => jump(event.target.value as Topic)}>
        {compareTopics.map(topic => <option key={topic.id} value={topic.id}>{topic.label}</option>)}
      </select>
      {columns.length > 1 && <span className={styles.hint}>Swipe across to see each course.</span>}
    </div>
    <div id={id + "-scroll"} ref={region} onScroll={trackSection} className={styles.scroll} role="region" aria-label="Scrollable course comparison" tabIndex={0}>
      <table style={{ "--course-count": columns.length } as CSSProperties}>
        <caption className={styles.sr}>Side-by-side comparison of {columns.map(c => "option " + letters[c.slot] + ", " + c.course.short + " at " + c.course.campus).join("; ")}</caption>
        <colgroup><col className={styles.labelColumn} />{columns.map(({slot}) => <col key={slot} />)}</colgroup>
        <thead ref={columnHeaders}><tr>
          <th scope="col" className={styles.corner}>Compare by</th>
          {columns.map(({slot,course,headingId}) => {
            const metadata = courseMetadata(course, courses);
            return <th scope="col" id={headingId} key={slot} aria-label={["Option " + letters[slot], course.short, course.title !== course.short && course.title, metadata].filter(Boolean).join(" · ")}>
              <div className={styles.heading}><span className={styles.letter}>{letters[slot]}</span><span>
                <strong title={course.title}>{columnTitle(course)}</strong><small title={metadata}>{metadata}</small>
              </span></div>
            </th>;
          })}
        </tr></thead>
        {compareTopics.map(topic => {
          const groupId = id + "-group-" + topic.id;
          const rows = rowsFor(courses, topic.id);
          if (topic.id === "cost" && columns.length > 1) rows.unshift(priceOrder(columns, pricing));
          const visible = differences && columns.length > 1 ? rows.filter(row => !row.shared) : rows;
          return <tbody key={topic.id}>
            <tr ref={node => { groupRows.current[topic.id] = node; }}>
              <th className={styles.sectionHeader} scope="rowgroup" id={groupId} colSpan={columns.length + 1}><span>{topic.label}</span></th>
            </tr>
            {visible.length ? visible.map((row,i) => <EvidenceRow key={row.label} row={row} columns={columns} groupHeader={groupId} headerId={groupId + "-row-" + i} />)
              : <tr><td className={styles.empty} colSpan={columns.length + 1}><span>All recorded facts in this section are shared. Turn off “Show differences” to read them.</span></td></tr>}
          </tbody>;
        })}
      </table>
    </div>
  </section>;
}
