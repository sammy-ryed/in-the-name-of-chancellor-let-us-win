"use client";
import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function Choreography() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const home = document.querySelector<HTMLElement>(".s-home")!;
    const media = gsap.matchMedia(),
      q = gsap.utils.selector(home);
    const configure = () => {
      media.revert();
      if (
        document.documentElement.hasAttribute("data-quiet-motion") ||
        document.documentElement.hasAttribute("data-large-text")
      )
        return;
      media.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          home.classList.add("s-moving");
          const stage = q(".s-stage")[0] as HTMLElement,
            hero = q(".s-hero")[0] as HTMLElement,
            acad = q(".s-academics")[0] as HTMLElement;
          const opening = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: q(".s-opening")[0],
              start: () => "top " + getComputedStyle(stage).top,
              end: "bottom bottom",
              scrub: 0.48,
              invalidateOnRefresh: true,
            },
            onUpdate() {
              const t = opening.progress();
              if (hero.inert !== t > 0.81) hero.inert = t > 0.81;
              if (acad.inert !== t < 0.76) acad.inert = t < 0.76;
            },
          });
          acad.inert = true;
          opening
            .to(
              stage,
              {
                "--lt": "-10%",
                "--lk": "-15%",
                "--lb": "-4%",
                "--rt": "104%",
                "--rb": "114%",
                "--mt": "-4%",
                "--mr": "-2%",
                "--mb": "104%",
                "--mk": "106%",
                "--ml": "104%",
                duration: 0.3,
              },
              0,
            )
            .to(q(".s-headline"), { y: "-56vh", duration: 0.31 }, 0.015)
            .to(
              q(".s-opening-note"),
              { y: "23vh", opacity: 0, duration: 0.2 },
              0,
            )
            .to(
              q(".s-hero-arrow"),
              { x: "24vw", opacity: 0, duration: 0.23 },
              0,
            )
            .to(stage, { "--entry": "-45%", duration: 0.32 }, 0.43)
            .fromTo(
              q(".s-acad-interior"),
              { x: "76vw" },
              { x: 0, duration: 0.34 },
              0.43,
            )
            .fromTo(
              q(".s-disciplines"),
              { x: "12vw" },
              { x: "-7vw", duration: 0.3 },
              0.53,
            )
            .to(
              q(".s-acad-interior"),
              { scale: 0.91, opacity: 0.18, y: "-6vh", duration: 0.1 },
              0.9,
            );
          gsap.fromTo(
            q(".s-map-img"),
            { scale: 1.18, yPercent: 6, rotate: -2 },
            {
              scale: 1,
              yPercent: 0,
              rotate: 0,
              ease: "none",
              scrollTrigger: {
                trigger: q(".s-place")[0],
                start: "top bottom",
                end: "bottom bottom",
                scrub: 0.65,
              },
            },
          );
          gsap.from(q(".s-place-intro, .s-place-details"), {
            yPercent: 20,
            opacity: 0.45,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: {
              trigger: q(".s-place")[0],
              start: "top 85%",
              end: "top top",
              scrub: 0.43,
            },
          });
          const roster = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: q(".s-people")[0],
              start: "top bottom",
              end: "bottom bottom",
              scrub: 0.5,
            },
          });
          roster
            .fromTo(
              q(".s-people-frame"),
              {
                clipPath:
                  "polygon(0 28%, 42% 10%, 100% 18%, 100% 76%, 32% 100%, 0 90%)",
              },
              {
                clipPath:
                  "polygon(0 0%, 42% 0%, 100% 0%, 100% 100%, 32% 100%, 0 100%)",
                duration: 0.3,
              },
              0,
            )
            .from(
              q(".s-people-title b"),
              { yPercent: 110, stagger: 0.025, duration: 0.22 },
              0.08,
            )
            .fromTo(
              q(".s-roster"),
              { y: "100svh" },
              { y: "0svh", duration: 0.34 },
              0.34,
            )
            // Hold the list under the headline (it used to slide up across the stacked title).
            .to(q(".s-roster"), { y: "0svh", duration: 0.3 }, 0.7);
          gsap.from(q(".s-news-title span"), {
            xPercent: 21,
            ease: "none",
            scrollTrigger: {
              trigger: q(".s-news")[0],
              start: "top bottom",
              end: "top 5%",
              scrub: 0.5,
            },
          });
          return () => {
            home.classList.remove("s-moving");
            hero.inert = false;
            acad.inert = false;
          };
        },
        home,
      );
    };
    configure();
    window.addEventListener("srm-reading-change", configure);
    let live = true;
    document.fonts.ready.then(() => {
      if (live) ScrollTrigger.refresh();
    });
    return () => {
      live = false;
      window.removeEventListener("srm-reading-change", configure);
      media.revert();
    };
  }, []);
  return null;
}
