"use client";
import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
export function StudentMotion() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = document.querySelector<HTMLElement>(".students-page");
    if (!root) return;
    const media = gsap.matchMedia();
    const configure = () => {
      media.revert();
      if (document.documentElement.hasAttribute("data-quiet-motion") ||
          document.documentElement.hasAttribute("data-large-text")) return;
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        q("[data-lines]").forEach((heading: HTMLElement) => {
          gsap.from(heading.children, { yPercent: 90, opacity: 0, stagger: 0.1, duration: 0.85, ease: "power3.out", scrollTrigger: { trigger: heading, start: "top 92%", once: true } });
        });
        q("[data-reveal]").forEach((element: HTMLElement) => {
          gsap.from(element, { y: 32, opacity: 0, duration: 0.7, ease: "power2.out", scrollTrigger: { trigger: element, start: "top 96%", once: true } });
        });
        q("[data-image-reveal]").forEach((element: HTMLElement) => {
          gsap.from(element, { clipPath: "inset(12% 8% 12% 8%)", ease: "none", scrollTrigger: { trigger: element, start: "top bottom", end: "top 30%", scrub: 0.6 } });
        });
        q("[data-parallax] img").forEach((image: HTMLElement) => {
          gsap.fromTo(image, { yPercent: -5, scale: 1.12 }, { yPercent: 5, scale: 1.04, ease: "none", scrollTrigger: { trigger: image.parentElement, start: "top bottom", end: "bottom top", scrub: 0.6 } });
        });
        gsap.fromTo(q(".st-score-word"), { xPercent: -6 }, { xPercent: 3, ease: "none", scrollTrigger: { trigger: q(".st-score-art")[0], start: "top bottom", end: "bottom top", scrub: 0.7 } });
      }, root);
      media.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const cleanups = Array.from(root.querySelectorAll<HTMLElement>(".st-network-card")).map(card => {
          const arrow = card.querySelector(".st-network-top > span");
          const x = gsap.quickTo(arrow, "x", { duration: 0.35 });
          const y = gsap.quickTo(arrow, "y", { duration: 0.35 });
          const move = (event: PointerEvent) => { const box = card.getBoundingClientRect(); x((event.clientX - box.left - box.width / 2) * 0.08); y((event.clientY - box.top - box.height / 2) * 0.06); };
          const leave = () => { x(0); y(0); };
          card.addEventListener("pointermove", move); card.addEventListener("pointerleave", leave);
          return () => { card.removeEventListener("pointermove", move); card.removeEventListener("pointerleave", leave); };
        });
        return () => cleanups.forEach(cleanup => cleanup());
      }, root);
    };
    configure();
    window.addEventListener("srm-reading-change", configure);
    let active = true;
    document.fonts.ready.then(() => { if (active) ScrollTrigger.refresh(); });
    return () => { active = false; window.removeEventListener("srm-reading-change", configure); media.revert(); };
  }, []);
  return null;
}
