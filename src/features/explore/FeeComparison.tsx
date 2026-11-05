"use client";

import Link from "next/link";
import { useRef } from "react";
import type { FeeListing } from "./fee-listing";
import styles from "./fees.module.css";

export const slotLetters = ["A", "B", "C"] as const;
export type FeeSlot = FeeListing | undefined;

export function SlotMark({ index }: { index: number }) {
  return <span className={styles.mark} data-slot={slotLetters[index]}>{slotLetters[index]}</span>;
}

const facts = [
  ["Fee", "fee"], ["Fee period", "period"], ["Campus", "campus"], ["Qualification", "degree"],
  ["Study level", "level"], ["Duration", "duration"], ["Study mode", "mode"], ["Shift", "shift"], ["Listing notes", "notes"],
] as const;

function comparisonNote(courses: FeeListing[]) {
  if (courses.length < 2) return "Add another programme to compare its fees and study details.";
  const period = courses[0].period;
  if (!courses.every(course => course.period === period)) return "The fee periods differ. Check what each amount covers before comparing costs.";
  if (period === "Listed fee") return "These listings do not specify a billing period. Check the faculty schedules before comparing costs.";
  const amounts = courses.map(course => course.amount).filter((amount): amount is number => amount !== null);
  if (amounts.length !== courses.length) return "At least one listing includes fee conditions or additional charges. Check the notes and faculty schedules for the amount that applies to you.";
  const gap = Math.max(...amounts) - Math.min(...amounts);
  if (!gap) return `The ${period.toLowerCase()} is the same across these options.`;
  return `The difference between the highest and lowest ${period.toLowerCase()} is ₹${gap.toLocaleString("en-IN")}.`;
}

export function FeeComparison({ slots, replacing, onReplace, onCancelReplace, onRemove, detailQuery }: {
  slots: FeeSlot[];
  detailQuery: string;
  replacing: number | null;
  onReplace: (index: number) => void;
  onCancelReplace: () => void;
  onRemove: (index: number) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const selected = slots.flatMap((course, index) => course ? [{ course, index }] : []);
  const count = selected.length;
  function remove(index: number) {
    if (count === 1) dialog.current?.close();
    else if (dialog.current?.open) closeButton.current?.focus();
    onRemove(index);
  }

  return (
    <aside className={styles.shortlist} data-active={count > 0 || undefined} aria-label="Fee shortlist">
      <div className={styles.shortTop}>
        <h2>Your shortlist</h2>
        <span className={styles.count} aria-label={`${count} of 3 slots filled`}>{count} / 3</span>
      </div>
      <p className={styles.shortHint}>{count === 3 ? "Shortlist full. Remove or change an option to add another." : "Select Compare beside a programme to add it here."}</p>
      <ul className={styles.slots}>
        {slots.map((course, index) => (
          <li key={index} data-slot={course ? slotLetters[index] : undefined}>
            <SlotMark index={index} />
            {course ? <>
              <span className={styles.slotName}><strong>{course.degree} · {course.name}</strong><small>{course.campus}{course.shift ? ` · Shift ${course.shift}` : ""}</small></span>
              <button type="button" className={styles.remove} onClick={() => remove(index)} aria-label={`Remove option ${slotLetters[index]}: ${course.name}`}>×</button>
            </> : <span className={styles.vacant}>Choose a programme</span>}
          </li>
        ))}
      </ul>
      {replacing !== null ? (
        <div className={styles.replaceNote} role="status">
          Choose a new option {slotLetters[replacing]}.
          <button type="button" onClick={onCancelReplace}>Cancel</button>
        </div>
      ) : (
        <button type="button" className={styles.compareAction} disabled={!count} aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}>
          Compare fees <span aria-hidden="true">→</span>
        </button>
      )}
      <dialog className={styles.dialog} ref={dialog} aria-labelledby="fee-comparison-title"
        onClick={event => {
          if (event.target !== dialog.current) return;
          const rect = event.currentTarget.getBoundingClientRect();
          if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.current.close();
        }}>
        <div className={styles.dialogHead}>
          <h2 id="fee-comparison-title">Compare <em>fees.</em></h2>
          <button ref={closeButton} type="button" className={styles.close} aria-label="Close fee comparison" onClick={() => dialog.current?.close()}>×</button>
        </div>
        <div className={styles.dialogBody}>
          <p className={styles.comparisonNote}>{comparisonNote(selected.map(({course}) => course))}</p>
          <table className={styles.table}>
            <caption className={styles.sr}>Selected programmes and their fees, billing periods and study details</caption>
            <thead><tr>
              <td />
              {selected.map(({course, index}) => (
                <th key={course.id} scope="col" data-slot={slotLetters[index]}>
                  <SlotMark index={index} />
                  <span className={styles.tableTitle}>{course.degree} · {course.name}</span>
                  <div className={styles.tableActions}>
                    <button type="button" aria-label={`Change option ${slotLetters[index]}`} onClick={() => { dialog.current?.close(); onReplace(index); }}>Change</button>
                    <button type="button" aria-label={`Remove option ${slotLetters[index]}`} onClick={() => remove(index)}>Remove</button>
                  </div>
                </th>
              ))}
            </tr></thead>
            <tbody>
              {facts.filter(([, key]) => selected.some(({ course }) => course[key])).map(([label, key]) => (
                <tr key={key}>
                  <th scope="row">{label}</th>
                  {selected.map(({course, index}) => (
                    <td key={course.id} data-slot={slotLetters[index]} data-fee={key === "fee" || undefined}>
                      <span className={styles.mobileMark} aria-hidden="true"><SlotMark index={index} /></span>
                      {course[key] || (key === "notes" ? "No note listed" : "Check faculty listing")}
                    </td>
                  ))}
                </tr>
              ))}
              <tr><th scope="row">Entry requirements</th>{selected.map(({course, index}) => (
                <td key={course.id} data-slot={slotLetters[index]}>
                  <span className={styles.mobileMark} aria-hidden="true"><SlotMark index={index} /></span>
                  <Link href={`/programmes/${course.id}${detailQuery}`}>View programme <span aria-hidden="true">↗</span></Link>
                </td>
              ))}</tr>
            </tbody>
          </table>
        </div>
      </dialog>
    </aside>
  );
}
