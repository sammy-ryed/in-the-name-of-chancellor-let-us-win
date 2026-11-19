"use client";

import { useRef, type RefObject } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useVisitMotionEnabled } from "./VisitMotion";

gsap.registerPlugin(useGSAP, Flip, DrawSVGPlugin);

export function BookingProgress({ step }: { step: number }) {
  const root = useRef<HTMLDivElement>(null);
  const positioned = useRef(false);
  const previousStep = useRef(step);
  const enabled = useVisitMotionEnabled();
  const labels = ["Campus", "Date & time", "Your details", "Review", "Confirmed"];
  useGSAP(() => {
    const wrap = root.current;
    const indicator = wrap?.querySelector(".cv-progress-indicator");
    if (!wrap || !indicator) return;
    if (!enabled) {
      Flip.killFlipsOf(indicator);
      gsap.killTweensOf(indicator);
      wrap.removeAttribute("data-animated-progress");
      gsap.set(indicator, { clearProps: "all" }); positioned.current = false;
      return;
    }
    // Reconstruct the last settled percentage after the prior context reverts,
    // so each step owns one disposable Flip rather than accumulating timelines.
    gsap.set(indicator, { left: `${previousStep.current * 20}%`, width: "20%", height: "100%", opacity: 1 });
    const previous = positioned.current ? Flip.getState(indicator) : null;
    gsap.set(indicator, { left: `${step * 20}%`, width: "20%", height: "100%", opacity: 1 });
    wrap.setAttribute("data-animated-progress", "");
    if (previous) Flip.from(previous, { duration: .38, ease: "power3.inOut", scale: true });
    positioned.current = true;
    previousStep.current = step;
    return () => wrap.removeAttribute("data-animated-progress");
  }, { scope: root, dependencies: [step, enabled], revertOnUpdate: true });
  return <div ref={root} className="cv-progress-wrap"><span className="cv-progress-indicator" aria-hidden="true"/><ol className="cv-progress" aria-label="Booking progress">{labels.map((label, index) => <li key={label} aria-current={step === index ? "step" : undefined} className={index < step ? "is-complete" : ""}><span>{`0${index + 1}`}</span><b>{label}</b></li>)}</ol></div>;
}

type State = { step: number; restoring: boolean; month: string; date: string; slotId?: string; campusId: string; status?: string; loading: boolean; busy: boolean; error: string };
export function useBookingMotion(root: RefObject<HTMLDivElement | null>, state: State) {
  const enabled = useVisitMotionEnabled();
  const { step, restoring, month, date, slotId, campusId, status, loading, busy, error } = state;
  useGSAP(() => {
    if (restoring) return;
    const heading = root.current?.querySelector<HTMLElement>(".cv-step-title");
    // Keep both progress and the focused heading below the shared fixed header,
    // without competing with CSS smooth scrolling from the previous button.
    if (heading && document.activeElement === heading) root.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }, { scope: root, dependencies: [step, restoring] });
  useGSAP(() => {
    if (!enabled || restoring) return;
    const select = gsap.utils.selector(root);
    const sequence = gsap.timeline({ defaults: { ease: "power3.out", duration: .32 } });
    if (step === 4 && status === "confirmed") {
      sequence.from(select(".cv-confirmed-mark path"), { drawSVG: "0%", duration: .5 }, 0)
        .from(select(".cv-step-title"), { clipPath: "inset(0 100% 0 0)", duration: .4 }, .08)
        .from(select(".cv-confirmation-heading > p"), { y: 5, opacity: .6, duration: .25 }, .1)
        .from(select(".cv-confirmation-summary > div"), { y: 6, opacity: .5, stagger: .025, duration: .28 }, .14)
        // A single masked reveal; the actual QR is never scaled, tilted or looped.
        .from(select(".cv-entry-ticket"), { clipPath: "inset(0 100% 0 0)", duration: .55 }, .18)
        .from(select(".cv-ticket-separator"), { scale: 0, duration: .4 }, .25)
        .from(select(".cv-entry-actions a"), { y: 5, opacity: .65, stagger: .045, duration: .25 }, .4);
      return;
    }
    sequence.from(select(".cv-step-title"), { clipPath: "inset(0 100% 0 0)", duration: .45 })
      .from(select(".cv-step-content > p, .cv-fields > label, .cv-campus-option, .cv-summary > div"), { y: 8, opacity: .5, stagger: .035 }, .05);
  }, { scope: root, dependencies: [enabled, step, restoring, status], revertOnUpdate: true });
  useGSAP(() => {
    if (!enabled || !month) return;
    const calendar = root.current?.querySelector(".cv-calendar-days");
    if (calendar) gsap.from(calendar, { clipPath: "inset(0 0 0 100%)", duration: .28, ease: "power2.out" });
  }, { scope: root, dependencies: [enabled, month], revertOnUpdate: true });
  useGSAP(() => {
    if (!enabled || loading) return;
    const select = gsap.utils.selector(root);
    const selected = select(".cv-calendar-days button[aria-pressed=true], .cv-slot[aria-pressed=true]");
    const summary = select(".cv-selection-note");
    const slots = select(".cv-slot");
    if (selected.length) gsap.from(selected, { scale: .94, duration: .22, ease: "power2.out" });
    if (summary.length) gsap.from(summary, { clipPath: "inset(0 0 100% 0)", duration: .3, ease: "power2.out" });
    if (date && !slotId && slots.length) gsap.from(slots, { clipPath: "inset(0 100% 0 0)", stagger: .035, duration: .3, ease: "power2.out" });
  }, { scope: root, dependencies: [enabled, campusId, date, slotId, loading], revertOnUpdate: true });
  useGSAP(() => {
    if (!enabled || !busy) return;
    const bar = root.current?.querySelector(".cv-busy-bar");
    if (bar) gsap.fromTo(bar, { scaleX: .1, transformOrigin: "0% 50%" }, { scaleX: 1, duration: .65, repeat: -1, yoyo: true, ease: "power1.inOut" });
  }, { scope: root, dependencies: [enabled, busy], revertOnUpdate: true });
  useGSAP(() => {
    if (!enabled || !error) return;
    const alert = root.current?.querySelector(".cv-error");
    if (alert) gsap.from(alert, { clipPath: "inset(0 100% 0 0)", duration: .3 });
  }, { scope: root, dependencies: [enabled, error], revertOnUpdate: true });
  useGSAP((_context, contextSafe) => {
    if (!enabled || !contextSafe || !root.current) return;
    const form = root.current;
    const invalid = contextSafe((event: Event) => {
      if (event.target instanceof HTMLElement) gsap.fromTo(event.target, { borderColor: "#c74747" }, { borderColor: "#c9d3de", duration: .7, overwrite: "auto" });
    });
    form.addEventListener("invalid", invalid, true);
    return () => form.removeEventListener("invalid", invalid, true);
  }, { scope: root, dependencies: [enabled], revertOnUpdate: true });
}
