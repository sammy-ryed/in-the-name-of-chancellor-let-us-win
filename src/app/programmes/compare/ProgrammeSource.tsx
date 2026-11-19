import type { PickerCourse } from "@/features/explore/course-evidence";
import styles from "./source.module.css";

export type ProgrammeEntry = { name: string; url: string; candidates: string[] };
export function ProgrammeSource({ entry, catalog, disabledIds, onPick }: {
  entry: ProgrammeEntry; catalog: PickerCourse[]; disabledIds: string[]; onPick: (id: string) => void;
}) {
  const candidates = catalog.filter(course => entry.candidates.includes(course.id));
  return <section className={styles.context} aria-label="Programme from the directory">
    <h2>{entry.name}</h2>
    {candidates.length ? <>
      <p>Choose the campus and study option you intend to compare.</p>
      <ul>{candidates.map(c => <li key={c.id}><button disabled={disabledIds.includes(c.id)} onClick={() => onPick(c.id)}>
        <strong>{c.degree} · {c.title}</strong><span>{[c.campus, c.shift && "Shift " + c.shift, c.mode].filter(Boolean).join(" · ")} →</span>
      </button></li>)}</ul>
    </> : <p>The fee catalogue has no verified course-and-campus match for this directory listing. Check the programme page or choose another course below.</p>}
    <a href={entry.url}>Official programme page ↗</a>
  </section>;
}
