"use client";

import { useCallback, useEffect, useEffectEvent, useRef, useState, useSyncExternalStore } from "react";

const readingTime = 7000;
const motionQuery = "(prefers-reduced-motion: reduce)";
const quietMotion = () => matchMedia(motionQuery).matches || document.documentElement.hasAttribute("data-quiet-motion");
const serverQuietMotion = () => true;

export function useCarouselPlayback<T extends HTMLElement>({ onAdvance, enabled }: {
  onAdvance: (reducedMotion: boolean) => void;
  enabled: boolean;
}) {
  const rootRef = useRef<T>(null);
  const [choice, setChoice] = useState<boolean | null>(null);
  const subscribe = useCallback((notify: () => void) => {
    const media = matchMedia(motionQuery);
    let previous = quietMotion();
    const sync = () => {
      const next = quietMotion();
      if (next === previous) return;
      previous = next;
      setChoice(null);
      notify();
    };
    media.addEventListener("change", sync);
    window.addEventListener("srm-reading-change", sync);
    return () => {
      media.removeEventListener("change", sync);
      window.removeEventListener("srm-reading-change", sync);
    };
  }, []);
  const reducedMotion = useSyncExternalStore(subscribe, quietMotion, serverQuietMotion);
  const playing = enabled && (choice ?? !reducedMotion);
  const advance = useEffectEvent(() => onAdvance(reducedMotion));

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !playing) return;
    let visible = false;
    let timer: number | undefined;
    const hover = matchMedia("(hover: hover) and (pointer: fine)");

    function schedule() {
      window.clearInterval(timer);
      if (!root || !visible || document.hidden) return;
      // A visitor can explicitly start playback and leave focus on the Play button.
      const control = root.querySelector("[data-carousel-playback]");
      if (root.contains(document.activeElement) && !(choice && control?.contains(document.activeElement))) return;
      if (hover.matches && root.matches(":hover") && !(choice && control?.matches(":hover"))) return;
      timer = window.setInterval(() => {
        if (!document.querySelector("dialog[open]")) advance();
      }, readingTime);
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.intersectionRatio >= 0.2;
      schedule();
    }, { threshold: 0.2 });
    observer.observe(root);
    root.addEventListener("pointerover", schedule);
    root.addEventListener("pointerleave", schedule);
    root.addEventListener("focusin", schedule);
    root.addEventListener("focusout", schedule);
    document.addEventListener("visibilitychange", schedule);

    // Stop on an intentional swipe or trackpad step. Vertical page scrolling can continue normally.
    let touch: Touch | undefined;
    const start = (event: TouchEvent) => { touch = event.touches[0]; };
    const move = (event: TouchEvent) => {
      const point = event.touches[0];
      if (!touch || !point) return;
      const dx = Math.abs(point.clientX - touch.clientX);
      if (dx > 10 && dx > Math.abs(point.clientY - touch.clientY)) setChoice(false);
    };
    const wheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY) || (event.shiftKey && event.deltaY)) setChoice(false);
    };
    root.addEventListener("touchstart", start, { passive: true });
    root.addEventListener("touchmove", move, { passive: true });
    root.addEventListener("wheel", wheel, { passive: true });
    return () => {
      window.clearInterval(timer);
      observer.disconnect();
      root.removeEventListener("pointerover", schedule);
      root.removeEventListener("pointerleave", schedule);
      root.removeEventListener("focusin", schedule);
      root.removeEventListener("focusout", schedule);
      document.removeEventListener("visibilitychange", schedule);
      root.removeEventListener("touchstart", start);
      root.removeEventListener("touchmove", move);
      root.removeEventListener("wheel", wheel);
    };
  }, [playing, choice]);

  return {
    rootRef, playing, reducedMotion,
    togglePlayback: () => setChoice(!playing),
    pausePlayback: () => setChoice(false),
  };
}
