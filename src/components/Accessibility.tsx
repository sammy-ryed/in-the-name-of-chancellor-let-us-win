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
  const [prefs, setPrefs] = useState(defaults);
  const trigger = useRef<HTMLButtonElement>(null);
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
        if (!document.querySelector("dialog:modal")) trigger.current?.click();
      }
    };
    window.addEventListener("keydown", keys);
    return () => {
      window.removeEventListener("keydown", keys);
    };
  }, []);
  function update(p: Prefs) {
    setPrefs(p);
    apply(p);
    try {
      localStorage.setItem(storage, JSON.stringify(p));
    } catch {}
  }
  return (
    <div className="access">
      <button
        type="button"
        className="access-trigger"
        aria-haspopup="dialog"
        aria-keyshortcuts="Alt+M"
        aria-label="Accessibility settings"
        ref={trigger}
        popoverTarget="access-settings"
      >
        <svg className="access-mark" viewBox="0 0 65 65" fill="currentColor" aria-hidden="true" focusable="false">
          <circle cx="32" cy="10.7" r="4.2" />
          <path d="m15.1 15.7 13.9 1.2h6.4l14.5-1.2a2.2 2.2 0 0 1 .5 4.4l-12.7 1.6v11.8l6.1 21a2.3 2.3 0 0 1-4.4 1.4l-6.4-18.7h-1.9l-6 18.7a2.4 2.4 0 0 1-4.6-1.4l5.6-20.3V21.7l-11.5-1.6a2.2 2.2 0 1 1 .5-4.4Z" />
        </svg>
        <span className="access-caption" aria-hidden="true">Accessibility</span>
      </button>
      <section id="access-settings" popover="auto" role="dialog" aria-labelledby="access-title"
        className="access-panel">
        <header className="access-heading">
          <h2 id="access-title">Accessibility</h2>
          <button type="button" aria-label="Close accessibility settings"
            popoverTarget="access-settings" popoverTargetAction="hide">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="m3 3 10 10m0-10L3 13" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </header>
        <div className="access-options">
          {([
            ["large", "Larger text"],
            ["contrast", "High contrast"],
            ["motion", "Reduce motion"],
          ] as const).map(([key, label]) => (
            <label key={key} className="access-option">
              {label}
              <input
                type="checkbox"
                role="switch"
                checked={prefs[key]}
                onChange={(e) => update({ ...prefs, [key]: e.target.checked })}
              />
            </label>
          ))}
        </div>
        <footer className="access-footer">
          <button type="button" className="access-reset"
            disabled={!prefs.large && !prefs.contrast && !prefs.motion}
            onClick={() => update(defaults)}>Reset preferences</button>
          <kbd aria-label="Keyboard shortcut Alt M">Alt + M</kbd>
        </footer>
      </section>
    </div>
  );
}
