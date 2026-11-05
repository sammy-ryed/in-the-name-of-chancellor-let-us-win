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

function Heading({ number, title, intro }: { number: string; title: string; intro: string }) {
  return <div className={s.sectionHead}><div><p className={s.eyebrow}>{number} / Research at SRMIST</p><h2>{title}</h2></div><p className={s.editorial}>{intro}</p></div>;
}

export default function ResearchPage() {
  return <><div className={s.page}>
    <ResearchHero />
    <section className={s.section} id="glance" aria-label="Research at a glance">
      <Heading number="02" title="Research at a glance" intro="Ideas explored. Knowledge shared. A snapshot of research at SRMIST." />
      <ResearchStatistics />
      <p className={s.note}>Figures from the <a href={prospectus + "#page=31"}>SRMIST University Prospectus AY 2025–26, pp. 31–32 ↗</a>. These are prospectus figures, rather than live totals.</p>
    </section>

    <section className={`${s.section} ${s.dark}`} id="centres" aria-label="Research areas and centres">
      <Heading number="03" title="Many disciplines. Shared curiosity." intro="Explore research areas and the centres that bring people, expertise and facilities together." />
      <div className={s.centreCards}>{centreGroups.map((group, index) => <article key={group.title}>
        <div className={s.centreImage}><Image src={group.image} alt={group.alt} fill sizes="(max-width: 700px) 100vw, 30vw" /><span>0{index + 1}</span></div>
        <h3>{group.title}</h3><ul>{group.centres.slice(0, 2).map(name => <li key={name}>{name}</li>)}</ul>
        <a href={prospectus + "#page=33"} className={s.textLink}>View official centre listing <span aria-hidden="true">↗</span></a>
      </article>)}</div>
      <details className={s.directory} id="all-centres"><summary>View All Research Centres <span aria-hidden="true">+</span></summary><div>{centreGroups.map(group => <div key={group.title}><h3>{group.title}</h3><ul>{group.centres.map(name => <li key={name}>{name}</li>)}</ul></div>)}</div></details>
      <p className={s.note}>Centre names drawn from the <a href={prospectus + "#page=33"}>2025–26 prospectus, p. 33 ↗</a>; grouped here by research area. Shared instrumentation and computing facilities are listed below.</p>
    </section>

    <section className={`${s.section} ${s.projectSection}`} id="projects" aria-label="Featured research projects">
      <Heading number="04" title="Research in focus" intro="From electric mobility to cancer models. Explore four funded research initiatives." />
      <p className={s.instructions}>Featured research projects <span>Hover, focus or tap a card to explore ↓</span></p>
      <ProjectStack />
    </section>

    <section className={`${s.section} ${s.dark}`} id="facilities" aria-label="Research facilities and infrastructure">
      <Heading number="05" title="The space to discover" intro="Specialist instruments, shared infrastructure and laboratories built for deeper enquiry." />
      <ResearchFacilities />
      <p className={s.note}>Infrastructure descriptions: <a href={sources.infrastructure}>SRMIST 2024–25 brochure ↗</a>. Instrument access: <a href={sources.facilities}>SRM Online Services ↗</a>.</p>
    </section>

    <section className={s.section} id="innovation" aria-label="Innovation patents and collaborations">
      <Heading number="06" title="From discovery to possibility" intro="Support for protecting ideas, working with industry and building something new." />
      <div className={s.innovationGrid}>
        <a href={sources.ciap}><span className={s.eyebrow}>01 / Protect</span><h3>Patents & Technology Transfer</h3><p>CIAP supports intellectual property protection, licensing and the journey from invention to commercialisation.</p><span className={s.cardLink}>Explore CIAP <span aria-hidden="true">↗</span></span></a>
        <a href={sources.policy}><span className={s.eyebrow}>02 / Collaborate</span><h3>Industry Collaboration & Consultancy</h3><p>Research policy and consultancy support connect academic expertise with industry challenges.</p><span className={s.cardLink}>Research policy <span aria-hidden="true">↗</span></span></a>
        <a href={prospectus + "#page=39"}><span className={s.eyebrow}>03 / Create</span><h3>Research to Entrepreneurship</h3><p>FabLab prototyping, NewGen IEDC and incubation initiatives support the development of ideas into ventures.</p><span className={s.cardLink}>Explore the innovation ecosystem <span aria-hidden="true">↗</span></span></a>
      </div>
    </section>

    <section className={`${s.section} ${s.dark}`} id="opportunities" aria-label="Research opportunities and support">
      <Heading number="07" title="Your next research question starts here" intro="Find a programme, explore support and connect with the research community." />
      <div className={s.opportunities}>{[
        { title: "Ph.D. Programmes", text: "Explore doctoral applications and the admissions process.", label: "Ph.D. admissions", href: sources.phd },
        { title: "Research Funding & Fellowships", text: "Learn about seed funding, research grants and fellowship support through SRMIST’s research policy.", label: "Funding & fellowship policy", href: sources.policy },
        { title: "Publications & Research Scholars", text: "Find research information, doctoral regulations and scholar guidance in the university handbook.", label: "University handbook 2025–26", href: sources.handbook },
        { title: "Research Events & Community", text: "Connect with Research Day and the Dr. Paarivendhar Research Colloquium.", label: "Research community & support", href: prospectus + "#page=32" },
      ].map((item, index) => <a href={item.href} key={item.title}><span className={s.rowNumber}>0{index + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p><span className={s.cardLink}>{item.label}</span></div><span aria-hidden="true">↗</span></a>)}</div>
      <div className={s.sourceFoot}><span>Explore. Question. Discover.</span><a href={prospectus}>Read the SRMIST 2025–26 prospectus ↗</a></div>
    </section>
  </div><SiteFooter /></>;
}
