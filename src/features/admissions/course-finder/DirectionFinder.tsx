"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { core, noFit, notTried, orderedChoices, questionPath, version, type Answers, type Question } from "./v5/questions";
import { coachPrompts, localCoach, placementSources, recommend, validAnswers, type CoachPrompt, type FinderResult } from "./v5/results";
import { addToShortlist, comparisonHref, readShortlist, writeShortlist } from "@/features/explore/shortlist";
import { artsSubject } from "./arts-examples";
import { eligibleFinderSlots } from "./finder-shortlist";
import { useShortlist } from "@/features/explore/useShortlist";
import { FamilyDegrees, ShortlistSummary } from "./FamilyDegrees";
import { SubjectLookup } from "./SubjectLookup";
import type { DegreeOption } from "./degree-options";
import s from "./finder.module.css";

type Draft = { seed: number; step: string; answers: Answers; beforeEdit?: Answers };
const fresh = { seed: 0, step: "stage", answers: {} };
const sessionKey = "srm.field-guide." + version;
const schoolNotes: Record<string, string> = {
  "class-10": "I’m thinking about my subjects.",
  "class-11": "I’m getting to know my stream.",
  "class-12": "I’m exploring degree options.",
  finished: "I’m figuring out my next step.",
};

function neutralLabel(question: Question, id: string) {
  if (question.signal === "aversion") return id === noFit ? "I’d be fine with any of these" : "I’m not sure yet";
  return id === noFit ? "None of these feels like me" : "I haven’t tried this yet";
}

function activeAnswers(answers: Answers) {
  return Object.fromEntries(questionPath(answers).filter(q => Object.hasOwn(answers, q.id)).map(q => [q.id, answers[q.id]]));
}

function Illustration({ tile, className = "" }: { tile: number; className?: string }) {
  const style: CSSProperties = { backgroundPosition: ((tile % 4) * 100 / 3) + "% " + Math.floor(tile / 4) * 100 + "%" };
  return <span aria-hidden="true" className={s.art + " " + className} style={style} />;
}

function CampusPrint({ results = false }: { results?: boolean }) {
  return <figure className={s.campusPrint}>
    <Image src={results ? "/campus/green-walkway.webp" : "/campus/tech-park.webp"}
      width={620} height={640} sizes="(max-width: 760px) 95vw, 380px"
      loading={results ? "lazy" : "eager"} alt={results ? "Students walking beneath the trees on campus" : "Students outside SRM’s colourful Tech Park building"} />
    <figcaption>{results ? "The campus walkway" : "Tech Park"} <span>Kattankulathur</span></figcaption>
  </figure>;
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
      const response = await fetch("/api/admissions/programme-finder/v5", {
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
    <div className={s.promptList}>{([why, "next", "compare", "placements"] as CoachPrompt[]).map(prompt =>
      <button key={prompt} aria-pressed={answer?.prompt === prompt} onClick={() => ask(prompt)}>{coachPrompts[prompt]}</button>)}</div>
    {answer && <div className={s.reply} aria-live="polite" aria-atomic="true">
      <strong>{answer.ai ? "AI course coach" : "Course guide"}</strong>
      <p>{answer.text}</p>
      {answer.prompt === "placements" && <ul className={s.sources}>{placementSources.map(source => <li key={source.href}><a href={source.href}>{source.label}</a></li>)}</ul>}
      {pending && answer.prompt !== "placements" && <small>Checking with the AI coach…</small>}
    </div>}
  </section>;
}

function Results({ answers, catalog, onEdit, onReset }: { answers: Answers; catalog: DegreeOption[]; onEdit: (id: string) => void; onReset: () => void }) {
  const result = useMemo(() => recommend(answers), [answers]);
  const families = useMemo(() => [...result.matches, ...result.activities], [result]);
  const eligibleIds = useMemo(() => {
    const familyIds = new Set(families.map(family => family.id));
    return new Set(catalog.filter(course => familyIds.has(course.family)).map(course => course.id));
  }, [catalog, families]);
  const storedSlots = useShortlist("finder");
  const slots = eligibleFinderSlots(storedSlots, eligibleIds);
  const subjectChoice = artsSubject(result.subjectChoice);
  const hasArtsPick = catalog.some(course => course.family === "arts-sciences" && slots.includes(course.id));
  const compareUrl = comparisonHref(slots, "finder") + (hasArtsPick && subjectChoice ? "&subject=" + subjectChoice : "");

  useEffect(() => {
    // Read the live store here, including when the server snapshot was empty.
    const current = readShortlist("finder");
    const kept = eligibleFinderSlots(current, eligibleIds);
    if (kept.some((id, index) => id !== current[index])) writeShortlist(kept, "finder");
  }, [storedSlots, eligibleIds]);

  function toggleCourse(id: string) {
    if (!eligibleIds.has(id)) return;
    const current = eligibleFinderSlots(readShortlist("finder"), eligibleIds);
    const next = current.includes(id) ? current.map(value => value === id ? "" : value) : addToShortlist(current, id);
    writeShortlist(next, "finder");
  }
  function showDegrees(id: string) {
    const section = document.getElementById("srm-" + id);
    section?.focus({ preventScroll: true });
    section?.scrollIntoView({ block: "start" });
  }
  return <div className={s.results}>
    <div className={s.resultIntro}>
      <header className={s.resultHead}>
        <h1 id="finder-heading" tabIndex={-1}>{result.state === "explore" ? "Two course families to try" : "SRM course families for you"}</h1>
        <p>{result.state === "explore" ? result.exploreReason : "Your answers point to the families below. Try a piece of the work or go straight to the degrees."}</p>
        <nav className={s.resultIndex} aria-label="Explore your course families">
          {families.map(family =>
            <button key={family.id} onClick={() => showDegrees(family.id)}>{family.name} degrees <span aria-hidden="true">↓</span></button>)}
        </nav>
      </header>
      <CampusPrint results />
    </div>
    <aside className={s.stageNote}>
      <strong>{result.stage === "class-10" ? "Before choosing subjects" : result.stage === "class-11" ? "While you’re in Class 11" : "Your next step"}</strong>
      <div><p>{result.stageGuide}</p>
        {(result.stage === "class-12" || result.stage === "finished") && <Link className={s.admissionsLink} href="/admissions">Explore SRM admissions <span aria-hidden="true">↗</span></Link>}</div>
    </aside>
    <ShortlistSummary slots={slots} catalog={catalog} onToggle={toggleCourse} compareUrl={compareUrl} subjectChoice={subjectChoice} />
    <div className={s.sheets}>{families.map(family => {
      const match = result.matches.find(item => item.id === family.id);
      return <article className={s.sheet} key={family.id}>
        <div className={s.sheetHead}>
          <Illustration tile={family.tile} />
          <div><h2>{family.name}</h2><p>{family.description}</p>
            <button className={s.jumpDegrees} onClick={() => showDegrees(family.id)}>See SRM degrees <span aria-hidden="true">↓</span></button></div>
        </div>
        <div className={s.sheetColumns}>
          <div className={s.familyDetails}>
            {match && <><h3>Why this family came up</h3>
              <ul className={s.reasons}>{match.reasons.map(reason => <li key={reason}>{reason}</li>)}</ul></>}
            {family.friction && <div className={s.friction}><h3>Something to weigh</h3><p>{family.friction}</p></div>}
            <div className={s.try}><h3>Try it this week</h3><p>{family.tryThis}</p></div>
            {match && <>{!family.friction && <><h3>One trade-off</h3><p>{family.tradeOff}</p></>}
              {result.stage !== "class-10" && <><h3>When you compare</h3><p>{family.subjects}</p></>}</>}
          </div>
          <FamilyDegrees family={family.id} catalog={catalog} slots={slots} onToggle={toggleCourse} compareUrl={compareUrl} subjectChoice={subjectChoice} />
        </div>
      </article>;
    })}</div>
    {!!result.priorities.length && <section className={s.priorities}><h2>What matters to you</h2>
      <ul>{result.priorities.map(tip => <li key={tip}>{tip}</li>)}</ul>
    </section>}
    <Coach answers={answers} result={result} />
    <SubjectLookup catalog={catalog} />
    <details className={s.review}><summary>Review or change my answers</summary>
      <ol>{questionPath(answers).map(question => {
        const labels = (answers[question.id] ?? []).map(id => id === noFit || id === notTried
          ? neutralLabel(question, id) : question.choices.find(choice => choice.id === id)?.label);
        return <li key={question.id}><div><strong>{question.title}</strong><p>{labels.length ? labels.join(" · ") : "Skipped"}</p></div>
          <button aria-label={"Change answer to “" + question.title + "”"} onClick={() => onEdit(question.id)}>Change</button></li>;
      })}</ol>
    </details>
    <div className={s.returnLinks}><button onClick={onReset}>Start again</button><Link href="/programmes?view=all">Browse all SRM programmes <span aria-hidden="true">↗</span></Link></div>
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
            (stored.beforeEdit === undefined || validAnswers(stored.beforeEdit)) &&
            (stored.step === "results" || questionPath(stored.answers).some(q => q.id === stored.step))) {
          setDraft(stored);
          return;
        }
        // A new activity starts with its own course picks.
        writeShortlist([], "finder");
        // School stage is portable. Old task answers describe different choices.
        if (!stored) {
          for (const edition of ["v4", "v3"]) {
            const previous = JSON.parse(sessionStorage.getItem("srm.field-guide.srm-course-families-" + edition) ?? "null");
            const stage: unknown = previous?.answers?.stage;
            if (Array.isArray(stage) && stage.length === 1 && validAnswers({ stage })) {
              setDraft({ seed: Math.floor(Math.random() * 10000), step: "stage", answers: { stage } });
              return;
            }
          }
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
    if (choice === notTried || choice === noFit || limit === 1) next = selected.includes(choice) ? [] : [choice];
    else if (selected.includes(choice)) next = selected.filter(id => id !== choice);
    else next = [...selected.filter(id => id !== notTried && id !== noFit), choice].slice(0, limit);
    update({ ...draft, answers: activeAnswers({ ...draft.answers, [q.id]: next }) });
  }
  const originalAnswers = draft.beforeEdit;
  const missingStep = originalAnswers && path.find(item => item.id !== q?.id && !Object.hasOwn(draft.answers, item.id));
  function forward(skip = false) {
    const answers = activeAnswers({ ...draft.answers, [q.id]: skip ? [] : selected });
    const nextPath = questionPath(answers);
    const next = draft.beforeEdit
      ? nextPath.find(item => !Object.hasOwn(answers, item.id))
      : nextPath[nextPath.findIndex(item => item.id === q.id) + 1];
    update(next ? { ...draft, answers, step: next.id } : { seed: draft.seed, answers, step: "results" });
  }
  const extra = q?.signal === "followup";
  const part = path.slice(0, index + 1).filter(item => item.signal !== "followup").length;
  const followups = path.filter(item => item.signal === "followup");
  const progressLabel = extra ? `Follow-up ${followups.indexOf(q) + 1} of ${followups.length}`
    : q?.id === "stage" ? "School stage" : q?.id === "priorities" ? "Your priorities" : q?.signal === "aversion" ? "What you’d pass on" : "Everyday choices";
  const neutral = selected.includes(notTried) || selected.includes(noFit);
  const isStage = q?.id === "stage";
  const pickText = q?.signal === "aversion"
    ? (limit > 1 ? "Pass on up to two" : "Pick one to hand over")
    : (limit > 1 ? "Choose up to " + limit : "Choose one");
  return <div ref={root} className={s.finder} data-question={complete ? undefined : q.id}>
    <div className={s.frame}>
      <div className={s.folio}><nav className={s.crumbs} aria-label="Breadcrumb"><Link href="/admissions">Admissions</Link><span aria-hidden="true">/</span><span aria-current="page">SRM Course Finder</span></nav>
        {!complete && <div className={s.progress}>
          <span>{progressLabel}</span>
          <progress aria-label="Question progress" value={part} max={core.length} />
          <span>{part} of {core.length}</span>
        </div>}
      </div>
      {complete ? <Results answers={draft.answers} catalog={catalog} onEdit={step => update({ ...draft, beforeEdit: draft.answers, step })}
        onReset={() => { writeShortlist([], "finder"); update({ ...fresh, seed: draft.seed + 1 }); }} /> : <>
        <div className={s.spread} key={q.id}>
          <header className={s.questionHead}>
            <h1 id="finder-heading" tabIndex={-1}>{q.title}</h1>
            <p>{q.hint}</p>
          </header>
          {isStage && <CampusPrint />}
          <section className={s.responses} aria-label="Answer choices">
            <div className={s.answerTools}><strong>{pickText}</strong><button onClick={() => forward(true)}>Skip question</button></div>
            <div className={s.choices} data-aversion={q.signal === "aversion" || undefined} role="group" aria-labelledby="finder-heading">
              {orderedChoices(q, draft.seed).map(choice => <button key={choice.id} className={s.choice} aria-pressed={selected.includes(choice.id)}
                disabled={limit > 1 && selected.length >= limit && !selected.includes(choice.id)}
                onClick={() => change(choice.id)}>
                <span className={s.choiceCopy}>{choice.label}{isStage && <small>{schoolNotes[choice.id]}</small>}</span>
                <span aria-hidden="true" className={s.mark}>{selected.includes(choice.id) ? "✓" : ""}</span>
              </button>)}
            </div>
            {q.signal && <div className={s.otherAnswers} role="group" aria-label="Other ways to answer">
              <button className={s.untried} aria-pressed={selected.includes(noFit)} onClick={() => change(noFit)}>
                {selected.includes(noFit) && "✓ "}{neutralLabel(q, noFit)}</button>
              <button className={s.untried} aria-pressed={selected.includes(notTried)} onClick={() => change(notTried)}>
                {selected.includes(notTried) && "✓ "}{neutralLabel(q, notTried)}</button>
            </div>}
            {limit > 1 && <p role="status" className={s.count}>{neutral ? "You can continue with this answer." : selected.length + " of " + limit + " selected"}{!neutral && selected.length === limit && " · Deselect one to change it."}</p>}
          </section>
        </div>
        <div className={s.actions}>
          {originalAnswers ? <button className={s.back} onClick={() => update({ seed: draft.seed, step: "results", answers: originalAnswers })}>Cancel changes</button> :
            <button className={s.back} disabled={index === 0} onClick={() => update({ ...draft, step: path[index - 1].id })}><span aria-hidden="true">← </span>Back</button>}
          <button className={s.continue} disabled={!selected.length} onClick={() => forward()}>{draft.beforeEdit && !missingStep ? "Save changes" : q.id === "priorities" ? "See my results" : "Continue"} <span aria-hidden="true">→</span></button>
        </div>
        <noscript><p>Enable JavaScript to take part. You can also <Link href="/programmes">browse SRM programmes</Link>.</p></noscript>
      </>}
    </div>
  </div>;
}
