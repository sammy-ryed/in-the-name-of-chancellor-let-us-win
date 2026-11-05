import type { Metadata } from "next";
import Image from "next/image";
import { SiteFooter } from "@/components/SiteFooter";
import { ResearchHero } from "./Hero";
import { ProjectStack } from "./ProjectStack";
import { centreGroups, prospectus, sources } from "./content";
import { ResearchStatistics } from "./Statistics";
import { ResearchFacilities } from "./Facilities";
import s from "./research.module.css";

export const metadata: Metadata = {
  title: "Research & Innovation",
  description: "Explore SRMIST research centres, funded projects, shared facilities and opportunities for researchers. Figures from the 2025–26 prospectus.",
};

const sections = [
  ["glance", "At a glance"], ["projects", "Projects"], ["centres", "Centres"],
  ["facilities", "Facilities"], ["innovation", "Innovation"], ["opportunities", "Opportunities"],
];

const innovation = [
  { title: "Patents & technology transfer", text: "Protect an invention, explore licensing or take a research idea to market with CIAP.", label: "Explore CIAP", href: sources.ciap },
  { title: "Industry collaboration", text: "Find the university’s policies for consultancy and academic work with industry.", label: "Read the research policy", href: sources.policy },
  { title: "Research to entrepreneurship", text: "Explore FabLab prototyping, NewGen IEDC and incubation for new ventures.", label: "Explore incubation", href: prospectus + "#page=39" },
];

const opportunities = [
  { title: "Apply for a Ph.D.", text: "Doctoral applications and admissions.", href: sources.phd },
  { title: "Funding & fellowships", text: "Seed funding, grants and fellowship policies.", href: sources.policy },
  { title: "Research scholar handbook", text: "University guidance and doctoral regulations.", href: sources.handbook },
  { title: "Research events", text: "Research Day and the Dr. Paarivendhar Research Colloquium.", href: prospectus + "#page=32" },
];

function Heading({ id, title, intro }: { id: string; title: string; intro?: string }) {
  return (
    <header className={s.sectionHead}>
      <h2 id={id}>{title}</h2>
      {intro && <p>{intro}</p>}
    </header>
  );
}

export default function ResearchPage() {
  return (
    <>
      <div className={s.page}>
        <ResearchHero />
        <nav className={s.jumps} aria-label="Research sections">
          {sections.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
        </nav>

        <section className={s.section} id="glance" aria-labelledby="glance-title">
          <Heading id="glance-title" title="Research at a glance" intro="SRMIST’s published research figures for 2025–26." />
          <ResearchStatistics />
          <p className={s.note}><a href={prospectus + "#page=31"}>University prospectus 2025–26, pp. 31–32 <span aria-hidden="true">↗</span></a></p>
        </section>

        <section className={`${s.section} ${s.warm}`} id="projects" aria-labelledby="projects-title">
          <Heading id="projects-title" title="Research in focus" intro="Explore four funded projects, the questions behind them and who supported the work." />
          <ProjectStack />
          <p className={s.note}>Photos illustrate the research areas. Each project links to its original report.</p>
        </section>

        <section className={s.section} id="centres" aria-labelledby="centres-title">
          <Heading id="centres-title" title="Find a research centre" intro="Browse by discipline to find the teams working in your field." />
          <div id="all-centres" className={s.centreCards}>
            {centreGroups.map(group => (
              <article key={group.title}>
                <div className={s.centreImage}><Image src={group.image} alt={group.alt} fill sizes="(max-width: 720px) 100vw, 28vw" /></div>
                <h3>{group.title}</h3>
                <details className={s.directory}>
                  <summary>{group.centres.length} centres <span aria-hidden="true">+</span></summary>
                  <ul>{group.centres.map(name => <li key={name}>{name}</li>)}</ul>
                </details>
              </article>
            ))}
          </div>
          <p className={s.note}><a href={prospectus + "#page=33"}>Official centre directory, p. 33 <span aria-hidden="true">↗</span></a></p>
        </section>

        <section className={`${s.section} ${s.dark}`} id="facilities" aria-labelledby="facilities-title">
          <Heading id="facilities-title" title="Inside the facilities" intro="Find shared instruments, laboratory services and the right place to request access." />
          <ResearchFacilities />
        </section>

        <section className={s.section} id="innovation" aria-labelledby="innovation-title">
          <Heading id="innovation-title" title="Beyond the laboratory" />
          <div className={s.innovationGrid}>
            {innovation.map(item => (
              <a href={item.href} key={item.title}>
                <h3>{item.title}</h3><p>{item.text}</p>
                <span className={s.cardLink}>{item.label} <span aria-hidden="true">↗</span></span>
              </a>
            ))}
          </div>
        </section>

        <section className={`${s.section} ${s.warm}`} id="opportunities" aria-labelledby="opportunities-title">
          <Heading id="opportunities-title" title="Start your research at SRMIST" intro="Applications, funding and guidance for current and future researchers." />
          <div className={s.opportunities}>
            {opportunities.map(item => (
              <a href={item.href} key={item.title}>
                <div><h3>{item.title}</h3><p>{item.text}</p></div><span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}
