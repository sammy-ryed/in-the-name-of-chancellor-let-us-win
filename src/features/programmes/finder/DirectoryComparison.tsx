"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { comparisonHref, type Shortlist } from "@/features/explore/shortlist";
import { Icon } from "./controls";
import type { DirectoryCourse, Programme } from "./types";

export type ComparisonPanel = "shortlist" | Programme | null;
const letters = ["A", "B", "C"];
const normalise = (text: string) => text.toLowerCase().replaceAll(".", "").replaceAll("/", " ");

type Props = {
  panel: ComparisonPanel;
  slots: Shortlist;
  courses: DirectoryCourse[];
  showBrowseAll: boolean;
  onReview: () => void;
  onClose: () => void;
  onToggle: (id: string) => void;
  onCompare: () => void;
};

export function DirectoryComparison({ panel, slots, courses, showBrowseAll, onReview, onClose, onToggle, onCompare }: Props) {
  const count = slots.filter(Boolean).length;
  const dialog = useRef<HTMLDialogElement>(null);
  const open = panel !== null;
  useEffect(() => {
    if (open && !dialog.current?.open) dialog.current?.showModal();
    if (!open && dialog.current?.open) dialog.current.close();
  }, [open]);
  const byId = useMemo(() => new Map(courses.map(c => [c.id, c])), [courses]);
  const picker = panel && panel !== "shortlist" ? panel : null;
  const href = comparisonHref(slots);
  return (
    <>
      <aside className="pf-shortbar" aria-label="Course comparison">
        <div className="pf-shortbar-inner">
          <button className="pf-short-toggle" type="button" onClick={onReview} aria-haspopup="dialog" id="pf-review">
            <span aria-hidden="true" className="pf-short-icon"><i /><i /><i /></span>
            Your comparison <span className="pf-short-count">{count}/3</span>
          </button>
          <p>{count === 0 ? "Add courses as you browse." : count === 1 ? "Choose one more to compare." : "Ready to compare fees, study and careers."}</p>
          {count >= 2 ? <Link className="pf-short-primary" onNavigate={onCompare} href={href}>Compare <Icon name="arrow" /></Link>
            : <button type="button" onClick={onReview} className="pf-short-view" aria-haspopup="dialog">{count ? "View pick" : "How it works"}</button>}
        </div>
      </aside>
      <dialog ref={dialog} onClose={onClose} className="pf-choice-drawer" aria-labelledby="pf-drawer-title">
        <div className="pf-choice-shell">
          <header className="pf-choice-head">
            <h2 id="pf-drawer-title">{picker ? "Choose a course" : "Your comparison"}</h2>
            <button type="button" onClick={onClose} aria-label="Close comparison drawer"><Icon name="close" /></button>
          </header>
          <div className="pf-choice-body">
            {picker ? <CourseChoices key={picker.id} programme={picker} slots={slots} courses={courses}
              onToggle={id => { onToggle(id); onClose(); }} /> : <>
              <p className="pf-choice-intro">Pick two or three SRM courses. Compare what you’ll study, what they cost and where they can lead.</p>
              {count === 3 && <p className="pf-choice-note">All three places are filled. Remove a course below to choose another.</p>}
              <ol className="pf-picks">{slots.map((id, i) => {
                const course = byId.get(id);
                return <li key={letters[i]} data-empty={!course || undefined}>
                  <span className="pf-letter" aria-hidden="true">{letters[i]}</span>
                  {course ? <><div><strong>{course.title}</strong><small>{course.place}</small></div>
                    <button type="button" aria-label={`Remove ${course.title} from slot ${letters[i]}`} onClick={() => onToggle(id)}><Icon name="close" /></button></>
                    : <span>{i === 2 ? "Optional third course" : "Choose a programme"}</span>}
                </li>;
              })}</ol>
            </>}
            {picker && count === 3 && <button type="button" className="pf-short-view" onClick={onReview}>Manage your three picks</button>}
          </div>
          <footer className="pf-choice-footer">
            {!picker && count >= 2 && <Link className="pf-short-primary" href={href} onNavigate={onCompare}>Compare {count} courses <Icon name="arrow" /></Link>}
            {showBrowseAll && !picker ? <Link href="/programmes?view=all" className="pf-short-view" onNavigate={onClose}>Browse all programmes</Link>
              : <button type="button" className="pf-short-view" onClick={onClose}>Keep browsing</button>}
          </footer>
        </div>
      </dialog>
    </>
  );
}

function CourseChoices({ programme, slots, courses, onToggle }: {
  programme: Programme; slots: Shortlist; courses: DirectoryCourse[]; onToggle: (id: string) => void;
}) {
  const exact = programme.compareCandidates?.length || programme.feeCourseId;
  const [query, setQuery] = useState(exact ? "" : programme.compareSearch || "");
  const [limit, setLimit] = useState(10);
  const candidates = useMemo(() => {
    const ids = new Set(programme.compareCandidates ?? []);
    if (programme.feeCourseId) ids.add(programme.feeCourseId);
    return ids.size ? courses.filter(c => ids.has(c.id)) : courses;
  }, [courses, programme]);
  const terms = normalise(query).split(/\s+/).filter(Boolean);
  const matches = candidates.filter(c => terms.every(word => normalise(c.title + " " + c.place).includes(word)));
  const full = slots.every(Boolean);
  return <>
    <p className="pf-choice-programme">{programme.name}</p>
    <p className="pf-choice-intro">{exact ? "Choose the campus and course listing you want to compare." :
      "This programme has no exact match in the fee catalogue. You can choose a related SRM course below."}</p>
    {(!exact || candidates.length > 6) && <label className="pf-choice-search">Search the fee catalogue
      <input type="search" value={query} onChange={e => { setQuery(e.target.value); setLimit(10); }} placeholder="Subject, degree or campus" /></label>}
    {full && <p className="pf-choice-note">All three places are filled. Remove a pick to add another.</p>}
    {!matches.length && <p>No courses match this search. Try a subject or campus name.</p>}
    <ul className="pf-course-options">{matches.slice(0,limit).map(course => {
      const slot = slots.indexOf(course.id);
      return <li key={course.id}><button type="button" disabled={full && slot === -1} aria-pressed={slot !== -1} onClick={() => onToggle(course.id)}>
        <span><strong>{course.title}</strong><small>{course.place}</small></span>
        <span className="pf-option-mark">{slot === -1 ? "+" : letters[slot]}</span>
      </button></li>;
    })}</ul>
    {matches.length > limit && <button type="button" className="pf-short-view" onClick={() => setLimit(n => n + 10)}>Show more courses</button>}
  </>;
}
