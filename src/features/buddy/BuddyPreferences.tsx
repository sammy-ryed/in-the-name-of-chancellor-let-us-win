import { useState } from "react";
import { languages, times, topics, type Preferences, type Role } from "./matching";
import styles from "./buddy.module.css";

function Choices<T extends string>({ label, options, selected, onChange }: {
  label: string; options: readonly T[]; selected: T[]; onChange: (chosen: T[]) => void;
}) {
  return <fieldset className={styles.fieldset}><legend>{label}</legend><div className={styles.choices}>
    {options.map(option => <label key={option} className={styles.choice}>
      <input type="checkbox" checked={selected.includes(option)} onChange={event => onChange(event.target.checked ? [...selected, option] : selected.filter(x => x !== option))} />
      <span>{option}</span>
    </label>)}
  </div></fieldset>;
}
export function BuddyPreferences({ role, step, prefs, update, back, next, cancel }: {
  role: Role; step: 1 | 2; prefs: Preferences; update: (p: Preferences) => void; back: () => void; next: () => void; cancel?: () => void;
}) {
  const [error, setError] = useState("");
  const senior = role === "senior";
  function submit(event: React.FormEvent) {
    event.preventDefault();
    const problem = step === 1
      ? senior && !prefs.year ? "Choose your year of study." : !prefs.topics.length ? "Choose at least one campus topic." : ""
      : !prefs.languages.length ? "Choose at least one language." : !prefs.times.length ? "Choose at least one time you can meet." : prefs.sameGender && !prefs.gender.trim() ? "Enter your gender or choose No preference." : "";
    if (problem) { setError(problem); return; }
    setError("");
    next();
  }
  return <form className={styles.form} onSubmit={submit}>
    <div className={styles.step}><span>{senior ? "Be a buddy" : "Find a buddy"}</span><span>{step} of 2</span></div>
    <div className={styles.progress} aria-hidden="true"><i style={{ width: step === 1 ? "50%" : "100%" }} /></div>
    <h1>{step === 2 ? "Make the meet-up work." : senior ? "What can you show someone?" : "What would you like a hand with?"}</h1>
    {step === 1 ? <>
      {senior && <fieldset className={styles.fieldset}><legend>Which year are you in?</legend><div className={styles.choices}>
        {(["Second year", "Third year"] as const).map(year => <label className={styles.choice} key={year}><input type="radio" name="study-year" checked={prefs.year === year} onChange={() => update({ ...prefs, year })} />{year}</label>)}
      </div></fieldset>}
      <Choices label={senior ? "Topics you can help with" : "Campus-help topics"} options={topics} selected={prefs.topics} onChange={value => update({ ...prefs, topics: value })} />
      {senior && <div className={styles.inset}><strong>What you’re taking on</strong><p>Send the first introduction from your SRM student email, lead one campus walk and check in at the end of week one.</p></div>}
    </> : <>
      <Choices label="Which languages would you be comfortable speaking?" options={languages} selected={prefs.languages} onChange={value => update({ ...prefs, languages: value })} />
      <Choices label="When could you meet in your first week?" options={times} selected={prefs.times} onChange={value => update({ ...prefs, times: value })} />
      <fieldset className={styles.fieldset}><legend>Buddy preference</legend><div className={styles.choices}>
        <label className={styles.choice}><input type="radio" name="gender-pref" checked={!prefs.sameGender} onChange={() => update({ ...prefs, sameGender: false, gender: "" })} />No preference</label>
        <label className={styles.choice}><input type="radio" name="gender-pref" checked={prefs.sameGender} onChange={() => update({ ...prefs, sameGender: true })} />I’d prefer a buddy of my gender</label>
      </div></fieldset>
      {prefs.sameGender && <label className={styles.inputLabel}>How do you describe your gender?
        <input className={styles.textInput} type="text" list="buddy-genders" maxLength={60} autoComplete="off" placeholder="e.g. Woman" value={prefs.gender} onChange={e => update({ ...prefs, gender: e.target.value })} />
        <datalist id="buddy-genders"><option value="Woman" /><option value="Man" /><option value="Non-binary" /></datalist>
        <small>Used only to find a buddy who shares your gender in this demo.</small>
      </label>}
    </>}
    {error && <p className={styles.error} role="alert">{error}</p>}
    <div className={styles.buttons}>
      <button type="button" className={styles.secondary} onClick={back}>Back</button>
      <button className={styles.primary} type="submit">{step === 1 ? "Continue" : "See my match"} <span aria-hidden="true">→</span></button>
    </div>
    {cancel && <button type="button" className={styles.cancelEdit} onClick={cancel}>Cancel edits and return</button>}
  </form>;
}
