import { useState } from "react";
import { WalkRoute } from "./BuddyIntro";
import type { ChecklistItem, Role } from "./matching";
import type { BuddyMailState } from "./mail-model";
import { BuddyMail } from "./BuddyMail";
import styles from "./buddy.module.css";

export function BuddyWeek({ name, time, role, list, update, mail, updateMail }: {
  name: string; time: string; role: Role; list: ChecklistItem[]; update: (rows: ChecklistItem[]) => void;
  mail: BuddyMailState; updateMail: (mail: BuddyMailState) => void;
}) {
  const [actor, setActor] = useState("You");
  const [draft, setDraft] = useState("");
  const done = list.filter(row => row.done).length;
  return <>
    <h1>Your first week with {name}.</h1>
    <p className={styles.lead}>You both accepted. Confirm your first walk by SRM email, then meet at Arch Gate.</p>
    <BuddyMail role={role} name={name} time={time} mail={mail} update={updateMail} />
    <WalkRoute time={time} />
    <section className={styles.checklist} aria-labelledby="buddy-list-title">
      <div className={styles.listHead}><h2 id="buddy-list-title">Our first-week checklist</h2><span>{done} of {list.length} done</span></div>
      <label className={styles.editor}>Editing as <select value={actor} onChange={event => setActor(event.target.value)}><option>You</option><option>{name}</option></select></label>
      <ul>{list.map(row => <li key={row.id}><label>
        <input type="checkbox" checked={row.done} onChange={event => update(list.map(item => item.id === row.id ? { ...item, done: event.target.checked, actor } : item))} />
        <span>{row.title}{row.actor && <small>{row.done ? "Checked by " : "Updated by "}{row.actor === "You" ? "you" : row.actor}</small>}</span>
      </label><button type="button" className={styles.remove} aria-label={"Remove " + row.title} onClick={() => update(list.filter(item => item.id !== row.id))}>×</button></li>)}</ul>
      <form className={styles.addRow} onSubmit={event => {
        event.preventDefault();
        if (!draft.trim()) return;
        update([...list, { id: crypto.randomUUID(), title: draft.trim(), done: false, actor }]);
        setDraft("");
      }}>
        <label className={styles.inputLabel}>Add something to do together<input value={draft} className={styles.textInput} maxLength={100} onChange={event => setDraft(event.target.value)} placeholder="e.g. Find the club noticeboard" /></label>
        <button className={styles.secondary} type="submit">Add task</button>
      </form>
    </section>
  </>;
}
