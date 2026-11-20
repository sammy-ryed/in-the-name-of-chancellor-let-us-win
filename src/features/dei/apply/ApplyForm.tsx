"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { deiRoutes } from "../data";
import { allFields, checkFiles, checkValue, isVisible, steps, type Field, type Values } from "./schema";
import styles from "./apply.module.css";

const draftKey = "dei-apply-draft-v3";
type Files = Record<string, File[]>;
type Errors = Record<string, string>;

const formatSize = (bytes: number) => bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

function readDraft(): { values: Values; step: number } | null {
  try {
    const raw = localStorage.getItem(draftKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && parsed.values ? parsed : null;
  } catch { return null; }
}

export function ApplyForm() {
  const [values, setValues] = useState<Values>({});
  const [files, setFiles] = useState<Files>({});
  const [step, setStep] = useState(0);
  const [reached, setReached] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [showSummary, setShowSummary] = useState(false);
  const [saved, setSaved] = useState<"idle" | "saved">("idle");
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const summary = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  // Restore a saved draft once, after hydration.
  useEffect(() => {
    const draft = readDraft();
    if (draft) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time restore from browser storage
      setValues(draft.values);
      const s = Math.min(Math.max(0, draft.step | 0), steps.length - 1);
      setStep(s);
      setReached(s);
    }
    loaded.current = true;
  }, []);

  // Autosave typed answers (files can't be stored).
  useEffect(() => {
    if (!loaded.current || done) return;
    const t = window.setTimeout(() => {
      try { localStorage.setItem(draftKey, JSON.stringify({ values, step })); setSaved("saved"); } catch { /* storage unavailable */ }
    }, 400);
    return () => window.clearTimeout(t);
  }, [values, step, done]);

  const errorFor = (f: Field) => f.kind === "file" ? checkFiles(f, files[f.name] ?? []) : checkValue(f, values[f.name]);
  const stepErrors = (i: number): Errors => {
    const out: Errors = {};
    for (const f of steps[i].fields) if (isVisible(f, values)) { const e = errorFor(f); if (e) out[f.name] = e; }
    return out;
  };

  const complete = steps.map((_, i) => Object.keys(stepErrors(i)).length === 0);

  function update(name: string, value: string | string[]) {
    setValues(v => ({ ...v, [name]: value }));
    setSaved("idle");
    if (errors[name]) setErrors(e => { const next = { ...e }; delete next[name]; return next; });
  }

  function goTo(i: number) {
    setStep(i);
    setReached(r => Math.max(r, i));
    setErrors({});
    setShowSummary(false);
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      form.current?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    });
  }

  function validateStep(): boolean {
    const found = stepErrors(step);
    setErrors(found);
    if (Object.keys(found).length) {
      setShowSummary(true);
      requestAnimationFrame(() => summary.current?.focus());
      return false;
    }
    return true;
  }

  async function submit() {
    // Re-check every step; jump to the first one with a problem.
    for (let i = 0; i < steps.length; i++) {
      const found = stepErrors(i);
      if (Object.keys(found).length) {
        if (i !== step) goTo(i);
        requestAnimationFrame(() => { setErrors(found); setShowSummary(true); requestAnimationFrame(() => summary.current?.focus()); });
        return;
      }
    }
    setSending(true);
    setFailure(null);
    const body = new FormData();
    for (const f of allFields) {
      if (!isVisible(f, values)) continue;
      if (f.kind === "file") (files[f.name] ?? []).forEach(file => body.append(f.name, file));
      else {
        const v = values[f.name];
        if (Array.isArray(v)) v.forEach(x => body.append(f.name, x));
        else if (v) body.append(f.name, v);
      }
    }
    try {
      const res = await fetch("/api/dei/apply", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.errors && typeof data.errors === "object") {
          const target = steps.findIndex(s => s.fields.some(f => f.name in data.errors));
          if (target >= 0) { goTo(target); requestAnimationFrame(() => { setErrors(data.errors); setShowSummary(true); }); }
        }
        setFailure(data.error ?? "We couldn't send your application. Please try again.");
        return;
      }
      try { localStorage.removeItem(draftKey); } catch { /* ignore */ }
      setDone(data.reference ?? "received");
      window.scrollTo({ top: 0 });
    } catch {
      setFailure("You seem to be offline. Your answers are saved here; try again when you're connected.");
    } finally {
      setSending(false);
    }
  }

  function next(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep()) return;
    if (step === steps.length - 1) void submit();
    else goTo(step + 1);
  }

  if (done) {
    return (
      <div className={styles.success} role="status">
        <span className={styles.successIcon} aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        </span>
        <h2>Application received</h2>
        <p>Thanks{values.fullName ? `, ${String(values.fullName).split(" ")[0]}` : ""}. Your reference is <strong>{done}</strong>.</p>
        <ol className={styles.nextSteps}>
          <li><b>Within 5 working days</b> the BRC team reviews your application.</li>
          <li><b>Shortlisted teams</b> are invited to pitch to the selection panel.</li>
          <li><b>Selected startups</b> get an offer with workspace, mentors and a funding plan.</li>
        </ol>
        <div className={styles.successActions}>
          <Link className={styles.primary} href={deiRoutes.home.href}>Back to DEI home</Link>
          <Link className={styles.ghost} href={deiRoutes.startups.href}>Explore funding</Link>
        </div>
        <p className={styles.prototypeNote}>Prototype: applications are validated but not stored. Connect the API route to BRC&apos;s system before launch.</p>
      </div>
    );
  }

  const current = steps[step];
  const isLast = step === steps.length - 1;
  const visibleFields = current.fields.filter(f => isVisible(f, values));

  return (
    <div className={styles.layout}>
      <form ref={form} className={styles.panel} noValidate onSubmit={next} aria-labelledby="apply-step-title">
        <nav className={styles.checklist} aria-label="Application sections">
          <ol>
            {steps.map((s, i) => {
              const done = complete[i] && i <= reached && i !== step;
              const locked = i > reached && !complete.slice(0, i).every(Boolean);
              return (
                <li key={s.id} data-done={done || undefined} data-current={i === step || undefined}>
                  <button type="button" disabled={locked} aria-current={i === step ? "step" : undefined} onClick={() => goTo(i)}>
                    <span className={styles.tick} aria-hidden="true">
                      {done ? <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg> : i + 1}
                    </span>
                    <span className={styles.tickLabel}>{s.title}{done && <span className={styles.srOnly}> (done)</span>}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <header className={styles.panelHead}>
          <p className={styles.kicker}>Step {step + 1} of {steps.length}</p>
          <h2 id="apply-step-title" ref={heading} tabIndex={-1}>{current.title}</h2>
          <p>{current.intro}</p>
          <p className={styles.requiredNote}><span className={styles.star} aria-hidden="true">*</span> Required</p>
        </header>

        {showSummary && Object.keys(errors).length > 0 && (
          <div ref={summary} className={styles.errorSummary} tabIndex={-1} role="alert">
            <h3>Fix {Object.keys(errors).length === 1 ? "this" : `these ${Object.keys(errors).length}`} to continue</h3>
            <ul>
              {Object.entries(errors).map(([name, msg]) => (
                <li key={name}><a href={`#f-${name}`}><b>{allFields.find(f => f.name === name)?.label}:</b> {msg}</a></li>
              ))}
            </ul>
          </div>
        )}

        {isLast && <Review values={values} files={files} onEdit={goTo} />}

        <div className={styles.fields}>
          {visibleFields.map(f => (
            <FieldControl key={f.name} field={f} value={values[f.name]} files={files[f.name] ?? []} error={errors[f.name]}
              onChange={v => update(f.name, v)}
              onFiles={list => { setFiles(prev => ({ ...prev, [f.name]: list })); if (errors[f.name]) setErrors(e => { const n = { ...e }; delete n[f.name]; return n; }); }} />
          ))}
        </div>

        {failure && <p className={styles.failure} role="alert">{failure}</p>}

        <div className={styles.actions}>
          {step > 0
            ? <button type="button" className={styles.ghost} onClick={() => goTo(step - 1)}><span aria-hidden="true">←</span> Back</button>
            : <span />}
          <span className={styles.saved} aria-live="polite">{saved === "saved" ? "Draft saved on this device" : ""}</span>
          <button type="submit" className={styles.primary} disabled={sending}>
            {sending ? "Sending…" : isLast ? "Submit application" : `Continue to ${steps[step + 1].title.toLowerCase()}`}
            {!sending && <span aria-hidden="true">→</span>}
          </button>
        </div>
      </form>
    </div>
  );
}

function FieldControl({ field: f, value, files, error, onChange, onFiles }: {
  field: Field;
  value: string | string[] | undefined;
  files: File[];
  error?: string;
  onChange: (v: string | string[]) => void;
  onFiles: (files: File[]) => void;
}) {
  const id = `f-${f.name}`;
  const hintId = f.hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errId].filter(Boolean).join(" ") || undefined;
  const text = typeof value === "string" ? value : "";
  const list = Array.isArray(value) ? value : [];
  const label = <>{f.label}{f.required && f.kind !== "consent" && <span className={styles.star} aria-hidden="true"> *</span>}</>;
  const messages = <>
    {f.hint && <p id={hintId} className={styles.hint}>{f.hint}</p>}
    {error && <p id={errId} className={styles.error}>{error}</p>}
  </>;
  const common = { id, name: f.name, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy, required: f.required };

  if (f.kind === "radio" || f.kind === "checks") {
    return (
      <fieldset className={styles.field} data-wide={f.wide || undefined} id={id} aria-describedby={describedBy} aria-invalid={error ? true : undefined}>
        <legend>{label}</legend>
        {messages}
        <div className={styles.choices} data-cards={f.options?.some(o => o.hint) || undefined}>
          {f.options?.map(o => {
            const checked = f.kind === "radio" ? text === o.value : list.includes(o.value);
            return (
              <label key={o.value} className={styles.choice} data-checked={checked || undefined}>
                <input type={f.kind === "radio" ? "radio" : "checkbox"} name={f.name} value={o.value} checked={checked}
                  onChange={() => onChange(f.kind === "radio" ? o.value : checked ? list.filter(v => v !== o.value) : [...list, o.value])} />
                <span>{o.label}{o.hint && <small>{o.hint}</small>}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  }

  if (f.kind === "consent") {
    return (
      <div className={styles.field} data-wide>
        <label className={styles.consent} data-checked={text === "yes" || undefined}>
          <input type="checkbox" {...common} checked={text === "yes"} onChange={e => onChange(e.target.checked ? "yes" : "")} />
          <span>{f.label}</span>
        </label>
        {messages}
      </div>
    );
  }

  if (f.kind === "file") return <FileDrop field={f} files={files} error={error} describedBy={describedBy} messages={messages} onFiles={onFiles} />;

  return (
    <div className={styles.field} data-wide={f.wide || undefined}>
      <label htmlFor={id}>{label}</label>
      {messages}
      {f.kind === "textarea"
        ? <textarea {...common} rows={4} value={text} placeholder={f.placeholder} onChange={e => onChange(e.target.value)} />
        : f.kind === "select"
          ? <select {...common} value={text} onChange={e => onChange(e.target.value)}>
              <option value="">Choose…</option>
              {f.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          : <input {...common} type={f.kind} value={text} placeholder={f.placeholder} autoComplete={f.autoComplete}
              inputMode={f.kind === "number" ? "numeric" : undefined} min={f.kind === "number" ? 1 : undefined}
              onChange={e => onChange(e.target.value)} />}
      {f.max && <span className={styles.count} data-over={text.length > f.max || undefined}>{text.length}/{f.max}</span>}
    </div>
  );
}

function FileDrop({ field: f, files, error, describedBy, messages, onFiles }: {
  field: Field; files: File[]; error?: string; describedBy?: string; messages: React.ReactNode; onFiles: (files: File[]) => void;
}) {
  const [over, setOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const id = `f-${f.name}`;
  const max = f.maxFiles ?? 1;
  const add = (incoming: FileList | null) => {
    if (!incoming?.length) return;
    onFiles(max === 1 ? [incoming[0]] : [...files, ...Array.from(incoming)].slice(0, max));
    if (input.current) input.current.value = "";
  };
  return (
    <div className={styles.field} data-wide>
      <span className={styles.fileLabel} id={`${id}-label`}>{f.label}{f.required && <span className={styles.star} aria-hidden="true"> *</span>}</span>
      {messages}
      <label htmlFor={id} className={styles.drop} data-over={over || undefined} data-invalid={error ? true : undefined}
        onDragOver={e => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
        onDrop={e => { e.preventDefault(); setOver(false); add(e.dataTransfer.files); }}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></svg>
        <span><b>Choose {max > 1 ? "files" : "a file"}</b> or drag {max > 1 ? "them" : "it"} here</span>
        <input ref={input} id={id} name={f.name} type="file" accept={f.accept} multiple={max > 1}
          aria-labelledby={`${id}-label`} aria-describedby={describedBy} aria-invalid={error ? true : undefined}
          onChange={e => add(e.target.files)} />
      </label>
      {files.length > 0 && (
        <ul className={styles.fileList}>
          {files.map((file, i) => (
            <li key={file.name + i}>
              <span className={styles.fileType} aria-hidden="true">{file.name.split(".").pop()?.toUpperCase()}</span>
              <span className={styles.fileName}>{file.name}<small>{formatSize(file.size)}</small></span>
              <button type="button" onClick={() => onFiles(files.filter((_, j) => j !== i))} aria-label={`Remove ${file.name}`}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Review({ values, files, onEdit }: { values: Values; files: Files; onEdit: (i: number) => void }) {
  return (
    <div className={styles.review}>
      {steps.slice(0, -1).map((s, i) => (
        <section key={s.id} aria-labelledby={`review-${s.id}`}>
          <div className={styles.reviewHead}>
            <h3 id={`review-${s.id}`}>{s.title}</h3>
            <button type="button" onClick={() => onEdit(i)}>Edit<span className={styles.srOnly}> {s.title.toLowerCase()}</span></button>
          </div>
          <dl>
            {s.fields.filter(f => isVisible(f, values)).map(f => {
              const v = f.kind === "file" ? (files[f.name] ?? []).map(x => x.name) : values[f.name];
              const shown = Array.isArray(v) ? v.join(", ")
                : f.options?.find(o => o.value === v)?.label ?? v;
              return (
                <div key={f.name}>
                  <dt>{f.label}</dt>
                  <dd>{shown || (f.required ? <span className={styles.missing}>Missing</span> : <span className={styles.empty}>Not provided</span>)}</dd>
                </div>
              );
            })}
          </dl>
        </section>
      ))}
    </div>
  );
}
