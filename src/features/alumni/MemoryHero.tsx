"use client";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroPhotos } from "./data";

/**
 * Scroll-driven hero: the centre photo starts full-screen and the grid zooms out around it,
 * with the white headline over the photos. Static grid when motion is reduced.
 */
export function MemoryHero() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const media = gsap.matchMedia();
    const html = document.documentElement;
    const quiet = () => html.hasAttribute("data-quiet-motion");

    const build = () => {
      media.revert();
      el.toggleAttribute("data-static", quiet());
      if (quiet()) return;
      media.add("(prefers-reduced-motion: no-preference)", () => {
        el.setAttribute("data-animated", "");
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.6 },
        });
        tl.fromTo(q(".al-hero-grid"), { scale: 3.15 }, { scale: 1, duration: 1 }, 0)
          .fromTo(
            q(".al-hero-tile:not(.is-centre)"),
            { opacity: 0, scale: 0.82 },
            { opacity: 1, scale: 1, duration: 0.55, stagger: { each: 0.035, from: "center" } },
            0.2,
          )
          .fromTo(
            q(".al-hero-tile img"),
            { filter: "grayscale(0.3) sepia(0.2) brightness(0.6)" },
            { filter: "grayscale(1) sepia(0.25) brightness(0.55)", duration: 0.7 },
            0.15,
          )
          .fromTo(q(".al-hero-title"), { scale: 1.25 }, { scale: 0.92, duration: 1 }, 0)
          .fromTo(q(".al-hero-after, .al-hero-kicker"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.25 }, 0.75);
        return () => el.removeAttribute("data-animated");
      });
    };

    build();
    window.addEventListener("srm-reading-change", build);
    return () => {
      window.removeEventListener("srm-reading-change", build);
      media.revert();
    };
  }, []);

  return (
    <header ref={root} className="al-hero" aria-labelledby="al-hero-title">
      <div className="al-hero-stage">
        <div className="al-hero-grid">
          {heroPhotos.map((p, i) => (
            <figure key={p.src} className={"al-hero-tile" + (i === 4 ? " is-centre" : "")}>
              {/* eslint-disable-next-line @next/next/no-img-element -- scaled by the scroll timeline */}
              <img src={p.src} alt={p.alt} loading={i === 4 ? "eager" : "lazy"} decoding="async" />
            </figure>
          ))}
        </div>
        <h1 id="al-hero-title" className="al-hero-title">
          <span>Some places</span>
          <span>stay with you.</span>
        </h1>
        <p className="al-eyebrow al-hero-kicker">SRMIST Alumni</p>
        <div className="al-hero-after">
          <a className="al-scroll" href="#memories">
            Take a walk back <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </header>
  );
}
