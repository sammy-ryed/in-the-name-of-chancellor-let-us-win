"use client";

import { animate, MotionConfig, motion, useInView, useMotionValue, useSpring } from "motion/react";
import { createContext, useContext, useEffect, useRef, useSyncExternalStore, type ComponentProps, type ReactNode } from "react";
import s from "../career.module.css";

const MotionPreference = createContext(true);
function subscribe(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  window.addEventListener("srm-reading-change", callback);
  return () => { query.removeEventListener("change", callback); window.removeEventListener("srm-reading-change", callback); };
}
function snapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.hasAttribute("data-quiet-motion") || document.documentElement.hasAttribute("data-large-text");
}

export function CareerExperience({ children }: { children: ReactNode }) {
  const reduced = useSyncExternalStore(subscribe, snapshot, () => true);
  return <MotionPreference.Provider value={reduced}><MotionConfig reducedMotion={reduced ? "always" : "user"}>
    <div className={s.page} id="career-top" onClick={event => {
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      const id = link.getAttribute("href")?.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target || !event.currentTarget.contains(target)) return;
      event.preventDefault();
      window.history.pushState(null, "", `#${id}`);
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      target.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" });
    }}>{children}</div>
  </MotionConfig></MotionPreference.Provider>;
}

export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -35px 0px" });
  const played = useRef(false);
  const reduced = useContext(MotionPreference);
  useEffect(() => {
    if (reduced || !inView || !ref.current || played.current) return;
    played.current = true;
    const node = ref.current;
    const control = animate(node, { opacity: [0.25, 1], y: [24, 0] }, { duration: 0.65, ease: [0.22, 1, 0.36, 1] });
    return () => { control.stop(); node.style.opacity = "1"; node.style.transform = "none"; };
  }, [inView, reduced]);
  return <div ref={ref} className={className}>{children}</div>;
}

export function MagneticLink({ children, ...props }: ComponentProps<typeof motion.a>) {
  const reduced = useContext(MotionPreference);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 250, damping: 22 });
  const y = useSpring(my, { stiffness: 250, damping: 22 });
  return <motion.a {...props} style={reduced ? undefined : { x, y }} onPointerMove={event => {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    mx.set((event.clientX - rect.left - rect.width / 2) * 0.09);
    my.set((event.clientY - rect.top - rect.height / 2) * 0.09);
  }} onPointerLeave={() => { mx.set(0); my.set(0); }}>{children}</motion.a>;
}

/** Adapted from React Bits CountUp (David Haz). See ../REACT-BITS-LICENSE.md.
 * Keeps the view-triggered Motion counting pattern, with static accessible text,
 * no layout shifts and a readable server-rendered value before hydration.
 */
export function CountUp({ value, suffix = "", decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useContext(MotionPreference);
  const format = (number: number) => new Intl.NumberFormat("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(number) + suffix;
  const finalValue = format(value);
  useEffect(() => {
    const node = ref.current;
    if (!node || !inView || reduced) return;
    const formatter = new Intl.NumberFormat("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    const animation = animate(0, value, {
      duration: 2, ease: [0.33, 1, 0.68, 1],
      onUpdate: latest => { node.textContent = formatter.format(decimals ? latest : Math.round(latest)) + suffix; },
      onComplete: () => { node.textContent = finalValue; },
    });
    return () => { animation.stop(); node.textContent = finalValue; };
  }, [value, suffix, decimals, inView, reduced, finalValue]);
  return <span className={s.counter}><span className={s.counterSizer} aria-hidden="true">{finalValue}</span><span ref={ref} className={s.counterAnimated} aria-hidden="true">{finalValue}</span><span className="cc:sr-only">{finalValue}</span></span>;
}

export function useCareerReducedMotion() { return useContext(MotionPreference); }
