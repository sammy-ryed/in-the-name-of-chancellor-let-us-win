"use client";

import { useRef, useSyncExternalStore, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, CustomEase, DrawSVGPlugin);
CustomEase.create("campus-reveal", "0.22,0.68,0.16,1");

function subscribeMotion(update: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const observer = new MutationObserver(update);
  media.addEventListener("change", update);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-quiet-motion"] });
  return () => { media.removeEventListener("change", update); observer.disconnect(); };
}
function motionAllowed() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches && !document.documentElement.hasAttribute("data-quiet-motion");
}
export function useVisitMotionEnabled() {
  return useSyncExternalStore(subscribeMotion, motionAllowed, () => false);
}

// Static server content stays readable without JS. This scene never selects
// shared navigation or footer elements and owns all scroll choreography.
export function VisitScene({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const enabled = useVisitMotionEnabled();
  useGSAP((_context, contextSafe) => {
    if (!enabled || !root.current || !contextSafe) return;
    const page = root.current;
    const select = gsap.utils.selector(page);
    const splits: SplitText[] = [];
    const hero = page.querySelector<HTMLElement>(".cv-hero")!;
    const photo = hero.querySelector<HTMLImageElement>(".cv-hero-photo")!;
    const headline = hero.querySelector<HTMLElement>("h1")!;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    gsap.timeline({ defaults: { ease: "campus-reveal" } })
      .fromTo(photo, { scale: 1.17, clipPath: "inset(4% 3% 4% 3%)" }, { scale: 1.08, clipPath: "inset(0% 0% 0% 0%)", duration: 1.25 })
      .from(select(".cv-hero .cv-eyebrow"), { clipPath: "inset(0 100% 0 0)", duration: .55 }, .05)
      .from(select(".cv-hero-description"), { clipPath: "inset(0 0 100% 0)", duration: .65 }, .32)
      // The CTA remains visible and interactive throughout entrance.
      .from(select(".cv-hero-actions"), { y: 10, duration: .45 }, .15)
      .from(select(".cv-hero-caption"), { clipPath: "inset(0 100% 0 0)", duration: .6 }, .55);
    splits.push(SplitText.create(headline, {
      type: "lines", mask: "lines", linesClass: "cv-split-line", autoSplit: true,
      onSplit(self) {
        return gsap.from(self.lines, { yPercent: 106, rotation: .7, transformOrigin: "0% 100%", duration: .95, stagger: .1, ease: "campus-reveal" });
      },
    }));
    gsap.fromTo(photo, { yPercent: -2 }, { yPercent: 3, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: .7 } });

    page.querySelectorAll<HTMLElement>(".cv-section-heading h2, .cv-before h2, .cv-faq h2").forEach(heading => {
      splits.push(SplitText.create(heading, {
        type: "words", mask: "words", wordsClass: "cv-split-word", autoSplit: true,
        onSplit(self) {
          return gsap.from(self.words, { yPercent: 105, duration: .7, stagger: .045, ease: "campus-reveal", scrollTrigger: { trigger: heading, start: "top 90%", once: true } });
        },
      }));
    });
    page.querySelectorAll<HTMLElement>(".cv-experience-grid > div").forEach((card, index) => {
      gsap.timeline({ defaults: { ease: "campus-reveal" }, scrollTrigger: { trigger: card, start: "top 90%", once: true } })
        .from(card.querySelector("figure"), { clipPath: `inset(${index % 2 ? "0 0 100% 0" : "100% 0 0 0"})`, duration: .9 })
        .from(card.querySelector("img"), { scale: 1.12, duration: 1.1 }, 0)
        .from(card.querySelectorAll("h3, p"), { clipPath: "inset(0 100% 0 0)", duration: .55, stagger: .08 }, .3);
    });
    const route = page.querySelector<HTMLElement>(".cv-timeline")!;
    gsap.from(select(".cv-route-progress"), { drawSVG: "0%", ease: "none", scrollTrigger: { trigger: route, start: "top 70%", end: "bottom 70%", scrub: .4 } });
    route.querySelectorAll<HTMLElement>("li").forEach(row => {
      gsap.from(row.querySelector("div"), { x: 20, clipPath: "inset(0 0 0 12%)", duration: .65, ease: "campus-reveal", scrollTrigger: { trigger: row, start: "top 85%", once: true } });
      gsap.to(row.querySelector(".cv-timeline-index"), { backgroundColor: "#f7d987", color: "#0b2d52", duration: .3, scrollTrigger: { trigger: row, start: "top 70%", toggleActions: "play none none reverse" } });
    });
    if (finePointer) gsap.fromTo(page.querySelector(".cv-itinerary-photo img"), { scale: 1.12, yPercent: -3 }, { yPercent: 3, ease: "none", scrollTrigger: { trigger: route, start: "top bottom", end: "bottom top", scrub: .8 } });
    gsap.from(select(".cv-arrival-list > div"), { clipPath: "inset(0 100% 0 0)", duration: .65, stagger: .12, ease: "campus-reveal", scrollTrigger: { trigger: select(".cv-arrival-list")[0], start: "top 85%", once: true } });

    const removers: (() => void)[] = [];
    if (finePointer) page.querySelectorAll<HTMLElement>(".cv-hero-actions .cv-button, .cv-before .cv-button").forEach(button => {
      const x = gsap.quickTo(button, "x", { duration: .25, ease: "power2.out" });
      const y = gsap.quickTo(button, "y", { duration: .25, ease: "power2.out" });
      const move = (event: PointerEvent) => {
        if (button.matches(":focus-visible")) return;
        const rect = button.getBoundingClientRect();
        x(((event.clientX - rect.left) / rect.width - .5) * 8);
        y(((event.clientY - rect.top) / rect.height - .5) * 8);
      };
      const reset = () => { x(0); y(0); };
      button.addEventListener("pointermove", move); button.addEventListener("pointerleave", reset); button.addEventListener("focus", reset);
      removers.push(() => { button.removeEventListener("pointermove", move); button.removeEventListener("pointerleave", reset); button.removeEventListener("focus", reset); });
    });
    const refresh = contextSafe(() => ScrollTrigger.refresh());
    const resize = new ResizeObserver(refresh);
    const booking = page.querySelector(".cv-booking");
    if (booking) resize.observe(booking);
    const images = Array.from(page.querySelectorAll("img"));
    images.forEach(image => image.addEventListener("load", refresh));
    let active = true;
    document.fonts.ready.then(() => { if (active) refresh(); });
    return () => {
      active = false; resize.disconnect(); removers.forEach(remove => remove());
      images.forEach(image => image.removeEventListener("load", refresh));
      splits.forEach(split => split.revert());
    };
  }, { scope: root, dependencies: [enabled], revertOnUpdate: true });
  return <div ref={root} className="cv-page cv-visit">{children}</div>;
}

export function VisitReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`cv-reveal ${className}`}>{children}</div>;
}
