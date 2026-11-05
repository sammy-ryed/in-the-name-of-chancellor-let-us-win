"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { clubContacts, clubProfiles, clubs, studentAffairs } from "./clubs";
import categoryImages from "./club-images.json";
import "./club-expand.css";

// Independently implemented from the supplied hover-expand visual reference.
const categories = [{ type: "All interests", image: "/home/film.webp", alt: "SRM students celebrating their robotics project", count: clubs.length }, ...categoryImages.map(category => ({
  ...category,
  // A campus photograph makes the opening panel a human introduction to service.
  image: category.type === "Service" ? "/home/film.webp" : category.image,
  alt: category.type === "Service" ? "SRM students celebrating together with their robotics project" : category.alt,
  count: clubs.filter(club => club.type === category.type).length,
}))];
type Club = (typeof clubs)[number];

export function ClubCards() {
  const [active, setActive] = useState("All interests");
  const [selected, setSelected] = useState<Club | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const results = useRef<HTMLDivElement>(null);
  const found = clubs.filter(club => active === "All interests" || club.type === active);
  const shown = active;
  const choose = (type: string) => {
    setActive(type);
    if (results.current) results.current.scrollTop = 0;
  };

  useEffect(() => {
    if (!selected) return;
    dialog.current?.showModal();
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => { document.documentElement.style.overflow = previous; };
  }, [selected]);

  function onCategoryKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % categories.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + categories.length) % categories.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = categories.length - 1;
    else return;
    event.preventDefault();
    choose(categories[next].type);
    triggers.current[next]?.focus();
  }

  return <div id="clubs" className="ce-experience" data-category={active}>
    <div className="ce-layout">
      <div className="ce-gallery" role="group" aria-label="Explore club categories">
        {categories.map((category, index) => <article key={category.type} data-interest={category.type} className={`ce-panel${shown === category.type ? " is-active" : ""}`}
          onPointerEnter={event => {
            if (event.pointerType === "mouse" && !event.currentTarget.parentElement?.querySelector(":focus-visible")) choose(category.type);
          }}>
          <div className="ce-photo" aria-hidden="true"><Image src={category.image} alt={category.alt} fill sizes="(max-width: 700px) 85vw, 45vw" unoptimized /><div className="ce-photo-shade" />
            <div className="ce-photo-caption"><strong>{category.type}</strong><span>{category.count} {category.count === 1 ? "club" : "clubs"} to explore</span></div>
          </div>
          <button type="button" className="ce-trigger" ref={element => { triggers.current[index] = element; }}
            aria-label={`Explore ${category.type} clubs`} aria-pressed={active === category.type} aria-controls="club-category-list"
            onClick={() => choose(category.type)} onKeyDown={event => onCategoryKey(event, index)}>
            <span className="ce-vertical">{category.type}</span>
          </button>
        </article>)}
      </div>
      <div className="ce-editorial">
        <span className="ce-eyebrow">YOUR PEOPLE ARE HERE / 15 CLUBS</span>
        <h2 id="people-title">Find your<br /> people<span>.</span></h2>
        <div id="club-category-list" className="ce-results" ref={results}>
          <p className="ce-count" role="status">{active} / {found.length} {found.length === 1 ? "club" : "clubs"}</p>
          {found.map(club => <button type="button" className="ce-club" key={club.name} onClick={event => { opener.current = event.currentTarget; setSelected(club); }}><span><small>{club.type}</small><strong>{club.name}</strong></span><span aria-hidden="true">↗</span></button>)}
        </div>
        <p className="ce-footnote">Open a club to find out how to join.</p>
        <a className="ce-official" href={clubProfiles}>Official club profiles <span aria-hidden="true">↗</span></a>
      </div>
    </div>
    <dialog ref={dialog} className="ce-dialog" aria-labelledby="ce-dialog-title" onClick={event => { if (event.target === dialog.current) dialog.current.close(); }}
      onClose={() => { setSelected(null); opener.current?.focus({ preventScroll: true }); }}>
      {selected && <div className="ce-dialog-inner"><button type="button" className="ce-dialog-close" onClick={() => dialog.current?.close()}>Close <span aria-hidden="true">×</span></button><small className="ce-eyebrow">{selected.type}</small><h3 id="ce-dialog-title">{selected.name}</h3>
        <p>{selected.description}</p>
        {selected.social && <a href={selected.social.href}>{selected.social.label} ↗</a>}
        <p className="ce-notice">Recruitment dates and weekly commitment aren’t published yet. The club’s coordinator can tell you about the next intake.</p>
        <h4>How to join</h4><ol><li><strong>Find the coordinator.</strong> Look up {selected.name} in Student Affairs’ club contact directory.<a href={clubContacts}>Club contact directory (PDF) ↗</a></li><li><strong>Ask about the next intake.</strong> Check meeting times, weekly commitment and how to apply.</li><li><strong>Confirm with Student Affairs.</strong> The Directorate of Student Affairs oversees the clubs.<a href={studentAffairs}>Directorate of Student Affairs ↗</a></li></ol>
        <h4>More in {selected.type}</h4><div className="ce-related">{clubs.filter(club => club.type === selected.type && club.name !== selected.name).map(club => <button type="button" key={club.name} onClick={() => setSelected(club)}>{club.name}</button>)}{clubs.filter(club => club.type === selected.type).length === 1 && <a href={clubProfiles}>Explore the official club profiles ↗</a>}</div>
      </div>}
    </dialog>
  </div>;
}
