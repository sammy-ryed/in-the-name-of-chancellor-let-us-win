"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { LabSlide } from "./labs";
import styles from "./labs.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * A large, swipeable image strip. Native scroll with snap points does the work (touch, trackpad, arrow keys);
 * the buttons and counter just follow it. The next image peeks in so it's obvious there's more.
 */
export function LabGallery({ slides, label }: { slides: LabSlide[]; label: string }) {
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const count = slides.length;

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const first = el.firstElementChild as HTMLElement | null;
        if (!first) return;
        const step = first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0");
        setIndex(Math.min(count - 1, Math.max(0, Math.round(el.scrollLeft / step))));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => { el.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, [count]);

  function go(to: number) {
    const el = track.current;
    const target = el?.children[Math.min(count - 1, Math.max(0, to))] as HTMLElement | undefined;
    if (!el || !target) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: target.offsetLeft - el.offsetLeft, behavior: reduced ? "auto" : "smooth" });
  }

  return (
    <div className={styles.gallery}>
      <ul ref={track} className={styles.track} tabIndex={0} aria-label={`${label} photos`} data-single={count === 1 || undefined}>
        {slides.map((s, i) => (
          <li key={s.src} className={styles.slide} data-fit={s.fit ?? "cover"} aria-label={`${i + 1} of ${count}: ${s.caption}`}>
            <Image src={s.src} alt={s.alt} fill unoptimized sizes="(max-width: 900px) 90vw, 50vw" loading={i < 2 ? "eager" : "lazy"} />
            <span className={styles.caption}>{s.caption}</span>
          </li>
        ))}
      </ul>
      {count > 1 && (
        <div className={styles.controls}>
          <span className={styles.counter} aria-hidden="true"><b>{pad(index + 1)}</b> / {pad(count)}</span>
          <span className={styles.progress} aria-hidden="true">
            <span style={{ transform: `scaleX(${(index + 1) / count})` }} />
          </span>
          <button type="button" className={styles.arrow} onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous photo">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <button type="button" className={styles.arrow} onClick={() => go(index + 1)} disabled={index === count - 1} aria-label="Next photo">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}
