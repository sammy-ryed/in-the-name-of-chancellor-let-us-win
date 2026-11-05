"use client";
import { useEffect, useRef, useState } from "react";
const defaults = { large: false, contrast: false, motion: false };
type Prefs = typeof defaults;
const storage = "srm-reading-options";
function apply(p: Prefs) {
  const el = document.documentElement;
  el.toggleAttribute("data-large-text", p.large);
  el.toggleAttribute("data-high-contrast", p.contrast);
  el.toggleAttribute("data-quiet-motion", p.motion);
  window.dispatchEvent(new Event("srm-reading-change"));
}
export default function Accessibility() {
  const [prefs, setPrefs] = useState(defaults),
    [compact, setCompact] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null),
    trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(storage) || "{}");
      const p = {
        large: raw.large === true,
        contrast: raw.contrast === true,
        motion: raw.motion === true,
      };
      queueMicrotask(() => {
        setPrefs(p);
        apply(p);
      });
    } catch {}
    const keys = (e: KeyboardEvent) => {
      if (e.altKey && !e.ctrlKey && !e.metaKey && e.key.toLowerCase() === "m") {
        e.preventDefault();
        if (dialog.current?.open) dialog.current.close();
        else dialog.current?.showModal();
      }
    };
    window.addEventListener("keydown", keys);
    return () => window.removeEventListener("keydown", keys);
  }, []);
  function update(p: Prefs) {
    setPrefs(p);
    apply(p);
    try {
      localStorage.setItem(storage, JSON.stringify(p));
    } catch {}
  }
  return (
    <aside className="access" aria-label="Accessibility tools">
      <div className="access-chip">
        <button
          ref={trigger}
          aria-haspopup="dialog"
          aria-keyshortcuts="Alt+M"
          aria-describedby="access-hint"
          aria-label="Accessibility settings"
          onClick={() => dialog.current?.showModal()}
        >
          <svg
            aria-hidden="true"
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="4" r="2" />
            <path d="M3 8l9 2 9-2M12 10v4m0 0-5 8m5-8 5 8" />
          </svg>
          {!compact && "Accessibility"}
        </button>
        {!compact && (
          <button
            aria-label="Collapse accessibility label"
            onClick={() => {
              setCompact(true);
              trigger.current?.focus();
            }}
          >
            ×
          </button>
        )}
      </div>
      <div className="access-hint" id="access-hint" role="tooltip">
        Adjust text, contrast and motion. <kbd>Alt</kbd> <kbd>M</kbd>
      </div>
      <dialog
        ref={dialog}
        aria-label="Accessibility settings"
        onClose={() => trigger.current?.focus({ preventScroll: true })}
      >
        <div className="access-tabs">
          <strong>Accessibility</strong>
          <button
            aria-label="Close accessibility settings"
            onClick={() => dialog.current?.close()}
          >
            ×
          </button>
        </div>
        <p>Choose how this site looks on this device.</p>
        {(
          [
            ["large", "Larger text"],
            ["contrast", "High contrast"],
            ["motion", "Reduce motion"],
          ] as const
        ).map(([key, label]) => (
          <label key={key}>
            {label}
            <input
              type="checkbox"
              checked={prefs[key]}
              onChange={(e) => update({ ...prefs, [key]: e.target.checked })}
            />
          </label>
        ))}
        <button className="access-reset" onClick={() => update(defaults)}>
          Reset preferences
        </button>
      </dialog>
    </aside>
  );
}
