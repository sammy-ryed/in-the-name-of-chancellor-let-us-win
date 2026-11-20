import type { ReactNode } from "react";
import Link from "next/link";
import { ProspectusHeading } from "@/components/ProspectusHeading";
import { routes } from "@/lib/navigation";
import { Icon } from "./controls";
import type { StudyArea } from "./studyAreas";

export function ProgrammeMasthead({ area, total, browseAll, onBrowse, children }: {
  area?: StudyArea;
  total: number;
  browseAll: boolean;
  onBrowse: () => void;
  children: ReactNode;
}) {
  return (
    <header className="pf-hero">
      <div className="pf-hero-inner">
        <div className="pf-hero-copy">
          <ProspectusHeading edition="programmes" compact
            parents={area ? [routes.admissions, { href: "/programmes#study-areas", label: "Study areas" }] : [routes.admissions]}
            current={area?.title ?? (browseAll ? "All programmes" : "Programmes")}>
            {area?.title ?? (browseAll ? "All programmes" : "Explore programmes")}
          </ProspectusHeading>
          <p className="pf-intro" data-area={area ? true : undefined}>{area ? `Explore ${total} programmes in this study area.` : "Find a degree, check its fees and compare your choices."}</p>
        </div>
        <div className="pf-hero-tools">
          {children}
          <nav className="pf-hero-links" aria-label="Browse programmes">
            <Link href="/programmes#study-areas" onClick={onBrowse}>Study areas <Icon name="chevron" /></Link>
            <Link href={routes.finder.href}>{routes.finder.label} <Icon name="arrow" /></Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
