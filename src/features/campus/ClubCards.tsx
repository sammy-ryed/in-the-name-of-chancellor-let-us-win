"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { clubContacts, clubProfiles, clubs, studentAffairs } from "./clubs";
import categoryImages from "./club-images.json";
import "./club-expand.css";

const allInterests = "All interests";
const mobilePreviewCount = 4;
const categories = categoryImages.map(category => ({
  ...category,
  count: category.type === allInterests ? clubs.length : clubs.filter(club => club.type === category.type).length,
}));
type Club = (typeof clubs)[number];

export function ClubCards() {
  const [active, setActive] = useState(allInterests);
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<Club | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const results = useRef<HTMLDivElement>(null);
  const found = clubs.filter(club => active === allInterests || club.type === active);
  const current = categories.find(category => category.type === active) ?? categories[0];
  const choose = (type: string) => {
    setActive(type);
    setExpanded(false);
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
        {categories.map((category, index) => <article key={category.type} data-interest={category.type} className={`ce-panel${active === category.type ? " is-active" : ""}`}
          onPointerEnter={event => {
            if (event.pointerType === "mouse" && !event.currentTarget.parentElement?.querySelector(":focus-visible")) choose(category.type);
          }}>
          <div className="ce-photo" aria-hidden="true"><Image src={category.image} alt="" fill sizes="(max-width: 960px) 1px, 45vw" /><div className="ce-photo-shade" />
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
        <h2 id="people-title">Find your<br /> people<span>.</span></h2>
        <div className="ce-mobile-picker">
          <figure className="ce-mobile-photo">
            <Image src={current.image} alt={current.alt} fill sizes="(max-width: 960px) 93vw, 1px" />
          </figure>
          <label>
            Filter by interest
            <select value={active} onChange={event => choose(event.target.value)} aria-controls="club-category-list">
              {categories.map(category => <option key={category.type} value={category.type}>{category.type} ({category.count})</option>)}
            </select>
          </label>
        </div>
        <div id="club-category-list" className="ce-results" ref={results} data-expanded={expanded}>
          <p className="ce-count" role="status">
            <span className="ce-count-desktop">{active} / </span>
            <span className="ce-count-mobile">{!expanded && found.length > mobilePreviewCount ? `Showing ${mobilePreviewCount} of ` : ""}</span>
            {found.length} {found.length === 1 ? "club" : "clubs"}
          </p>
          {found.map((club, index) => <button type="button" className="ce-club" key={club.name} data-additional={index >= mobilePreviewCount || undefined} onClick={event => { opener.current = event.currentTarget; setSelected(club); }}><span><small>{club.type}</small><strong>{club.name}</strong></span><span aria-hidden="true">↗</span></button>)}
        </div>
        {found.length > mobilePreviewCount && <button className="ce-more" type="button" aria-expanded={expanded}
          aria-controls="club-category-list" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Show fewer clubs" : `Show all ${found.length} clubs`}
        </button>}
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
