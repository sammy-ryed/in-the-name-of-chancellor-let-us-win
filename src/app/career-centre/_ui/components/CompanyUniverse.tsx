"use client";
import { useMemo, useState } from "react";
import InfiniteMenu from "./InfiniteMenu";
import companies from "../all-recruiters.json";
import { matchesCategory, recruiterCategories, type RecruiterCategory } from "../recruiter-categories";
import { sources } from "../content";
import { useCareerReducedMotion } from "./Motion";
import s from "../remake.module.css";
const categories: RecruiterCategory[] = ["All companies", ...Object.keys(recruiterCategories) as (keyof typeof recruiterCategories)[]];
export function CompanyUniverse() {
  const reduced = useCareerReducedMotion();
  const [directory, setDirectory] = useState(false);
  const [category, setCategory] = useState<RecruiterCategory>("All companies");
  const [paused, setPaused] = useState(false);
  const items = useMemo(() => companies.filter(company => matchesCategory(company.file, category)).map(company => ({ image: `/career-centre/logo-${company.file}.webp`, title: company.name, description: category === "All companies" ? "SRMIST recruiter directory" : category, link: sources.career })), [category]);
  return <>
    <div className={s.recruiterFilters} role="group" aria-label="Filter recruiter companies">
      {categories.map(item => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}<span>{companies.filter(company => matchesCategory(company.file, item)).length}</span></button>)}
    </div>
    <div className={s.menuTools}><p aria-live="polite">{items.length} companies · {category}. Drag or use arrow keys to explore.</p><div className={s.menuActions}>
      {!reduced && <button type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? "Resume rotation ↻" : "Pause rotation Ⅱ"}</button>}
      <button type="button" onClick={() => setDirectory(!directory)} aria-expanded={directory} aria-controls="company-directory">{directory ? "Close directory −" : `View all ${items.length} companies +`}</button>
    </div></div>
    <div className={s.universe}><InfiniteMenu items={items} count={Math.max(60,items.length)} theme="light" backgroundColor="#e8edf5" accentColor="#123f78" tileSize={0.7} zoom={0.9} grayscale={false} dim={0.1} roundness={0.8} autoplay={reduced || paused ? 0 : 4} intro={!reduced} stretch={reduced ? 0 : 0.35} /></div>
    {directory && <div className={s.companyDirectory} id="company-directory">{items.map(item=><a key={item.image} href={item.link}>{item.title}<span>↗</span></a>)}</div>}
    <p className={s.note}>Authentic company artwork from <a href={sources.career}>SRM’s official recruiter gallery ↗</a>. Industry filters are editorial browsing groups. Rotation resumes after four idle seconds, pauses while interacting, and respects reduced motion.</p>
  </>;
}
