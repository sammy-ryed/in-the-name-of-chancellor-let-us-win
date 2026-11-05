"use client";

import Image from "next/image";
import { useState } from "react";
import { facilities } from "./content";
import s from "./research.module.css";

const previews = [
  { image: "park", alt: "Sir C. V. Raman Research Park at SRMIST" },
  { image: "instrumentation", alt: "Microscope equipment at SRM Central Instrumentation Facility" },
  { image: "nano", alt: "SRMIST Nanotechnology Research Centre" },
  { image: "computing", alt: "SRMIST High-Performance Computing Centre" },
  { image: "labs", alt: "Chemistry research laboratory at SRMIST" },
];

export function ResearchFacilities() {
  const [selected, setSelected] = useState(0);
  return <div className={s.facilityLayout}>
    <div className={s.facilityPhoto} id="facility-preview">
      {previews.map((item, index) => <Image key={item.image} className={`${s.facilityPreview} ${index === selected ? s.visiblePreview : ""}`} src={`/research/${item.image}.webp`} alt={index === selected ? item.alt : ""} aria-hidden={index !== selected} fill sizes="(max-width: 700px) 100vw, 40vw" />)}
      <span>{facilities[selected].title}</span>
    </div>
    <div className={s.facilityList}>{facilities.map((facility, index) => <div key={facility.title} className={`${s.facilityRow} ${index === selected ? s.activeFacility : ""}`} onPointerEnter={event => { if (event.pointerType === "mouse") setSelected(index); }}>
      <button type="button" onFocus={() => setSelected(index)} onClick={() => setSelected(index)} aria-pressed={index === selected} aria-controls="facility-preview"><span className={s.rowNumber}>0{index + 1}</span><span><span className={s.facilityTitle}>{facility.title}</span><span className={s.facilityDescription}>{facility.description}</span></span></button>
      <a href={facility.href} onFocus={() => setSelected(index)} aria-label={`Visit ${facility.title}`}><span aria-hidden="true">↗</span></a>
    </div>)}</div>
  </div>;
}
