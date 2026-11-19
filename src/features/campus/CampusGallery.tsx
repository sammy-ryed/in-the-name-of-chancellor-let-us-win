"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const stories = [
  { image: "/home/stage.webp", alt: "A classical dancer performing on stage", category: "Arts & culture", title: "Find your stage.", caption: "Classical dance on the SRM stage", position: "50% 35%" },
  { image: "/home/athletics.webp", alt: "SRM women’s sports team holding rackets on court", category: "Sports & recreation", title: "Bring your game.", caption: "The women’s team, on court", position: "50% 45%" },
  { image: "/home/racing.webp", alt: "Team Camber Racing with its competition car", category: "Student-built projects", title: "Build it together.", caption: "Team Camber Racing", position: "50% 55%" },
];

export function CampusGallery() {
  const root = useRef<HTMLElement>(null);
  const navigate = useRef<(index: number) => void>(() => {});
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = root.current!;
    const track = section.querySelector<HTMLElement>(".cj-gallery-track")!;
    const frames = Array.from(section.querySelectorAll<HTMLElement>(".cj-gallery-slide"));
    const media = gsap.matchMedia();
    let observer: IntersectionObserver | undefined;
    let current = 0;
    const select = (index: number) => {
      if (index !== current) { current = index; setActive(index); }
    };
    const nativeNavigate = (index: number) => {
      select(index);
      frames[index].scrollIntoView({ block: "center", behavior: "auto" });
    };
    const configure = () => {
      media.revert();
      observer?.disconnect();
      const quiet = document.documentElement.hasAttribute("data-quiet-motion") || document.documentElement.hasAttribute("data-large-text");
      navigate.current = nativeNavigate;
      // The native stacked layout is the baseline: no JS, phones and reduced motion.
      observer = new IntersectionObserver(entries => {
        const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible && !section.classList.contains("cj-gallery-pinned")) select(frames.indexOf(visible.target as HTMLElement));
      }, { threshold: [0.4, 0.7] });
      frames.forEach(frame => observer!.observe(frame));
      if (quiet) return;
      media.add("(min-width: 1100px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)", () => {
        section.classList.add("cj-gallery-pinned");
        const animation = gsap.to(track, {
          x: () => -(track.scrollWidth - track.clientWidth), ease: "none",
          scrollTrigger: {
            id: "campus-story-gallery", trigger: section,
            start: () => `top ${getComputedStyle(document.documentElement).getPropertyValue("--header-height").trim()}`,
            end: () => `+=${section.clientWidth * 1.65}`,
            pin: true, scrub: 0.55, anticipatePin: 1, invalidateOnRefresh: true,
            onUpdate: self => select(Math.round(self.progress * (stories.length - 1))),
          },
        });
        gsap.fromTo(section.querySelector(".cj-gallery-progress span"), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: section, start: () => animation.scrollTrigger!.start, end: () => animation.scrollTrigger!.end, scrub: true, invalidateOnRefresh: true } });
        navigate.current = index => {
          const trigger = animation.scrollTrigger;
          if (!trigger) { nativeNavigate(index); return; }
          window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * index / (stories.length - 1) + 1, behavior: "smooth" });
        };
        return () => { section.classList.remove("cj-gallery-pinned"); navigate.current = nativeNavigate; };
      }, section);
    };
    configure();
    window.addEventListener("srm-reading-change", configure);
    return () => { window.removeEventListener("srm-reading-change", configure); observer?.disconnect(); media.revert(); };
  }, []);

  return <section ref={root} id="campus-stories" className="cj-gallery" aria-labelledby="cj-gallery-title">
    <div className="cj-gallery-heading"><div><p className="cl-kicker">02 / Beyond the classroom</p><h2 id="cj-gallery-title">Life in full colour.</h2></div><a href="#people" className="cj-gallery-skip">Find your people <span aria-hidden="true">↘</span></a></div>
    <div className="cj-gallery-viewport"><div className="cj-gallery-track">
      {stories.map((story, i) => <figure key={story.image} id={`campus-story-${i + 1}`} className="cj-gallery-slide" aria-label={`${i + 1} of ${stories.length}: ${story.category}`}>
        <Image src={story.image} alt={story.alt} fill sizes="(min-width: 1100px) 90vw, 100vw" style={{objectPosition:story.position}} />
        <span className="cj-gallery-category">{story.category}</span>
        <figcaption><strong>{story.title}</strong><span>{story.caption}</span></figcaption>
      </figure>)}
    </div></div>
    <div className="cj-gallery-controls"><p className="cj-small">Arts. Sport. Student ingenuity.</p><div className="cj-gallery-dots" aria-label="Choose a campus story">{stories.map((story, index) => <button key={story.image} type="button" aria-label={`View ${story.category}`} aria-pressed={active === index} onClick={() => navigate.current(index)}><span aria-hidden="true">0{index + 1}</span></button>)}</div><a href="#people" className="cj-gallery-skip">Continue to clubs <span aria-hidden="true">↓</span></a></div>
    <div className="cj-gallery-progress" aria-hidden="true"><span /></div>
  </section>;
}
