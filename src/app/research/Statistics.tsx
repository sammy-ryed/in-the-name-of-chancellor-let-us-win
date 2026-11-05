"use client";

import { useEffect, useRef } from "react";
import { statistics } from "./content";
import s from "./research.module.css";

const formatter = new Intl.NumberFormat("en-IN");

export function ResearchStatistics() {
  const list = useRef<HTMLDListElement>(null);

  useEffect(() => {
    const nodes = list.current?.querySelectorAll<HTMLElement>("[data-count]");
    if (!nodes || !("IntersectionObserver" in window)) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const quiet = () => preference.matches || document.documentElement.hasAttribute("data-quiet-motion");
    if (quiet()) return;

    const counts = Array.from(nodes, node => {
      const final = node.textContent ?? "";
      const digits = final.match(/[\d,]+/)?.[0] ?? "";
      const target = Number(digits.replaceAll(",", ""));
      return { node, final, target, format: (value: number) => final.replace(digits, formatter.format(value)) };
    });
    const byNode = new Map(counts.map(count => [count.node, count]));
    const frames = new Set<number>();

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        const count = byNode.get(entry.target as HTMLElement);
        if (!count) continue;
        let start: number | undefined;
        let frame: number;
        const tick = (now: number) => {
          frames.delete(frame);
          start ??= now;
          const progress = Math.min((now - start) / 1450, 1);
          const value = Math.floor(count.target * (1 - (1 - progress) ** 2));
          count.node.textContent = progress === 1 ? count.final : count.format(value);
          if (progress < 1) {
            frame = requestAnimationFrame(tick);
            frames.add(frame);
          }
        };
        frame = requestAnimationFrame(tick);
        frames.add(frame);
      }
    }, { threshold: 0.65 });

    const finish = () => {
      observer.disconnect();
      frames.forEach(cancelAnimationFrame);
      frames.clear();
      counts.forEach(count => { count.node.textContent = count.final; });
    };
    const updatePreference = () => { if (quiet()) finish(); };
    counts.forEach(count => {
      count.node.textContent = count.format(0);
      observer.observe(count.node);
    });
    preference.addEventListener("change", updatePreference);
    window.addEventListener("srm-reading-change", updatePreference);
    return () => {
      finish();
      preference.removeEventListener("change", updatePreference);
      window.removeEventListener("srm-reading-change", updatePreference);
    };
  }, []);

  return (
    <dl ref={list} className={s.stats}>
      {statistics.map(([value, label]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd><span aria-hidden="true" data-count="">{value}</span><span className={s.srOnly}>{value}</span></dd>
        </div>
      ))}
    </dl>
  );
}
