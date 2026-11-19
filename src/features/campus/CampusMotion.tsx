"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function CampusMotion() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = document.querySelector<HTMLElement>(".cl-cinematic");
    if (!root) return;
    const media = gsap.matchMedia();
    const configure = () => {
      media.revert();
      if (document.documentElement.hasAttribute("data-quiet-motion") || document.documentElement.hasAttribute("data-large-text")) return;
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        const hero = gsap.timeline({ defaults: { ease: "power3.out" } });
        hero.from(q(".cl-hero > img"), { opacity: 0.35, clipPath: "inset(2% 1% 2% 1%)", duration: 1.3 })
          .from(q(".cj-line > span"), { yPercent: 115, rotate: 1, stagger: 0.12, duration: 1.05 }, 0.1)
          .from(q(".cj-hero-top, .cl-hero-text > p, .cj-scroll"), { opacity: 0, y: 12, stagger: 0.08, duration: 0.7 }, 0.55);
        gsap.to(q(".cj-scroll > span:last-child"), { y: 5, repeat: 3, yoyo: true, duration: 0.75, ease: "sine.inOut", delay: 1.3 });
        gsap.fromTo(q(".cj-hero-progress"), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: q(".cl-hero")[0], start: "top top", end: "bottom top", scrub: true } });
        q("[data-campus-title]").forEach((heading: HTMLElement) => {
          gsap.from(heading, { clipPath: "inset(0 0 100% 0)", y: 18, duration: 0.85, ease: "power3.out", scrollTrigger: { trigger: heading, start: "top 94%", once: true } });
        });
        q(".cl-stats, .cl-timeline, .cl-support ul, .cl-home-cards").forEach((group: HTMLElement) => {
          gsap.from(group.children, { y: 18, opacity: 0, stagger: 0.08, duration: 0.65, scrollTrigger: { trigger: group, start: "top 92%", once: true } });
        });
        q(".cl-home-photo, .cl-explore-photo").forEach((frame: HTMLElement) => {
          gsap.from(frame, { clipPath: "inset(7% 4% 7% 4%)", ease: "none", scrollTrigger: { trigger: frame, start: "top 95%", end: "top 35%", scrub: 0.5 } });
        });
        gsap.from(q(".ft-skyline img"), { y: 20, opacity: 0.6, duration: 1, scrollTrigger: { trigger: q(".ft-skyline")[0], start: "top 96%", once: true } });
      }, root);
      media.add("(min-width: 1100px) and (prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        q(".cl-hero > img, .cl-home-photo img").forEach((image: HTMLElement) => {
          gsap.fromTo(image, { yPercent: -4, scale: 1.09 }, { yPercent: 4, scale: 1.09, ease: "none", scrollTrigger: { trigger: image.parentElement, start: "top bottom", end: "bottom top", scrub: 0.6 } });
        });
        gsap.from(q(".cj-festivals"), { y: 42, ease: "none", scrollTrigger: { trigger: q(".cl-life")[0], start: "top bottom", end: "bottom 50%", scrub: 0.6 } });
      }, root);
    };
    configure();
    window.addEventListener("srm-reading-change", configure);
    // Refresh once fonts and lazy images settle, with a guard for route teardown.
    let alive = true;
    let refreshFrame = 0;
    const refresh = () => { cancelAnimationFrame(refreshFrame); refreshFrame = requestAnimationFrame(() => { if (alive) ScrollTrigger.refresh(); }); };
    const images = Array.from(root.querySelectorAll("img")).filter(image => !image.complete);
    images.forEach(image => image.addEventListener("load", refresh));
    document.fonts.ready.then(refresh);
    return () => { alive = false; cancelAnimationFrame(refreshFrame); images.forEach(image => image.removeEventListener("load", refresh)); window.removeEventListener("srm-reading-change", configure); media.revert(); };
  }, []);
  return null;
}
