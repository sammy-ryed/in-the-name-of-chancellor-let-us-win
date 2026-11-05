"use client";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { alumniLinks, memories } from "./data";

const FIRST = 10;

/** Deterministic "random" so each photo keeps the same entrance on every visit. */
function seeded(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}
const range = (i: number, salt: number, min: number, max: number) => min + seeded(i, salt) * (max - min);

/**
 * A 3D grid of reunion photos. Each photo rotates, travels and fades into place as it scrolls in,
 * with its own angles and timing. The first ten show by default; "See more" adds the rest.
 */
export function MemoryReveal() {
  const root = useRef<HTMLDivElement>(null);
  const [all, setAll] = useState(false);
  const shown = all ? memories : memories.slice(0, FIRST);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = root.current!;
    const media = gsap.matchMedia();
    const build = () => {
      media.revert();
      if (document.documentElement.hasAttribute("data-quiet-motion")) return;
      media.add("(prefers-reduced-motion: no-preference)", () => {
        el.querySelectorAll<HTMLElement>(".al-reveal-tile").forEach((tile, i) => {
          gsap.fromTo(
            tile,
            {
              opacity: 0,
              rotateX: range(i, 1, -55, 55),
              rotateY: range(i, 2, -40, 40),
              rotateZ: range(i, 3, -12, 12),
              x: range(i, 4, -160, 160),
              y: range(i, 5, 120, 320),
              z: range(i, 6, -900, -300),
            },
            {
              opacity: 1,
              rotateX: 0,
              rotateY: 0,
              rotateZ: 0,
              x: 0,
              y: 0,
              z: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: tile,
                start: `top ${Math.round(range(i, 7, 100, 115))}%`,
                end: `top ${Math.round(range(i, 8, 45, 62))}%`,
                scrub: range(i, 9, 0.4, 1.1),
              },
            },
          );
        });
      });
    };
    build();
    window.addEventListener("srm-reading-change", build);
    return () => {
      window.removeEventListener("srm-reading-change", build);
      media.revert();
    };
  }, [all]);

  return (
    <div ref={root} className="al-reveal-gallery">
      <ul className="al-reveal-grid">
        {shown.map((m, i) => (
          <li key={m.src} className={"al-reveal-tile" + (i % 5 === 0 ? " is-wide" : "")}>
            {/* eslint-disable-next-line @next/next/no-img-element -- transformed in 3D by the scroll timeline */}
            <img src={m.src} alt={m.alt} loading="lazy" decoding="async" />
          </li>
        ))}
      </ul>

      <div className="al-see-more">
        <div className="al-see-more-actions">
          {!all && (
            <button type="button" className="al-btn al-btn-gold" onClick={() => setAll(true)}>
              See more
            </button>
          )}
          <a className="al-btn al-btn-ivory" href={alumniLinks.albums} rel="noopener noreferrer" target="_blank">
            Browse every alumni album
          </a>
        </div>
      </div>
    </div>
  );
}
