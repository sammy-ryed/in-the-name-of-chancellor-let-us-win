"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { SrmCrest } from "@/components/HomeLogo";
import { Icon } from "./Icons";
import { IdleSearchPrompt } from "./IdleSearchPrompt";
import dynamic from "next/dynamic";
import { useLauncherSurface } from "./useLauncherSurface";
import "./search.css";

const SearchPanel = dynamic(() => import("./SearchPanel").then((module) => module.SearchPanel));

export default function AskSRM() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [visited, setVisited] = useState(false);
  const [docked, setDocked] = useState(false);
  const [shortcut, setShortcut] = useState("Ctrl K");
  const trigger = useRef<HTMLButtonElement>(null);

  useLauncherSurface(trigger, path);

  const launch = useCallback(() => { setVisited(true); setOpen(true); }, []);

  useEffect(() => {
    const phone = window.matchMedia("(max-width: 760px)");
    let timer: number;
    const startPreview = () => {
      window.clearTimeout(timer);
      if (phone.matches) timer = window.setTimeout(() => setDocked(true), 7500);
    };
    const onLayoutChange = () => {
      setDocked(false);
      startPreview();
    };
    startPreview();
    phone.addEventListener("change", onLayoutChange);
    return () => {
      window.clearTimeout(timer);
      phone.removeEventListener("change", onLayoutChange);
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (/Mac|iPhone|iPad/.test(navigator.platform)) setShortcut("⌘ K");
    }, 0);
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
          data-docked={docked || undefined}
          type="button"
          aria-label="Ask SRM, AI search. Ask anything about SRM."
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-keyshortcuts="Control+K Meta+K"
          onClick={launch}
        >
          <SrmCrest />
          <Icon name="search" />
          <span className="ask-launch-brand"><strong>Ask SRM</strong><span className="ask-ai-label">AI search</span></span>
          <IdleSearchPrompt key={path} path={path} />
          <kbd aria-hidden="true">{shortcut}</kbd>
        </button>
      </aside>
      {visited && (
        <SearchPanel
          open={open}
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
