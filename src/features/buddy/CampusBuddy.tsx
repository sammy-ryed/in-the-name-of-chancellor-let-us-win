"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { campusLinks } from "@/features/campus/links";
import { BuddyIntro, WalkRoute } from "./BuddyIntro";
import { BuddyPreferences } from "./BuddyPreferences";
import { BuddyWeek } from "./BuddyWeek";
import { initialMail, validMail, type BuddyMailState } from "./mail-model";
import { emptyPreferences, findBuddies, firstWeek, languages, meetingTimes, times, topics, type ChecklistItem, type Preferences, type Role } from "./matching";
import styles from "./buddy.module.css";

type Stage = "intro" | "topics" | "details" | "match" | "reply" | "week" | "waitlist";
type Edit = { stage: "match" | "reply" | "week" | "waitlist"; prefs: Preferences };
type Session = {
  role: Role; stage: Stage; prefs: Preferences; skipped: string[]; checklist: ChecklistItem[]; help: string; edit?: Edit; mail?: BuddyMailState;
};
const storageKey = "srm-campus-buddy-demo-v1";
function fresh(): Session {
  return { role: "fresher", stage: "intro", prefs: emptyPreferences(), skipped: [], checklist: firstWeek(), help: "" };
}
function validPreferences(p: Preferences | undefined) {
  return Boolean(p && Array.isArray(p.topics) && p.topics.every(v => topics.includes(v)) &&
    Array.isArray(p.languages) && p.languages.every(v => languages.includes(v)) &&
    Array.isArray(p.times) && p.times.every(v => times.includes(v)) && typeof p.gender === "string" &&
    typeof p.sameGender === "boolean" && ["", "Second year", "Third year"].includes(p.year));
}
function restore(): Session {
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey) || "null") as Session | null;
    if (!saved || !["fresher", "senior"].includes(saved.role) || !["topics", "details", "match", "reply", "week", "waitlist"].includes(saved.stage)) return fresh();
    if (!validPreferences(saved.prefs) || !validMail(saved.mail) || (saved.edit && (!validPreferences(saved.edit.prefs) ||
        !["match", "reply", "week", "waitlist"].includes(saved.edit.stage))) ||
        !Array.isArray(saved.skipped) || !saved.skipped.every(v => typeof v === "string") ||
        !Array.isArray(saved.checklist) || !saved.checklist.every(v => typeof v?.id === "string" && typeof v.title === "string" && typeof v.done === "boolean") || typeof saved.help !== "string") return fresh();
    return saved;
  } catch { return fresh(); }
}
export function CampusBuddy() {
  const [session, setSession] = useState<Session | null>(null);
  const [panel, setPanel] = useState<"help" | "withdraw" | null>(null);
  const [withdrawn, setWithdrawn] = useState(false);
  const [helpTopic, setHelpTopic] = useState("Changing a match");
  const shell = useRef<HTMLDivElement>(null);
  const lastStage = useRef<Stage | null>(null);
  const state = session ?? fresh();
  const { role, stage, prefs } = state;
  useEffect(() => {
    const frame = requestAnimationFrame(() => setSession(current => current ?? restore()));
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (!session) return;
    try {
      if (session.stage === "intro") sessionStorage.removeItem(storageKey);
      else sessionStorage.setItem(storageKey, JSON.stringify(session));
    } catch { /* Browsers with storage disabled can still complete a demo in memory. */ }
  }, [session]);
  useEffect(() => {
    if (lastStage.current !== null && lastStage.current !== stage && shell.current) {
      const heading = shell.current.querySelector("h1");
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
        shell.current.scrollIntoView({ block: "start", behavior: "instant" });
      }
    }
    lastStage.current = stage;
  }, [stage]);
  function change(patch: Partial<Session>) {
    setSession(current => ({ ...(current ?? fresh()), ...patch }));
  }
  function navigate(to: Stage, extra: Partial<Session> = {}) {
    setPanel(null);
    change({ ...extra, stage: to });
  }
  function cancelEdit() {
    if (state.edit) navigate(state.edit.stage, { prefs: state.edit.prefs, edit: undefined });
  }
  function submitPreferences() {
    if (stage === "topics") { navigate("details"); return; }
    if (state.edit && JSON.stringify(state.edit.prefs) === JSON.stringify(prefs)) { cancelEdit(); return; }
    navigate("match", { checklist: firstWeek(), edit: undefined, mail: undefined });
  }
  function start(as: Role) {
    setWithdrawn(false);
    setPanel(null);
    setSession({ ...fresh(), role: as, stage: "topics" });
  }
  const match = findBuddies(role, prefs, state.skipped)[0];
  const otherRole = role === "fresher" ? "senior" : "fresher";
  const hasMatch = Boolean(match) && ["match", "reply", "week"].includes(stage);
  function replaceBuddy() {
    navigate("match", { skipped: match ? [...state.skipped, match.person.id] : state.skipped, checklist: firstWeek(), mail: undefined });
    requestAnimationFrame(() => {
      const title = shell.current?.querySelector("h1");
      if (title) { title.tabIndex = -1; title.focus(); }
    });
  }
  return <div ref={shell} className={styles.shell}>
    <div className={styles.inner}>
      <header className={styles.mast}><div><Link href="/campus">Campus life</Link><span aria-hidden="true"> / </span><strong>Campus Buddy</strong></div><span className={styles.demo}><i aria-hidden="true" />Kattankulathur demo</span></header>
      {stage === "intro" ? <BuddyIntro start={start} withdrawn={withdrawn} /> : <div className={styles.workspace}>
        {stage === "topics" || stage === "details" ? <BuddyPreferences key={stage} role={role} step={stage === "topics" ? 1 : 2} prefs={prefs}
          update={value => change({ prefs: value })} back={() => {
            if (stage === "topics" && state.edit) cancelEdit();
            else navigate(stage === "topics" ? "intro" : "topics");
          }} cancel={state.edit ? cancelEdit : undefined} next={submitPreferences} /> : <>
          {hasMatch && match ? <>
            {stage === "week" ? <BuddyWeek name={match.person.name} time={meetingTimes[match.times[0]]} role={role} list={state.checklist} update={rows => change({ checklist: rows })}
              mail={state.mail ?? initialMail(role, match.person.name, meetingTimes[match.times[0]])} updateMail={mail => change({ mail })} /> : <>
              <span className={styles.eyebrow}>{stage === "reply" ? "Second acceptance" : "Proposed match"} · fictional {otherRole}</span>
              <h1>{stage === "reply" ? match.person.name + "’s invitation." : "Meet " + match.person.name + "."}</h1>
              <div className={styles.profile}>
                <div className={styles.monogram} aria-hidden="true">{match.person.name.slice(0, 1)}</div>
                <div><strong>{match.person.name}</strong><small>{match.person.year} · {match.person.course}</small></div>
                <blockquote>“{match.person.note}”</blockquote>
              </div>
              {stage === "match" ? <>
                <h2>Why you matched</h2>
                <ul className={styles.reasons}><li>You’re both free on {match.times.map(s => s.toLowerCase()).join(" and ")}.</li><li>You can talk in {match.languages.join(" or ")}.</li>
                  {match.topics.length > 0 ? <li>Shared topics include {match.topics.map(s => s.toLowerCase()).join(", ")}.</li> : <li>Your campus topics differ. You can ask for another match.</li>}
                  {prefs.sameGender && <li>Your same-gender preference is met.</li>}
                </ul>
                <WalkRoute time={meetingTimes[match.times[0]]} />
                <p className={styles.note}>{role === "senior" ? "You’re agreeing to an introduction, a campus walk and a first-week check-in. " : ""}When you both accept, the senior introduces themselves by SRM student email and the fresher replies to confirm the walk.</p>
                <div className={styles.buttons}><button className={styles.primary} onClick={() => navigate("reply")}>Accept this match</button><button className={styles.secondary} onClick={replaceBuddy}>Change buddy</button></div>
              </> : <>
                <p className={styles.lead}>You’ve accepted. Try the other side of the invitation as {match.person.name}, your sample {otherRole}.</p>
                <div className={styles.inset}><strong>Proposed first meeting</strong><p>{meetingTimes[match.times[0]]} at Arch Gate, then a walk to the Central Library.</p></div>
                <div className={styles.buttons}><button className={styles.primary} onClick={() => navigate("week", { mail: initialMail(role, match.person.name, meetingTimes[match.times[0]]) })}>Accept as {match.person.name}</button><button className={styles.secondary} onClick={replaceBuddy}>Decline as {match.person.name}</button></div>
              </>}
            </>}
          </> : <><span className={styles.eyebrow}>{stage === "waitlist" ? "Demo waitlist" : "Matching preferences"}</span>
            <h1>{stage === "waitlist" ? "You’re on the demo waitlist." : "No sample match just yet."}</h1>
            <p className={styles.lead}>{stage === "waitlist" ? "This tab holds your place with the preferences you chose. You can change them to try a different match." : "There’s no available fictional buddy who shares your language, meeting time and matching preferences. You can keep your choices and join the demo waitlist."}</p>
            {stage !== "waitlist" && <button className={styles.primary} onClick={() => navigate("waitlist")}>Join demo waitlist</button>}
          </>}
          <div className={styles.utilities}>
            <button onClick={() => navigate("topics", { edit: { stage, prefs } })}>Edit preferences</button>
            {stage === "week" && <button onClick={replaceBuddy}>Change buddy</button>}
            <button aria-expanded={panel === "help"} onClick={() => setPanel(panel === "help" ? null : "help")}>Coordinator help</button>
            <button aria-expanded={panel === "withdraw"} onClick={() => setPanel(panel === "withdraw" ? null : "withdraw")}>Withdraw</button>
          </div>
          {panel === "withdraw" && <section className={styles.inset} aria-label="Withdraw from demo"><h2>Leave the demo?</h2><p>This clears your preferences, match, demo emails and checklist from this tab.</p>
            <div className={styles.buttons}><button className={styles.primary} onClick={() => { setPanel(null); setWithdrawn(true); setSession(fresh()); }}>Confirm withdrawal</button><button className={styles.secondary} onClick={() => setPanel(null)}>Keep my place</button></div></section>}
          {panel === "help" && <section className={styles.inset} aria-label="Coordinator help"><h2>Coordinator help</h2>
            <p>Try a support request in this tab. For real campus support, visit <a href={campusLinks.studentAffairs}>SRM Student Affairs</a>.</p>
            <label className={styles.inputLabel}>What would you like help with?<select value={helpTopic} onChange={e => setHelpTopic(e.target.value)}><option>Changing a match</option><option>Planning a meeting</option><option>Something felt uncomfortable</option></select></label>
            <button className={styles.secondary} onClick={() => change({ help: helpTopic })}>Record demo request</button>
            {state.help && <p role="status">Saved in this tab · {state.help}. No message has been sent.</p>}
          </section>}
        </>}
        <p className={styles.disclosure}>Campus Buddy demo · Fictional profiles and meetings · Saved in this tab</p>
      </div>}
    </div>
  </div>;
}
