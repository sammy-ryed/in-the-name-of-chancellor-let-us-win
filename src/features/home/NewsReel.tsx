"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { stories } from "./content";
export function NewsReel() {
  const strip = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, moved: false, x: 0, left: 0 });
  const hover = useRef<HTMLSpanElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  useEffect(() => {
    const el = strip.current!;
    const update = () => {
      const start = el.scrollLeft <= 2,
        end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      setEdges((old) =>
        old.start === start && old.end === end ? old : { start, end },
      );
    };
    const observer = new ResizeObserver(update);
    observer.observe(el);
    el.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", update);
    };
  }, []);
  function move(d: number) {
    const el = strip.current!;
    const a = el.children[0].getBoundingClientRect(),
      b = el.children[1].getBoundingClientRect();
    el.scrollBy({
      left: d * (b.left - a.left),
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  return (
    <div className="s-stories">
      <div
        className="s-story-strip"
        ref={strip}
        id="s-stories"
        onDragStart={(e) => e.preventDefault()}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || e.button !== 0) return;
          drag.current = {
            down: true,
            moved: false,
            x: e.clientX,
            left: e.currentTarget.scrollLeft,
          };
        }}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const el = e.currentTarget;
          const bounds = el.parentElement!.getBoundingClientRect();
          if (hover.current) {
            hover.current.style.left = e.clientX - bounds.left + "px";
            hover.current.style.top = e.clientY - bounds.top + "px";
          }
          const d = drag.current;
          if (!d.down) return;
          if (!d.moved && Math.abs(e.clientX - d.x) > 6) {
            d.moved = true;
            el.setPointerCapture(e.pointerId);
            el.dataset.dragging = "true";
          }
          if (d.moved) el.scrollLeft = d.left - (e.clientX - d.x);
        }}
        onPointerUp={(e) => {
          const el = e.currentTarget;
          drag.current.down = false;
          delete el.dataset.dragging;
          if (el.hasPointerCapture(e.pointerId))
            el.releasePointerCapture(e.pointerId);
        }}
        onPointerCancel={(e) => {
          drag.current.down = false;
          drag.current.moved = false;
          delete e.currentTarget.dataset.dragging;
        }}
        onPointerLeave={() => {
          if (!drag.current.moved) drag.current.down = false;
        }}
        onClickCapture={(e) => {
          if (drag.current.moved) {
            e.preventDefault();
            drag.current.moved = false;
          }
        }}
      >
        {stories.map((a) => (
          <a href={a.href} key={a.title}>
            <div>
              <Image
                src={"/home/" + a.image + ".webp"}
                width={900}
                height={560}
                sizes="(max-width:700px) 80vw, 30vw"
                alt={a.alt}
                unoptimized
              />
            </div>
            <h3>{a.title}</h3>
            <small>{a.category}</small>
          </a>
        ))}
      </div>
      <span ref={hover} className="s-news-pointer yellow-action" aria-hidden="true">
        ↔
      </span>
      <div className="s-news-controls">
        <button
          className="yellow-action"
          aria-controls="s-stories"
          disabled={edges.start}
          onClick={() => move(-1)}
          aria-label="Previous story"
        >
          ←
        </button>
        <button
          className="yellow-action"
          aria-controls="s-stories"
          disabled={edges.end}
          onClick={() => move(1)}
          aria-label="Next story"
        >
          →
        </button>
      </div>
    </div>
  );
}
