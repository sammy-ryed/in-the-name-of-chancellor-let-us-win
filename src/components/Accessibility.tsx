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
        title="Accessibility settings (Alt+M)"
        ref={trigger}
        popoverTarget="access-settings"
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
