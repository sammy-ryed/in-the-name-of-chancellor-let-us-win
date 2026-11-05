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
            .to(q(".s-hero-copy"), { y: "-12vh", opacity: 0, duration: 0.22 }, 0)
            .to(
              q(".s-hero-brand"),
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
            .to(
              q(".s-acad-interior"),
              { scale: 0.91, opacity: 0.18, y: "-6vh", duration: 0.1 },
              0.9,
            );
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
