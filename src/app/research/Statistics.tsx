"use client";

import { useEffect, useRef } from "react";
import { statistics } from "./content";
import s from "./research.module.css";

function Statistic({ value, label }: { value: string; label: string }) {
  const number = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = number.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let played = false;
    const finish = () => { cancelAnimationFrame(frame); node.textContent = value; };
    const preference = () => {
      if (reduced.matches || document.documentElement.hasAttribute("data-quiet-motion")) { played = true; finish(); }
    };
    const digits = value.match(/[\d,]+/)![0];
    const target = Number(digits.replaceAll(",", ""));
    const format = (n: number) => value.replace(digits, new Intl.NumberFormat("en-IN").format(n));
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting) || played) return;
      played = true;
      observer.disconnect();
      if (reduced.matches || document.documentElement.hasAttribute("data-quiet-motion")) return finish();
      node.textContent = format(0);
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / 1800, 1);
        node.textContent = format(Math.round(target * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) frame = requestAnimationFrame(tick);
        else finish();
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: .5 });
    observer.observe(node);
    reduced.addEventListener("change", preference);
    window.addEventListener("srm-reading-change", preference);
    return () => { observer.disconnect(); finish(); reduced.removeEventListener("change", preference); window.removeEventListener("srm-reading-change", preference); };
  }, [value]);
  return <div><strong aria-label={value}><span ref={number} aria-hidden="true">{value}</span></strong><span>{label}</span></div>;
}

export function ResearchStatistics() {
  return <div className={s.stats}>{statistics.map(([value, label]) => <Statistic key={label} value={value} label={label} />)}</div>;
}
