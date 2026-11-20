"use client";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { heroSlides } from "./showcase";
import styles from "./showcase.module.css";

const interval = 5000;
const motionQuery = "(prefers-reduced-motion: reduce)";
const quiet = () => matchMedia(motionQuery).matches || document.documentElement.hasAttribute("data-quiet-motion");
const subscribe = (notify: () => void) => {
  const media = matchMedia(motionQuery);
  media.addEventListener("change", notify);
  window.addEventListener("srm-reading-change", notify);
  return () => { media.removeEventListener("change", notify); window.removeEventListener("srm-reading-change", notify); };
};

/**
 * A fanned stack of DEI event photos. The front card moves to the back every five seconds.
 * It holds while hovered or focused, off screen or in a hidden tab, and does not auto-advance with reduced motion.
 */
export function HeroDeck() {
  const [front, setFront] = useState(0);
  const [held, setHeld] = useState(false);
  const [visible, setVisible] = useState(true);
  const reduced = useSyncExternalStore(subscribe, quiet, () => true);
  const root = useRef<HTMLDivElement>(null);
  const count = heroSlides.length;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const running = !reduced && !held && visible;
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setFront(f => (f + 1) % count);
    }, interval);
    return () => window.clearInterval(timer);
  }, [running, count]);

  return (
    <div ref={root} className={styles.deck} role="group" aria-roledescription="carousel" aria-label="Life at DEI"
      onPointerEnter={() => setHeld(true)} onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)} onBlur={() => setHeld(false)}>
      <ul id="dei-deck" className={styles.deckCards}>
        {heroSlides.map((slide, i) => {
          const depth = (i - front + count) % count;
          return (
            <li key={slide.src} className={styles.deckCard} data-depth={Math.min(depth, 3)} aria-hidden={depth !== 0}>
              <div className={styles.deckPhoto}>
                <Image src={slide.src} alt={slide.alt} fill unoptimized preload={i === 0} sizes="(max-width: 760px) 90vw, 42vw" />
              </div>
              {depth === 0 && running && <span className={styles.deckTimer} aria-hidden="true" key={front} />}
            </li>
          );
        })}
      </ul>
      <div className={styles.deckDots}>
        {heroSlides.map((slide, i) => (
          <button key={slide.src} type="button" aria-label={`Photo ${i + 1} of ${count}`} aria-current={i === front || undefined}
            aria-controls="dei-deck" onClick={() => setFront(i)} />
        ))}
      </div>
    </div>
  );
}
