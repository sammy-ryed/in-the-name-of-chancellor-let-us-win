import { useState, type ReactNode } from "react";
import Link from "next/link";
import { ProspectusHeading } from "@/components/ProspectusHeading";
import { routes } from "@/lib/navigation";
import { Icon } from "./controls";
import { FieldArtwork } from "./FieldArtwork";
import { studyAreaHref, type StudyArea } from "./studyAreas";

function FeaturedArea({ areas }: { areas: StudyArea[] }) {
  const [index, setIndex] = useState(() => Math.max(0, areas.findIndex(area => area.id === "engineering")));
  const current = areas[index];
  if (!current) return null;

  const step = (direction: number) =>
    setIndex(position => (position + direction + areas.length) % areas.length);

  return (
    <section className="pf-feature" aria-label="Featured study areas">
      <Link className="pf-feature-link" href={studyAreaHref(current)}>
        <FieldArtwork area={current} priority />
        <span className="pf-feature-caption" aria-live="polite" aria-atomic="true">
          <span>{current.title}</span><Icon name="arrow" />
        </span>
      </Link>
      {areas.length > 1 && <div className="pf-feature-controls">
        <button type="button" aria-label="Previous study area" onClick={() => step(-1)}><Icon name="arrow" /></button>
        <button type="button" aria-label="Next study area" onClick={() => step(1)}><Icon name="arrow" /></button>
      </div>}
    </section>
  );
}

export function ProgrammeMasthead({ area, areas, total, browseAll, hasFilters, onBrowse, children }: {
  area?: StudyArea;
  areas: StudyArea[];
  total: number;
  browseAll: boolean;
  hasFilters: boolean;
  onBrowse: () => void;
  children: ReactNode;
}) {
  const inDirectory = Boolean(area || browseAll);
  return (
    <header className="pf-hero" data-results={hasFilters || undefined} data-directory={inDirectory || undefined}>
      <div className="pf-hero-inner">
        <div className="pf-hero-copy">
          <ProspectusHeading edition="programmes"
            parents={inDirectory ? [routes.admissions, { href: "/programmes#study-areas", label: "Study areas" }] : [routes.admissions]}
            current={area?.title ?? (browseAll ? "All programmes" : "Programmes")} compact={inDirectory}>
            {area ? area.title : browseAll ? "All programmes" : <>Find your <em>programme.</em></>}
          </ProspectusHeading>
          <p className="pf-intro">{area ? `Explore ${total} programmes in this study area.` :
            `Explore ${total} programmes across ${areas.length} study areas at SRMIST.`}</p>
          {children}
          <div className="pf-hero-links">
            <Link href="/programmes#study-areas" onClick={onBrowse}>{inDirectory ? "All study areas" : "Browse by study area"} <Icon name="chevron" /></Link>
            <Link href={routes.fees.href}>Compare fees <Icon name="arrow" /></Link>
            <Link href={routes.finder.href}>Try the course finder <Icon name="arrow" /></Link>
          </div>
        </div>
        <div className="pf-hero-art">
          {area ? <FieldArtwork area={area} /> : <FeaturedArea areas={areas} />}
        </div>
      </div>
    </header>
  );
}
