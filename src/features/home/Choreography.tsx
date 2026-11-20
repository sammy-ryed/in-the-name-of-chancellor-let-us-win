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
        { narrow: "(max-width: 1024px)", motion: "(prefers-reduced-motion: no-preference)" },
        ({ conditions }) => {
          if (!conditions?.motion) return;
          const narrow = conditions.narrow;
          home.classList.add("s-moving");
          const stage = q(".s-stage")[0] as HTMLElement,
            hero = q(".s-hero")[0] as HTMLElement,
            intro = q(".s-hero-copy")[0] as HTMLElement,
            pinnedGuides = narrow ? null : q(".s-academics")[0] as HTMLElement;
          const opening = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: q(".s-opening")[0],
              start: () => "top " + getComputedStyle(narrow ? hero : stage).top,
              endTrigger: narrow ? q(".s-film-chapter")[0] : q(".s-opening")[0],
              end: "bottom bottom",
              scrub: 0.48,
              invalidateOnRefresh: true,
            },
            onUpdate() {
              const t = opening.time();
              if (intro.inert !== (t >= .22)) intro.inert = t >= .22;
              const filmCovered = !narrow && t > 0.81;
              if (hero.inert !== filmCovered) hero.inert = filmCovered;
            },
          });
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
            .to(intro, { y: "-12vh", opacity: 0, duration: 0.22 }, 0)
            .to(
              q(".s-hero-brand"),
              { x: "24vw", opacity: 0, duration: 0.23 },
              0,
            );
          if (pinnedGuides) {
            const interior = q(".s-acad-interior");
            opening
              .addLabel("film", 0.35)
              .addLabel("guides", 0.83)
              .to(stage, { "--entry": "-45%", duration: 0.32 }, 0.43)
              .fromTo(interior, { x: "76vw" }, { x: 0, duration: 0.34 }, 0.43)
              .to(interior, { scale: 0.91, opacity: 0.18, y: "-6vh", duration: 0.1 }, 0.9);
          }
          // Tab follows document order even when the next section is still clipped.
          const showFrame = (label: string) => {
            const trigger = opening.scrollTrigger!;
            trigger.scroll(trigger.labelToScroll(label));
            trigger.update();
            trigger.getTween()?.progress(1);
          };
          const showFocusedGuide = (event: FocusEvent) => {
            if (!(event.target instanceof HTMLElement) || !event.target.matches(":focus-visible")) return;
            const progress = opening.progress();
            if (progress < 0.77 || progress > 0.9) showFrame("guides");
          };
          const backToFilm = (event: KeyboardEvent) => {
            if (event.key === "Tab" && event.shiftKey && opening.progress() >= 0.77) showFrame("film");
          };
          const firstLink = pinnedGuides?.querySelector("a");
          pinnedGuides?.addEventListener("focusin", showFocusedGuide);
          firstLink?.addEventListener("keydown", backToFilm);
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
            intro.inert = false;
            pinnedGuides?.removeEventListener("focusin", showFocusedGuide);
            firstLink?.removeEventListener("keydown", backToFilm);
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
