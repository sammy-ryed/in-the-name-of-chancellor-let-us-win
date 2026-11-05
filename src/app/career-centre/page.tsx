import type { Metadata } from "next";
import Image from "next/image";
import { SiteFooter } from "@/components/SiteFooter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CareerExperience, CountUp, Reveal } from "./_ui/components/Motion";
import { CompanyUniverse } from "./_ui/components/CompanyUniverse";
import { HeroSurface, HeroTitle } from "./_ui/components/HeroSurface";
import { sources, stories, training, resources } from "./_ui/content";
import s from "./_ui/remake.module.css";
import "./_ui/utilities.css";
export const metadata: Metadata = { title: "Career Centre", description: "SRMIST Career Centre. Explore recruiters, placement outcomes and career preparation." };
export default function Page() {
 return <><CareerExperience><div className={s.redesign}>
 <HeroSurface>
  <Breadcrumbs className={s.crumbs} parents={[{href:"/",label:"Home"}]} current="Career Centre" />
  <HeroTitle />
  <p className={s.heroIntro}>Prepare for placement, explore the opportunities and find your next chapter.</p>
  <a className={s.heroAction} href="#outcomes">Placement figures <span aria-hidden="true">↓</span></a>
 </HeroSurface>
 <section id="outcomes" className={s.section} aria-labelledby="figures-title">
 <div className={s.sectionTop}><h2 id="figures-title">Global skills.<br/><em>Global placements.</em></h2><p>SRMIST University-Wide Placement Figures<br/>2026 graduating batch</p></div>
 <div className={s.bento}>
 <Reveal className={s.total}><span className={s.pill}>2026 / Placement snapshot</span><p>Total offers</p><strong><CountUp value={10969} suffix="+"/></strong><span className={s.totalFoot}>A new chapter, for every ambition. <span>↗</span></span></Reveal>
 <div className={s.smallStats}>{[{n:1701,label:"Number of roles",suffix:"",unit:""},{n:5499,label:"High-paying offers",suffix:"+",unit:""},{n:60,label:"Highest CTC",suffix:"",unit:"LPA"},{n:7.47,label:"Average CTC",suffix:"",unit:"LPA",decimals:2}].map(stat=><Reveal className={s.statTile} key={stat.label}><span className={s.pill}>{stat.label}</span><strong><CountUp value={stat.n} suffix={stat.suffix} decimals={stat.decimals??0}/><small>{stat.unit}</small></strong><span>SRMIST / 2026</span></Reveal>)}</div>
 </div><p className={s.note}>2026 figures transcribed from the official SRM Career Centre screenshot supplied for this redesign. Reporting date is not shown in the screenshot. <a href={sources.career}>Official Career Centre ↗</a><br/>CTC: cost to company. LPA: lakh per annum. Offers may include multiple offers to one student.</p>
 </section>
 <section id="recruiters" className={`${s.section} ${s.companies}`} aria-labelledby="companies-title"><div className={s.sectionTop}><h2 id="companies-title">A world of<br/><em>possibilities.</em></h2><p>Meet the companies.<br/>Find your next chapter.</p></div><CompanyUniverse/></section>
 <section className={s.section} aria-labelledby="offers-title"><div className={s.tableHeading}><h2 id="offers-title">Beyond the ordinary</h2><p>SRM’s published offer categories.<br/>Preparation meets possibility.</p></div><div className={s.tableLabels}><span>Category</span><span>Annual package</span><span>Published company examples</span><span/></div>{[{name:"Dream",amount:"₹5 LPA+",names:"Deloitte · Siemens · Infosys"},{name:"Super Dream",amount:"₹10 LPA+",names:"Microsoft · Barclays · Honda"},{name:"Marquee",amount:"₹20 LPA+",names:"Adobe · Morgan Stanley · Google India"}].map(item=><a className={s.offerRow} href={sources.categories} key={item.name}><h3>{item.name}</h3><span className={s.pill}>{item.amount}</span><span>{item.names}</span><b>↗</b></a>)}<p className={s.note}>Category thresholds and examples: <a href={sources.categories}>Catapulting Careers ↗</a>. These are published category definitions, not current vacancies or guaranteed offers.</p>
 <div className={s.storyHeading}><h2>Faces behind the offers</h2><span>Real people. Their next chapters.</span></div><div className={s.storyCards}>{stories.map(story=><a className={s.storyCard} href={sources.career} key={story.name}><Image src={`/career-centre/${story.image}.webp`} alt={story.name} fill sizes="(max-width:600px) 80vw, 25vw"/><span className={s.storyTag}>{story.company}<b>↗</b></span><div><h3>{story.name}</h3><p>{story.department}</p><blockquote>“{story.quote}”</blockquote><span>Read their story ↗</span></div></a>)}</div><p className={s.note}>Portraits and excerpts from SRM’s official testimonials. Job titles and placement years are not published, except Ujjwal’s stated 2023–26 cohort.</p></section>
 <section id="support" className={`${s.section} ${s.support}`} aria-labelledby="training-title"><div className={s.tableHeading}><h2 id="training-title">Built for what comes next</h2><p>Your preparation, step by step.<br/>Explore the support behind the offers.</p></div><div className={s.trainingLabels}><span>Journey</span><span>Focus</span><span/></div>{training.map((step,i)=><details className={s.trainingRow} key={step.title}><summary><span className={s.rowTitle}><small>0{i+1}</small>{step.title}</span><span className={s.pill}>{step.tag}</span><b>+</b></summary><div className={s.trainingDetail}><div><p>{step.text}</p><p>{step.detail}</p><a href={step.href}>Explore the official resource ↗</a></div><Image src={`/career-centre/${step.image}.webp`} alt={step.alt} width={637} height={400}/></div></details>)}<div className={s.photoStrip}>{[{image:"training",title:"Practice",caption:"Coding & technical preparation"},{image:"industry",title:"Connect",caption:"Industry perspectives"},{image:"internships",title:"Experience",caption:"Internships & exposure"}].map(photo=><a href={sources.activities} key={photo.image}><Image src={`/career-centre/${photo.image}.webp`} alt={photo.caption} fill sizes="(max-width:600px) 90vw, 33vw"/><span>↗</span><div><h3>{photo.title}</h3><p>{photo.caption}</p></div></a>)}</div>
 </section>
 <section className={s.section} aria-labelledby="contact-title"><div className={s.contactGrid}><div><p className={s.pill}>Let’s start a conversation</p><h2 id="contact-title">What comes<br/><em>next?</em></h2><a className={s.email} href="mailto:placement@srmist.edu.in">placement@srmist.edu.in ↗</a><address>15th Floor, Tech Tower II<br/>SRMIST Campus, SRM Nagar<br/>Kattankulathur, Chengalpattu<br/>Tamil Nadu – 603 203</address><a href="tel:+914427455774">+91 44 2745 5774</a><br/><a href="tel:+914427452270">+91 44 2745 2270 · Ext. 7301</a></div><div className={s.resources}>{resources.map((resource,i)=><a href={resource.href} key={resource.title}><small>{String(i+1).padStart(2,"0")}</small><div><h3>{resource.title}</h3><p>{resource.note}</p></div><span>↗</span></a>)}</div></div></section>
 </div></CareerExperience><SiteFooter/></>;
}
