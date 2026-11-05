"use client";

import Image from "next/image";
import { CarouselPlaybackButton } from "@/components/CarouselPlaybackButton";
import { useCarouselPlayback } from "@/components/useCarouselPlayback";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

type Article = { title: string; href: string; image: string; category: string; alt?: string };

export default function ArticleCarousel({ articles }: { articles: Article[] }) {
  const id = useId();
  const track = useRef<HTMLDivElement>(null);
  const thumbnails = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = articles.length;
  const { rootRef, playing, togglePlayback, pausePlayback } = useCarouselPlayback<HTMLElement>({
    enabled: count > 1,
    onAdvance: reducedMotion => {
      const next = (active + 1) % count;
      scrollToStory(next, next === 0 || reducedMotion ? "instant" : "smooth");
    },
  });

  useEffect(() => {
    const strip = thumbnails.current;
    const button = strip?.children[active] as HTMLElement | undefined;
    if (!strip || !button) return;
    const before = button.offsetLeft - strip.scrollLeft;
    const after = before + button.offsetWidth - strip.clientWidth;
    if (before < 0) strip.scrollLeft += before;
    else if (after > 0) strip.scrollLeft += after;
  }, [active]);

  if (!count) return null;

  function scrollToStory(index: number, behavior: ScrollBehavior) {
    const element = track.current;
    if (!element) return;
    element.scrollTo({ left: index * element.clientWidth, behavior });
    if (behavior === "instant") setActive(index);
  }

  function select(index: number) {
    pausePlayback();
    scrollToStory(index, "instant");
  }

  function navigate(event: KeyboardEvent<HTMLElement>) {
    const keys: Record<string, number> = {
      ArrowRight: (active + 1) % count, ArrowLeft: (active - 1 + count) % count,
      Home: 0, End: count - 1,
    };
    if (!(event.key in keys) || event.altKey || event.ctrlKey || event.metaKey) return;
    event.preventDefault();
    const next = keys[event.key];
    const target = event.target as HTMLElement;
    select(next);
    if (thumbnails.current?.contains(target)) {
      (thumbnails.current.children[next] as HTMLElement)?.focus({ preventScroll: true });
    } else if (track.current?.contains(target)) {
      requestAnimationFrame(() => track.current?.children[next]?.querySelector("a")?.focus({ preventScroll: true }));
    }
  }

  return (
    <section ref={rootRef} className="article-carousel" aria-roledescription="carousel" aria-labelledby={id + "-heading"} onKeyDown={navigate}>
      <header className="article-carousel-head">
        <h3 id={id + "-heading"}>In pictures</h3>
        {count > 1 && <div className="article-carousel-controls">
          <span aria-hidden="true">{active + 1} / {count}</span>
          <CarouselPlaybackButton className="article-carousel-playback" playing={playing} onToggle={togglePlayback} controls={id} />
          <button type="button" aria-label="Previous story" aria-controls={id} onClick={() => select((active - 1 + count) % count)}>←</button>
          <button type="button" aria-label="Next story" aria-controls={id} onClick={() => select((active + 1) % count)}>→</button>
        </div>}
      </header>
      <div id={id} className="article-carousel-track" ref={track} onScroll={event => {
        const element = event.currentTarget;
        if (element.clientWidth) setActive(Math.max(0, Math.min(count - 1, Math.round(element.scrollLeft / element.clientWidth))));
      }}>
        {articles.map((article, index) => (
          <article key={article.href} className="article-slide" inert={index !== active}
            aria-roledescription="slide" aria-label={`${index + 1} of ${count}`}>
            <a href={article.href} className="article-slide-link">
              <div className="article-slide-photo">
                <Image src={article.image} alt={article.alt ?? ""} fill
                  sizes="(max-width: 760px) 92vw, (max-width: 1600px) 44vw, 720px" draggable={false} />
              </div>
              <div className="article-slide-caption">
                <span className="article-slide-category">{article.category}</span>
                <h4>{article.title}</h4>
                <span className="article-slide-action">Read article <span aria-hidden="true">↗</span></span>
              </div>
            </a>
          </article>
        ))}
      </div>
      {count > 1 && <div className="article-thumbnails" ref={thumbnails} role="group" aria-label="Choose a story">
        {articles.map((article, index) => (
          <button type="button" key={article.href} title={article.title} aria-label={article.title}
            aria-pressed={index === active} aria-controls={id} tabIndex={index === active ? 0 : -1} onClick={() => select(index)}>
            <Image src={article.image} alt="" width={86} height={52} sizes="86px" draggable={false} />
          </button>
        ))}
      </div>}
      <span className="article-carousel-announcement" role="status" aria-live={playing ? "off" : "polite"} aria-atomic="true">
        {active + 1} of {count}. {articles[active].title}
      </span>
    </section>
  );
}
