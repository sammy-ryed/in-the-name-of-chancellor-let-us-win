"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { core, notTried, orderedChoices, questionPath, version, type Answers } from "./questions";
import { coachPrompts, localCoach, recommend, validAnswers, type CoachPrompt, type FinderResult } from "./results";
import { useShortlist } from "@/features/explore/useShortlist";
import { FamilyDegrees, ShortlistSummary } from "./FamilyDegrees";
import type { DegreeOption } from "./degree-options";
import s from "./finder.module.css";

type Draft = { seed: number; step: string; answers: Answers };
const fresh = { seed: 0, step: "stage", answers: {} };
const sessionKey = "srm.field-guide." + version;
const schoolNotes: Record<string, string> = {
  "class-10": "I’m thinking about my subjects.",
  "class-11": "I’m getting to know my stream.",
  "class-12": "I’m exploring degree options.",
  finished: "I’m figuring out my next step.",
};

function Illustration({ tile, className = "" }: { tile: number; className?: string }) {
  const style: CSSProperties = { backgroundPosition: ((tile % 4) * 100 / 3) + "% " + Math.floor(tile / 4) * 100 + "%" };
  return <span aria-hidden="true" className={s.art + " " + className} style={style} />;
}

function Coach({ answers, result }: { answers: Answers; result: FinderResult }) {
  const [answer, setAnswer] = useState<{ prompt: CoachPrompt; text: string; ai: boolean } | null>(null);
  const [pending, setPending] = useState(false);
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);
  async function ask(prompt: CoachPrompt) {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setAnswer({ prompt, text: localCoach(result, prompt), ai: false });
    setPending(true);
    try {
      const response = await fetch("/api/admissions/programme-finder/v3", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version, answers, prompt }), signal: controller.signal,
      });
      if (!response.ok) return;
      const body = await response.json();
      if (!controller.signal.aborted && typeof body.answer === "string") setAnswer({ prompt, text: body.answer, ai: body.provider === "groq" });
    } catch { /* The written explanation is already visible. */ }
    finally { if (!controller.signal.aborted) setPending(false); }
  }
  const why: CoachPrompt = result.matches.length > 1 ? "together" : "why";
  return <section className={s.coach} aria-labelledby="direction-coach">
    <h2 id="direction-coach">Ask the course coach</h2>
    <div className={s.promptList}>{([why, "next", "compare"] as CoachPrompt[]).map(prompt =>
      <button key={prompt} aria-pressed={answer?.prompt === prompt} onClick={() => ask(prompt)}>{coachPrompts[prompt]}</button>)}</div>
    {answer && <div className={s.reply} aria-live="polite" aria-atomic="true">
      <strong>{answer.ai ? "AI course coach" : "Field guide"}</strong>
      <p>{answer.text}</p>{pending && <small>Checking with the AI coach…</small>}
    </div>}
  </section>;
}

function Results({ answers, catalog, onBack, onReset }: { answers: Answers; catalog: DegreeOption[]; onBack: () => void; onReset: () => void }) {
  const slots = useShortlist();
  const result = recommend(answers);
  function showDegrees(id: string) {
    const section = document.getElementById("srm-" + id);
    section?.focus({ preventScroll: true });
    section?.scrollIntoView({ block: "start" });
  }
  return <div className={s.results}>
    <div className={s.resultIntro}><header className={s.resultHead}>
      <h1 id="finder-heading" tabIndex={-1}>{result.state === "explore" ? "Try two directions" : "Your directions to explore"}</h1>
      <p>{result.state === "explore" ? "Your answers leave room for different kinds of work. Try these two activities and notice which one you’d do again." : "These families came up more than once in your choices. See what drew you to each family, then compare SRM degrees and campuses."}</p>
    </header>
    <aside className={s.stageNote}>
      <strong>{result.stage === "class-10" ? "Before choosing subjects" : result.stage === "class-11" ? "While you’re in Class 11" : "Your next step"}</strong>
      <p>{result.stageGuide}</p>
      {(result.stage === "class-12" || result.stage === "finished") && <Link className={s.admissionsLink} href="/admissions">Explore SRM admissions <span aria-hidden="true">→</span></Link>}
    </aside></div>
    <ShortlistSummary slots={slots} catalog={catalog} />
    <div className={s.sheets}>{result.matches.map(family =>
      <article className={s.sheet} key={family.id}>
        <div className={s.sheetHead}><Illustration tile={family.tile} /><div><h2>{family.name}</h2><p>{family.description}</p><button className={s.jumpDegrees} onClick={() => showDegrees(family.id)}>See SRM degrees <span aria-hidden="true">↓</span></button></div></div>
        <div className={s.sheetColumns}><div className={s.familyDetails}>
        <h3>What you chose</h3>
        <ul>{family.reasons.map(reason => <li key={reason}>{reason}</li>)}</ul>
        <h3>One trade-off</h3><p>{family.tradeOff}</p>
        <div className={s.try}><h3>Try it this week</h3><p>{family.tryThis}</p></div>
        {result.stage !== "class-10" && <><h3>When you compare</h3><p>{family.subjects}</p></>}
        </div><FamilyDegrees family={family.id} catalog={catalog} slots={slots} /></div>
      </article>
    )}{result.activities.map(family =>
      <article className={s.sheet} key={family.id}>
        <div className={s.sheetHead}><Illustration tile={family.tile} /><div><h2>{family.name}</h2><p>{family.description}</p><button className={s.jumpDegrees} onClick={() => showDegrees(family.id)}>See SRM degrees <span aria-hidden="true">↓</span></button></div></div>
        <div className={s.sheetColumns}><div className={s.familyDetails}><h3>Try this</h3><p>{family.tryThis}</p>
        </div><FamilyDegrees family={family.id} catalog={catalog} slots={slots} /></div>
      </article>
    )}</div>
    {!!result.priorities.length && <section className={s.priorities}><h2>What matters to you</h2>
      <ul>{result.priorities.map(tip => <li key={tip}>{tip}</li>)}</ul>
    </section>}
    <Coach answers={answers} result={result} />
    <div className={s.returnLinks}><button onClick={onBack}>Back to my answers</button><button onClick={onReset}>Start a new finder</button></div>
  </div>;
}

export function DirectionFinder({ catalog }: { catalog: DegreeOption[] }) {
  const [draft, setDraft] = useState<Draft>(fresh);
  const moved = useRef(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // First render the question on the server. Restore only this tab’s draft after hydration.
    const frame = requestAnimationFrame(() => {
      try {
        const stored = JSON.parse(sessionStorage.getItem(sessionKey) ?? "null");
        if (stored && Number.isSafeInteger(stored.seed) && stored.seed >= 0 && validAnswers(stored.answers) &&
            (stored.step === "results" || questionPath(stored.answers).some(q => q.id === stored.step))) {
          setDraft(stored);
          return;
        }
      } catch { /* Private or full storage still permits the in-memory activity. */ }
      setDraft(current => ({ ...current, seed: Math.floor(Math.random() * 10000) }));
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  useLayoutEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    root.current?.querySelector<HTMLElement>("#finder-heading")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [draft.step]);

  const path = questionPath(draft.answers);
  const index = path.findIndex(q => q.id === draft.step);
  const q = path[index];
  const complete = draft.step === "results";
  const selected = draft.answers[draft.step] ?? [];
  const limit = q?.max ?? 1;
  function update(next: Draft) {
    moved.current = next.step !== draft.step;
    setDraft(next);
    try { sessionStorage.setItem(sessionKey, JSON.stringify(next)); } catch { /* Continue in memory. */ }
  }
  function change(choice: string) {
    let next: string[];
    if (choice === notTried || limit === 1) next = selected.includes(choice) ? [] : [choice];
    else if (selected.includes(choice)) next = selected.filter(id => id !== choice);
    else next = [...selected.filter(id => id !== notTried), choice].slice(0, limit);
    const answers = { ...draft.answers, [q.id]: next };
    // A changed afternoon choice retires its old follow-up and any evidence it supplied.
    const allowed = new Set(questionPath(answers).map(item => item.id));
    update({ ...draft, answers: Object.fromEntries(Object.entries(answers).filter(([key]) => allowed.has(key))) });
  }
  function forward(skip = false) {
    const answers = { ...draft.answers, [q.id]: skip ? [] : selected };
    const nextPath = questionPath(answers);
    const allowed = new Set(nextPath.map(item => item.id));
    update({ ...draft, answers: Object.fromEntries(Object.entries(answers).filter(([key]) => allowed.has(key))),
      step: nextPath[nextPath.findIndex(item => item.id === q.id) + 1]?.id ?? "results" });
  }
  const coreIndex = q ? Math.max(0, core.findIndex(item => item.id === q.id)) : 7;
  const extra = q?.id.startsWith("closer-");
  const part = extra ? 3 : coreIndex + 1;
  const isStage = q?.id === "stage";
  const pickText = limit > 1 ? "Choose up to two" : "Choose one";
  return <div ref={root} className={s.finder} data-question={complete ? undefined : ""}>
    <div className={s.frame}>
      <nav className={s.crumbs} aria-label="Breadcrumb"><Link href="/admissions">Admissions</Link><span aria-hidden="true">/</span><span aria-current="page">Find your direction</span></nav>
      {complete ? <Results answers={draft.answers} catalog={catalog} onBack={() => update({ ...draft, step: path[path.length - 1].id })}
        onReset={() => update({ ...fresh, seed: draft.seed + 1 })} /> : <>
        <div className={s.progress}>
          <span>{extra ? "A closer look" : "Your field guide"}</span>
          <progress aria-label="Activity progress" value={part} max={8} />
          <span>{part} of 8</span>
        </div>
        <div className={s.spread} key={q.id}>
          <header className={s.questionHead}>
            <h1 id="finder-heading" tabIndex={-1}>{q.title}</h1>
            <p>{q.hint}</p>
            <Illustration tile={q.tile} className={s.scene} />
          </header>
          <section className={s.responses} aria-label="Answer choices">
            <div className={s.answerTools}><strong>{pickText}</strong><button onClick={() => forward(true)}>Skip question</button></div>
            <div className={s.choices} role="group" aria-labelledby="finder-heading">
              {orderedChoices(q, draft.seed).map(choice => <button key={choice.id} className={s.choice} aria-pressed={selected.includes(choice.id)}
                disabled={limit > 1 && selected.length >= limit && !selected.includes(choice.id)}
                onClick={() => change(choice.id)}>
                {isStage && <span className={s.book} aria-hidden="true">{choice.id === "finished" ? "✓" : choice.label.slice(-2)}</span>}
                {choice.tile !== undefined && <Illustration tile={choice.tile} className={s.thumb} />}
                <span className={s.choiceCopy}>{choice.label}{isStage && <small>{schoolNotes[choice.id]}</small>}</span>
                <span aria-hidden="true" className={s.mark}>{selected.includes(choice.id) ? "✓" : ""}</span>
              </button>)}
            </div>
            {!isStage && q.id !== "priorities" && <button className={s.untried} aria-pressed={selected.includes(notTried)} onClick={() => change(notTried)}>
              {selected.includes(notTried) ? "✓ " : ""}I haven’t tried this yet</button>}
            {limit > 1 && <p role="status" className={s.count}>{selected.includes(notTried) ? "No activity selected" : selected.length + " of 2 selected"}{selected.length === limit && " · Deselect one to change it."}</p>}
          </section>
        </div>
        <div className={s.actions}>
          <button className={s.back} disabled={index === 0} onClick={() => update({ ...draft, step: path[index - 1].id })}><span aria-hidden="true">← </span>Back</button>
          <button className={s.continue} disabled={!selected.length} onClick={() => forward()}>{q.id === "priorities" ? "See my directions" : "Continue"} <span aria-hidden="true">→</span></button>
        </div>
        <noscript><p>Enable JavaScript to take part. You can also <Link href="/programmes">browse SRM programmes</Link>.</p></noscript>
      </>}
    </div>
  </div>;
}
