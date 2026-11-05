"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { start } from "./guided/flow";
import type { shortlist } from "./guided/score";
import "./programme-quiz.css";

type FirstStep = ReturnType<typeof start>;
type Result = ReturnType<typeof shortlist>;
type Step = FirstStep | { version: string; state: "complete"; result: Result };
type Value = string | string[] | number | null;
type Entry = { step: FirstStep; value: Value };
const rupees = (value: number) => "₹" + value.toLocaleString("en-IN");

function Results({ result }: { result: Result }) {
  return <>
    <p>{result.message}</p>
    {result.recommendations.map(course => <article key={course.courseId} className="pq-course">
      <h4><Link href={course.detailsUrl}>{course.degree} · {course.name}</Link></h4>
      <p>{course.campus} · {course.duration}</p>
      <p><strong>Something you could try</strong><br />{course.example}</p>
      <ul>{course.reasons.map(reason => <li key={reason}>{reason}</li>)}</ul>
      {course.earnings && <p>{course.earnings.cohort
        ? course.earnings.cohort.label + " · " + course.earnings.cohort.year + ". " + course.earnings.cohort.placed + " placed out of " + course.earnings.cohort.graduatedInTime + " graduating on time."
        : "A verified salary figure for this course is unavailable."}{" "}
        {course.earnings.cohort && <a href={course.earnings.cohort.source}>Placement source</a>}</p>}
      <Link href={course.detailsUrl}>Fees and entry requirements</Link>{" · "}<a href={course.officialUrl}>Official admissions</a>
    </article>)}
    {result.earningsNote && <>
      <p>{result.earningsNote}</p>
      <details><summary>Compare reported starting pay</summary>
        {result.targetAnnualINR && <p>Your yearly target is {rupees(result.targetAnnualINR)}.</p>}
        {result.earningsComparison.map(c => <p key={c.label}><strong>{c.label} · {c.year}</strong><br />
          Median {rupees(c.medianINR)} a year among {c.placed} placed graduates. {c.graduatedInTime} graduated on time.{" "}
          <a href={c.source}>View report</a></p>)}
      </details>
    </>}
    {result.priorities.length > 0 && <details><summary>What to ask before applying</summary>
      <ul>{result.priorities.map(p => <li key={p.id}>{p.questionToAsk}</li>)}</ul>
    </details>}
    <p><Link href={result.browseUrl}>Browse all programmes</Link></p>
  </>;
}

export function ProgrammeQuiz({ initial }: { initial: FirstStep }) {
  const [step, setStep] = useState<Step>(initial);
  const [history, setHistory] = useState<Entry[]>([]);
  const [picked, setPicked] = useState<string[]>([]);
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const sending = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const focusNext = useRef(false);

  useEffect(() => {
    if (focusNext.current) {
      heading.current?.focus();
      focusNext.current = false;
    }
  }, [step]);

  function show(next: Step, entries: Entry[], previous: Value = null) {
    focusNext.current = true;
    setStep(next);
    setHistory(entries);
    setPicked(Array.isArray(previous) ? previous : typeof previous === "string" ? [previous] : []);
    setAmount(typeof previous === "number" ? String(previous) : "");
    setError("");
  }
  function back() {
    const last = history.at(-1);
    if (last) show(last.step, history.slice(0, -1), last.value);
  }
  async function answer(value: Value) {
    if (sending.current || step.state !== "question") return;
    sending.current = true;
    setBusy(true);
    setError("");
    const entries = [...history, { step, value }];
    try {
      const response = await fetch("/api/admissions/programme-finder/step", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: step.version, answers: entries.map(e => ({ questionId: e.step.question.id, value: e.value })) }),
      });
      if (!response.ok) {
        setError(response.status === 409 ? "The quiz has been updated. Refresh this page to start again." : "Your answer could not be saved. Please try again.");
        return;
      }
      show(await response.json(), entries);
    } catch {
      setError("Couldn’t reach the quiz. Check your connection and try again.");
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }

  const q = step.state === "question" ? step.question : null;
  return <div className="pq-panel" aria-busy={busy}>
    <h3 ref={heading} tabIndex={-1}>{q?.prompt ?? "Your programme shortlist"}</h3>
    {q && <form onSubmit={e => {
      e.preventDefault();
      if (q.kind === "amount") void answer(Number(amount));
      if (q.kind === "multiple" && picked.length) void answer(picked);
    }}>
      <div key={q.id} className="pq-options">
        {q.options?.map(option => q.kind === "single" ?
          <button type="button" className="pq-choice" aria-pressed={picked.includes(option.id)} disabled={busy}
            key={option.id} onClick={() => void answer(option.id)}>{option.label} <span aria-hidden="true">→</span></button>
          : <label className="pq-choice" key={option.id}><input type="checkbox" checked={picked.includes(option.id)}
              disabled={busy || (!picked.includes(option.id) && picked.length >= (q.maxChoices ?? 1))}
              onChange={e => setPicked(e.target.checked ? [...picked, option.id] : picked.filter(id => id !== option.id))} />
              {option.label}</label>)}
        {q.kind === "amount" && <label className="pq-amount">Yearly salary in rupees
          <input type="number" inputMode="numeric" min={q.min} max={q.max} step="1" required
            disabled={busy} value={amount} onChange={e => setAmount(e.target.value)} /></label>}
      </div>
      <div className="pq-actions">
        {history.length > 0 && <button type="button" disabled={busy} onClick={back}>Back</button>}
        <button type="button" disabled={busy} onClick={() => void answer(null)}>{q.skipLabel}</button>
        {q.kind !== "single" && <button type="submit" className="pq-next" disabled={busy || (q.kind === "amount" ? !amount : !picked.length)}>Continue →</button>}
      </div>
    </form>}
    {step.state === "complete" && <>
      <Results result={step.result} />
      <div className="pq-actions"><button type="button" onClick={back}>Back</button>
        <button type="button" onClick={() => show(initial, [])}>Start again</button></div>
    </>}
    {error && <p role="alert">{error}</p>}
  </div>;
}
