"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { community } from "./content";
import "./team-roll.css";

const number = (index: number) => String(index + 1).padStart(2, "0");
const headline = ["Great", "ideas", "need", "great", "teams."];

export function TeamRoll() {
  const section = useRef<HTMLElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const [selection, setSelection] = useState({ index: 0, previous: 0 });
  const { index, previous } = selection;

  function select(next: number) {
    setSelection(current => current.index === next ? current : { index: next, previous: current.index });
  }

  useLayoutEffect(() => {
    const root = section.current!;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    function configure() {
      media.revert();
      if (document.documentElement.matches("[data-quiet-motion], [data-large-text]")) return;
      media.add("(min-width: 1025px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)", () => {
        root.dataset.rolling = "";
        const update = (trigger: ScrollTrigger) => select(Math.round(trigger.progress * (community.length - 1)));
        ScrollTrigger.create({
          trigger: root, start: "top top", end: "bottom bottom",
          onUpdate: update, onRefresh: update,
        });
        gsap.from(root.querySelectorAll(".team-word > span"), {
          yPercent: (i: number) => i < 2 ? 110 : -110,
          stagger: { each: 0.07, from: "center" }, ease: "power2.out",
          scrollTrigger: { trigger: root, start: "top 90%", end: "top 12%", scrub: true },
        });
        return () => { delete root.dataset.rolling; };
      });
    }
    configure();
    window.addEventListener("srm-reading-change", configure);
    return () => {
      window.removeEventListener("srm-reading-change", configure);
      media.revert();
    };
  }, []);

  useLayoutEffect(() => {
    const el = list.current!;
    // With symmetric gutters, every snap point is one card stride apart.
    function followSwipe() {
      if (el.scrollWidth <= el.clientWidth) return;
      const stride = (el.children[1] as HTMLElement).offsetLeft - (el.children[0] as HTMLElement).offsetLeft;
      if (stride > 0) select(Math.min(community.length - 1, Math.max(0, Math.round(el.scrollLeft / stride))));
    }
    const observer = new ResizeObserver(followSwipe);
    observer.observe(el);
    el.addEventListener("scroll", followSwipe, { passive: true });
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", followSwipe);
    };
  }, []);

  function moveCard(step: number) {
    const el = list.current!;
    const card = el.children[index + step] as HTMLElement | undefined;
    if (card) el.scrollTo({ left: card.offsetLeft - (el.children[0] as HTMLElement).offsetLeft, behavior: "smooth" });
  }

  return (
    <section ref={section} className="team-roll" aria-labelledby="people-title">
      <div className="team-lead">
        <h2 id="people-title" aria-label={headline.join(" ")}>
          {headline.map((word, i) => (
            <span className="team-word" key={i}><span>{word}</span>{" "}</span>
          ))}
        </h2>
        <Link className="yellow-action s-button" href="/campus">
          Explore campus life <span className="s-arrow" aria-hidden="true" />
        </Link>
      </div>
      <ol id="home-teams" ref={list} className="team-list">
        {community.map((team, i) => (
          <li key={team.href} data-current={index === i || undefined}>
            <a href={team.href} onFocus={event => {
              if (section.current?.hasAttribute("data-rolling") && event.currentTarget.matches(":focus-visible")) {
                event.currentTarget.scrollIntoView({ block: "center", behavior: "instant" });
              }
            }}>
              <span className="team-thumb"><Image src={`/home/${team.image}.webp`} width={720} height={480} alt="" unoptimized /></span>
              <span className="team-number" aria-hidden="true">{number(i)}</span>
              <span className="team-name">{team.name}<small>{team.place}</small></span>
              <span className="team-link-arrow" aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ol>
      <div className="team-gallery" aria-hidden="true">
        <div className="team-print">
          {community.map((team, i) => (
            <Image key={team.image} src={`/home/${team.image}.webp`} width={800} height={600} alt="" unoptimized
              data-current={index === i || undefined} data-previous={previous === i || undefined} />
          ))}
        </div>
        <div className="team-caption"><span>{community[index].place}</span><span>{number(index)} / {number(community.length - 1)}</span></div>
      </div>
      <div className="team-controls">
        <span aria-live="polite">{number(index)} / {number(community.length - 1)}</span>
        <button type="button" aria-label="Previous team" aria-controls="home-teams" disabled={index === 0} onClick={() => moveCard(-1)}>←</button>
        <button type="button" aria-label="Next team" aria-controls="home-teams" disabled={index === community.length - 1} onClick={() => moveCard(1)}>→</button>
      </div>
    </section>
  );
}
