"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "./Icons";
import { SearchPanel } from "./SearchPanel";
import "./search.css";

const tipKey = "srm.ask.tip.v1";

export default function AskSRM() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [tip, setTip] = useState(false);
  const [shortcut, setShortcut] = useState("Ctrl K");
  const trigger = useRef<HTMLButtonElement>(null);
  const seen = useRef(false);

  const dismissTip = useCallback(() => {
    seen.current = true;
    setTip(false);
    try {
      localStorage.setItem(tipKey, "seen");
    } catch {}
  }, []);

  const launch = useCallback(() => {
    dismissTip();
    setOpen(true);
  }, [dismissTip]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (/Mac|iPhone|iPad/.test(navigator.platform)) setShortcut("⌘ K");
      if (seen.current) return;
      try {
        if (localStorage.getItem(tipKey)) return;
      } catch {}
      if (document.querySelector('dialog[open], [aria-modal="true"]')) return;
      seen.current = true;
      setTip(true);
      try {
        localStorage.setItem(tipKey, "seen");
      } catch {}
    }, 650);
    const shortcutKey = (e: KeyboardEvent) => {
      if (
        !(e.ctrlKey || e.metaKey) ||
        e.altKey ||
        e.shiftKey ||
        e.key.toLowerCase() !== "k" ||
        e.defaultPrevented
      )
        return;
      if (document.querySelector('dialog[open], [aria-modal="true"]')) return;
      e.preventDefault();
      launch();
    };
    window.addEventListener("keydown", shortcutKey);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", shortcutKey);
    };
  }, [launch]);

  return (
    <>
      <aside className="ask-dock" aria-label="SRM site search">
        <button
          ref={trigger}
          className="ask-launch"
          type="button"
          aria-label="Ask SRM, search the site"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-keyshortcuts="Control+K Meta+K"
          onClick={launch}
        >
          <span className="ask-launch-mark">
            <Icon name="search" />
          </span>
          <span>Ask SRM</span>
          <kbd aria-hidden="true">{shortcut}</kbd>
        </button>
        {tip && !open && (
          <div className="ask-tip">
            <p>Try “Where is SRM?” or search for a course.</p>
            <button
              type="button"
              onClick={dismissTip}
              aria-label="Dismiss search tip"
            >
              <Icon name="close" />
            </button>
          </div>
        )}
      </aside>
      {open && (
        <SearchPanel
          key={path}
          path={path}
          onClose={() => {
            setOpen(false);
            trigger.current?.focus({ preventScroll: true });
          }}
        />
      )}
    </>
  );
}
