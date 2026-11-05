"use client";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { spots } from "./data";

type Point = { x: number; y: number };
/** Each spot's position on the aerial illustration, in percent. */
const points: Record<string, Point> = {
  "university-building": { x: 15.6, y: 33 },
  lake: { x: 50, y: 95 },
  java: { x: 33, y: 41.5 },
  "tech-park": { x: 51.5, y: 19 },
  "vendhar-square": { x: 65.3, y: 38.5 },
  hostels: { x: 88.8, y: 46.5 },
};
const ZOOM = 2.1;

/** Translate (px) that centres a point at the given zoom without showing an edge. Transform-only, so it animates on the GPU. */
function view(frame: { w: number; h: number }, p: Point | null, z: number) {
  if (!p || !frame.w) return { x: 0, y: 0, z: 1 };
  const clamp = (v: number, size: number) => Math.min(0, Math.max(size - size * z, v));
  return {
    x: clamp(frame.w / 2 - (p.x / 100) * frame.w * z, frame.w),
    y: clamp(frame.h / 2 - (p.y / 100) * frame.h * z, frame.h),
    z,
  };
}

/** Aerial illustration of the campus with numbered spots, a tab row to move between them, and the open spot's story. */
export function CampusMap() {
  const [index, setIndex] = useState<number | null>(0);
  const [hover, setHover] = useState<number | null>(null);
  const [frame, setFrame] = useState({ w: 0, h: 0 });
  const frameRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const spot = index === null ? null : spots[index];
  const v = view(frame, spot ? points[spot.id] : null, ZOOM);

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setFrame({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(frameRef.current!);
    return () => ro.disconnect();
  }, []);

  // Keep the active tab visible in the row on narrow screens (scrolls the row only, not the page).
  useEffect(() => {
    const row = tabsRef.current;
    const tab = index === null ? null : row?.children[index];
    if (row && tab instanceof HTMLElement && row.scrollWidth > row.clientWidth)
      row.scrollTo({ left: tab.offsetLeft - (row.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
  }, [index]);

  const go = (i: number) => setIndex((i + spots.length) % spots.length);
  const step = (d: number) => go((index ?? (d > 0 ? -1 : 0)) + d);
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "Escape") setIndex(null);
    else return;
    e.preventDefault();
    if (e.target instanceof HTMLElement && e.target.getAttribute("role") === "tab") {
      requestAnimationFrame(() => tabsRef.current?.querySelector<HTMLElement>('[aria-selected="true"]')?.focus());
    }
  };

  return (
    <div className="al-map" onKeyDown={onKey}>
      <div className="al-map-frame" ref={frameRef}>
        <div
          className="al-map-canvas"
          style={{ transform: `translate3d(${v.x}px, ${v.y}px, 0) scale(${v.z})`, "--z": v.z } as CSSProperties}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- one large illustration, already WebP */}
          <img src="/alumni/campus-aerial.webp" alt="Aerial illustration of SRM's Kattankulathur campus beside the lake" />
          {spots.map((s, i) => (
            <button
              key={s.id}
              type="button"
              tabIndex={-1}
              className="al-map-pin"
              data-active={index === i || undefined}
              data-hover={hover === i || undefined}
              style={{ left: `${points[s.id].x}%`, top: `${points[s.id].y}%` }}
              aria-label={`${s.name}: ${s.line}`}
              onClick={() => setIndex(index === i ? null : i)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="al-map-controls">
          <button type="button" onClick={() => step(-1)} aria-label="Previous spot">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <button type="button" onClick={() => step(1)} aria-label="Next spot">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
          </button>
          {spot && (
            <button type="button" className="al-map-all" onClick={() => setIndex(null)}>
              Whole campus
            </button>
          )}
        </div>
      </div>

      <div className="al-map-tabs" ref={tabsRef} role="tablist" aria-label="Campus spots">
        {spots.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={index === i}
            aria-controls="al-map-story"
            tabIndex={index === i || (index === null && i === 0) ? 0 : -1}
            className="al-map-tab"
            onClick={() => setIndex(i)}
            onPointerEnter={() => setHover(i)}
            onPointerLeave={() => setHover(null)}
          >
            <span className="al-map-tab-num">{String(i + 1).padStart(2, "0")}</span>
            <span className="al-map-tab-name">{s.line}</span>
          </button>
        ))}
      </div>

      <div id="al-map-story" className="al-map-story" role="tabpanel" aria-live="polite">
        {spot ? (
          <div key={spot.id} className={"al-map-story-inner" + (spot.photo ? " has-photo" : "")}>
            <div>
              <p className="al-map-where">
                {spot.name} · {spot.where}
              </p>
              <h3>{spot.line}</h3>
              <p className="al-map-memory">{spot.memory}</p>
            </div>
            {spot.photo && (
              // eslint-disable-next-line @next/next/no-img-element -- small, already-optimised WebP
              <img src={spot.photo.src} alt={spot.photo.alt} />
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
