"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { applyIncubation } from "./data";
import { startups, type Startup } from "./showcase";
import styles from "./showcase.module.css";

const rows: { title: string; status: Startup["status"] }[] = [
  { title: "Incubating", status: "Incubating" },
  { title: "Graduated", status: "Graduated" },
];

/**
 * The portfolio as two endlessly scrolling rows of cards. Each card's "See more" button opens a detail dialog.
 * Rows pause on hover or keyboard focus; with reduced motion they become plain scrollable rows.
 */
export function StartupShowcase() {
  const [open, setOpen] = useState<Startup | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  function show(startup: Startup, button: HTMLButtonElement) {
    opener.current = button;
    setOpen(startup);
    dialog.current?.showModal();
  }

  const card = (s: Startup, copy: boolean) => (
    <li key={s.id}>
      <button type="button" className={styles.startup} aria-haspopup="dialog" tabIndex={copy ? -1 : undefined}
        aria-label={`${s.name}. ${s.summary ?? "Profile coming soon."}`}
        onClick={e => show(s, e.currentTarget)}>
        <span className={styles.startupLogo}>
          <Image src={s.logo} alt="" fill unoptimized sizes="260px" />
        </span>
        <span className={styles.startupBody}>
          {s.sector && <span className={styles.startupMeta}><span>{s.sector}</span></span>}
          <span className={styles.startupName}>{s.name}</span>
          <span className={styles.startupSummary}>{s.summary ?? "Profile coming soon."}</span>
        </span>
      </button>
    </li>
  );

  return (
    <div className={styles.showcase}>
      {rows.map((row, r) => {
        const list = startups.filter(s => s.status === row.status);
        return (
          <section key={row.status} className={styles.startupRow} aria-labelledby={`startups-${row.status}`}>
            <h3 id={`startups-${row.status}`} className={styles.rowTitle}>{row.title} <span>{list.length}</span></h3>
            <div className={styles.rail} data-reverse={r === 1 || undefined}>
              <ul className={styles.railTrack}>{list.map(s => card(s, false))}</ul>
              <ul className={styles.railTrack} aria-hidden="true" inert>{list.map(s => card(s, true))}</ul>
            </div>
          </section>
        );
      })}

      <dialog ref={dialog} className={styles.dialog} aria-labelledby="dei-startup-name"
        onClose={() => { setOpen(null); opener.current?.focus(); }}
        onClick={e => { if (e.target === e.currentTarget) dialog.current?.close(); }}>
        {open && (
          <div className={styles.dialogInner}>
            <button type="button" className={styles.dialogClose} onClick={() => dialog.current?.close()} aria-label="Close">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
            <div className={styles.dialogLogo}><Image src={open.logo} alt={`${open.name} logo`} fill unoptimized sizes="240px" /></div>
            <div className={styles.startupMeta}>
              <span data-status={open.status}>{open.status} startup</span>
              {open.sector && <span>{open.sector}</span>}
            </div>
            <h2 id="dei-startup-name">{open.name}</h2>
            {open.detail
              ? <p>{open.detail}</p>
              : <p>We are putting together {open.name}&apos;s profile. Check back soon, or ask the DEI team for an introduction.</p>}
            {open.highlight && <p className={styles.dialogHighlight}><strong>Milestone:</strong> {open.highlight}</p>}
            <div className={styles.dialogActions}>
              {open.href && <a className={styles.ctaPrimary} href={open.href} target="_blank" rel="noopener noreferrer">
                Visit {open.name} <span aria-hidden="true">↗</span></a>}
              <a className={styles.ctaGhost} href={applyIncubation}>Build yours with DEI <span aria-hidden="true">→</span></a>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
