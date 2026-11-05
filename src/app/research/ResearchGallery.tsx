"use client";

import Image from "next/image";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import s from "./gallery.module.css";

export type GalleryEntry = {
  title: string;
  image: string;
  alt: string;
  description: string;
  href: string;
  linkLabel: string;
  field?: string;
  facts?: { label: string; value: string }[];
  note?: string;
};

export function ResearchGallery({ items, noun }: { items: GalleryEntry[]; noun: "project" | "facility" }) {
  const id = useId();
  const [selected, setSelected] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const gesture = useRef<{ x: number; y: number } | null>(null);
  const item = items[selected];
  const total = items.length;
  const step = (direction: number) => setSelected(index => (index + direction + total) % total);

  function navigateList(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let target = index;
    switch (event.key) {
      case "ArrowDown": target = (index + 1) % total; break;
      case "ArrowUp": target = (index + total - 1) % total; break;
      case "Home": target = 0; break;
      case "End": target = total - 1; break;
      default: return;
    }
    event.preventDefault();
    buttons.current[target]?.focus();
  }

  return (
    <div className={s.gallery}>
      <div className={s.index}>
        <div role="group" aria-label={`Choose a ${noun}`} className={s.list}>
          {items.map((entry, index) => (
            <button type="button" key={entry.title}
              ref={node => { buttons.current[index] = node; }}
              aria-pressed={index === selected} aria-controls={id}
              onPointerEnter={event => { if (event.pointerType === "mouse") setSelected(index); }}
              onFocus={() => setSelected(index)} onClick={() => setSelected(index)}
              onKeyDown={event => navigateList(event, index)}>
              <span className={s.thumb}><Image src={entry.image} alt="" fill sizes="72px" /></span>
              <span>{entry.title}</span>
              <span className={s.indicator} aria-hidden="true">→</span>
            </button>
          ))}
        </div>
        <label className={s.picker}>
          <span>Choose a {noun}</span>
          <select value={selected} onChange={event => setSelected(Number(event.target.value))} aria-controls={id}>
            {items.map((entry, index) => <option value={index} key={entry.title}>{entry.title}</option>)}
          </select>
        </label>
      </div>
      <div className={s.panel} id={id}>
        <div className={s.photo}
          onTouchStart={event => {
            const first = event.touches[0];
            gesture.current = event.touches.length === 1 ? { x: first.clientX, y: first.clientY } : null;
          }}
          onTouchCancel={() => { gesture.current = null; }}
          onTouchEnd={event => {
            const start = gesture.current;
            gesture.current = null;
            if (!start || event.touches.length) return;
            const end = event.changedTouches[0];
            const distanceX = end.clientX - start.x;
            if (Math.abs(distanceX) >= 48 && Math.abs(distanceX) > Math.abs(end.clientY - start.y) * 1.5)
              step(distanceX < 0 ? 1 : -1);
          }}>
          <Image key={item.image} src={item.image} alt={item.alt} fill sizes="(max-width: 720px) 100vw, 52vw" draggable={false} />
        </div>
        <div className={s.details}>
          <div className={s.toolbar}>
            <p className={s.meta}>{item.field ?? "Research facility"}</p>
            <div className={s.controls}>
              <button type="button" aria-label={`Previous ${noun}`} aria-controls={id} onClick={() => step(-1)}>←</button>
              <span aria-hidden="true">{selected + 1} / {total}</span>
              <button type="button" aria-label={`Next ${noun}`} aria-controls={id} onClick={() => step(1)}>→</button>
            </div>
          </div>
          <h3>{item.title}</h3>
          <p className={s.description}>{item.description}</p>
          {item.facts && <dl className={s.facts}>{item.facts.map(fact => (
            <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>
          ))}</dl>}
          {item.note && <p className={s.note}>{item.note}</p>}
          <a href={item.href} className={s.source}>{item.linkLabel} <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <span className={s.srOnly} role="status">{item.title}, {selected + 1} of {total}</span>
    </div>
  );
}
