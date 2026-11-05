"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { projects } from "./content";
import s from "./research.module.css";

export function ProjectStack() {
  const [selected, setSelected] = useState(0);
  const project = projects[selected];
  return <><div className={s.projectShowcase}>
    <div className={s.stack} role="group" aria-label="Featured research projects">
      {projects.map((item, index) => <button key={item.title} type="button" className={`${s.projectCard} ${selected === index ? s.selected : ""}`} style={{ "--index": index } as CSSProperties} onPointerEnter={event => { if (event.pointerType === "mouse") setSelected(index); }} onFocus={() => setSelected(index)} onClick={() => setSelected(index)} aria-pressed={selected === index} aria-controls="project-detail">
        <Image src={item.image} alt={item.alt} fill sizes="(max-width: 700px) 85vw, 30vw" />
        <span className={s.cardTop}><span>{String(index + 1).padStart(2, "0")} / {item.field}</span><span aria-hidden="true">↗</span></span>
        <span className={s.cardBottom}><strong>{item.title}</strong><span>{index === 0 ? "₹13.63 Cr · DST-PURSE" : item.field}</span></span>
      </button>)}
    </div>
    <div id="project-detail" className={s.projectDetail}>
      <div><p className={s.eyebrow}>{project.field}</p><h3>{project.title}</h3><p>{project.description}</p><a className={s.textLink} href={project.source}>Read the official source <span aria-hidden="true">↗</span></a></div>
      <dl><div><dt>Funding agency</dt><dd>{project.agency}</dd></div><div><dt>Published funding</dt><dd>{project.funding}</dd></div><div><dt>Source / reporting year</dt><dd>{project.year}</dd></div><div><dt>Patent year</dt><dd>{project.patent}</dd></div></dl>
    </div>
    </div><p className={s.note}>Research area imagery is illustrative. Reporting years are not patent years. The 2022 newsletter lists DBT funding as 94.42 (175.00) lakh without explaining the parenthetical figure; both are reproduced as published.</p>
  </>;
}
