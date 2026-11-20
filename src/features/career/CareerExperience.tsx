"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const sections = [
  ["outcomes", "Placement figures"],
  ["recruiters", "Recruiters & offers"],
  ["support", "Training & contacts"],
] as const;

export function CareerNavigation() {
  const [active, setActive] = useState<string>("outcomes");
  const nav = useRef<HTMLElement>(null);

  useEffect(() => {
    // Follow the actual nav height, including the site's enlarged-text setting.
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = (nav.current?.getBoundingClientRect().bottom ?? 110) + 32;
      let current: string = sections[0][0];
      for (const [id] of sections) {
        if ((document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= line) current = id;
      }
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resize = new ResizeObserver(() => {
      if (nav.current) nav.current.closest<HTMLElement>(".career-page")?.style.setProperty("--cc-nav-height", `${nav.current.offsetHeight}px`);
      schedule();
    });
    if (nav.current) resize.observe(nav.current);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => { resize.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, []);

  return <nav className="cc-nav" aria-label="Career Centre sections" ref={nav}><div className="cc-container">
    {sections.map(([id, label], index) => <a key={id} href={`#${id}`} aria-current={active === id ? "location" : undefined} onClick={() => setActive(id)}><span className="cc-nav-index" aria-hidden="true">0{index + 1}</span>{label}<span className="cc-nav-arrow" aria-hidden="true">↓</span></a>)}
  </div></nav>;
}

export function CareerMotion() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = document.querySelector<HTMLElement>(".career-page");
    if (!root) return;
    const media = gsap.matchMedia();
    const configure = () => {
      media.revert();
      if (document.documentElement.hasAttribute("data-quiet-motion") || document.documentElement.hasAttribute("data-large-text")) return;
      // matchMedia creates a scoped GSAP context and reverts all tweens/triggers.
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        const hero = gsap.timeline({ defaults: { ease: "power3.out" } });
        hero.from(q(".cc-mask > span"), { yPercent: 110, rotate: 2, stagger: 0.1, duration: 0.9 })
          .from(q(".cc-image-window"), { clipPath: "inset(0 0 100% 0)", stagger: 0.14, duration: 1 }, 0.15)
          .from(q(".cc-intro > *, .cc-hero-label, .cc-image figcaption"), { opacity: 0, y: 12, stagger: 0.06, duration: 0.65 }, 0.45);
        q(".cc-image-window img").forEach((image: HTMLElement) => {
          gsap.fromTo(image, { yPercent: -3, scale: 1.07 }, { yPercent: 3, scale: 1.07, ease: "none", scrollTrigger: { trigger: image.parentElement, start: "top bottom", end: "bottom top", scrub: 0.6 } });
        });
        q("[data-cc-heading]").forEach((heading: HTMLElement) => {
          gsap.from(heading, { clipPath: "inset(0 0 100% 0)", y: 16, duration: 0.8, scrollTrigger: { trigger: heading, start: "top 92%", once: true } });
        });
        q(".cc-directory, .cc-contacts").forEach((group: HTMLElement) => {
          gsap.from(group.children, { x: -18, opacity: 0, stagger: 0.12, duration: 0.65, ease: "power2.out", scrollTrigger: { trigger: group, start: "top 90%", once: true } });
        });
        q("[data-cc-metric]").forEach((row: HTMLElement) => {
          gsap.from(row.children, { opacity: 0, y: 12, stagger: 0.08, duration: 0.65, scrollTrigger: { trigger: row, start: "top 93%", once: true } });
        });
        const counters = q("[data-cc-count]") as HTMLElement[];
        counters.forEach(element => {
          const final = element.dataset.ccFinal!;
          const counter = { value: 0 };
          gsap.to(counter, { value: Number(element.dataset.ccCount), duration: 1.35, ease: "power2.out", scrollTrigger: { trigger: element, start: "top 95%", once: true }, onUpdate: () => {
            element.textContent = Math.round(counter.value).toLocaleString("en-IN") + (final.endsWith("+") ? "+" : "");
          }, onComplete: () => { element.textContent = final; } });
        });
        gsap.from(q(".cc-training"), { clipPath: "inset(0 8% 0 0)", duration: 0.9, ease: "power2.out", scrollTrigger: { trigger: q(".cc-training")[0], start: "top 92%", once: true } });
        gsap.from(q(".ft-skyline img"), { opacity: 0.65, y: 18, duration: 1, scrollTrigger: { trigger: q(".ft-skyline")[0], start: "top 98%", once: true } });
        // Only decorative spans animate; assistive technology always gets the exact figure.
        return () => counters.forEach(element => { element.textContent = element.dataset.ccFinal!; });
      }, root);
    };
    configure();
    window.addEventListener("srm-reading-change", configure);
    let alive = true;
    document.fonts.ready.then(() => { if (alive) ScrollTrigger.refresh(); });
    return () => { alive = false; window.removeEventListener("srm-reading-change", configure); media.revert(); };
  }, []);
  return null;
}
