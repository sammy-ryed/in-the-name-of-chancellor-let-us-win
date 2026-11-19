import type { Metadata } from "next";
import Image from "next/image";
import { ProspectusHeading } from "@/components/ProspectusHeading";
import { SiteFooter } from "@/components/SiteFooter";
import { routes } from "@/lib/navigation";
import { admissionsEmails } from "@/features/admissions/contact";
import { awards, faculties } from "./content";
import { ResponsiveScholarshipDetails } from "./ResponsiveScholarshipDetails";
import s from "./scholarships.module.css";

export const metadata: Metadata = {
  title: "Scholarships & Eligibility",
  description: "Explore SRMIST scholarship categories, eligibility, fee concessions and renewal requirements using the amended 2025–26 onwards schedule and official scholarship policy.",
};

function HighlightedBullet({ text }: { text: string }) {
  const separator = text.indexOf(":");
  if (separator < 0) return text;
  return <><strong>{text.slice(0, separator + 1)}</strong>{text.slice(separator + 1)}</>;
}

export default function ScholarshipsPage() {
  return <><div className={s.page}>
    <ResponsiveScholarshipDetails />
    <header className={s.hero}>
      <div>
        <ProspectusHeading edition="admissions" parents={[routes.home, routes.admissions]} current="Scholarships">Scholarships</ProspectusHeading>
        <p className={s.intro}>Support for your ambition.<br />Find the award that fits your journey.</p>
        <p className={s.heroText}>Explore academic merit awards, financial assistance and faculty-specific scholarships, with eligibility and renewal requirements in one place.</p>
        <div className={s.actions}><a className={s.button} href="#categories">Explore scholarships <span aria-hidden="true">↓</span></a></div>
      </div>
      <figure className={s.heroImage}><Image src="/home/convocation.webp" alt="A graduate receiving her degree at SRMIST’s 2026 convocation" fill preload sizes="(max-width: 760px) 100vw, 45vw" /><figcaption>Celebrating achievement / SRMIST</figcaption></figure>
    </header>

    <nav className={s.index} aria-label="Scholarship page sections"><a href="#categories">01 / Scholarship categories</a><a href="#faculty">02 / Faculty awards</a><a href="#apply">03 / Applying & renewal</a></nav>

    <section id="categories" className={s.section} aria-labelledby="categories-title">
      <div className={s.heading}><div><p className={s.eyebrow}>01 / Find your support</p><h2 id="categories-title">Scholarship categories</h2></div><p>From academic achievement to financial need, explore all 13 categories in the amended schedule.</p></div>
      <div className={s.rules}><p><strong>One category per candidate.</strong> Faculty-specific diversity combinations are explained separately below.</p><p><strong>Programme exclusions:</strong> the general schedule excludes NEET-based programmes, Pharm.D and Pharm.D (PB), plus any further management exclusions. External sponsorship follows its own scheme rules.</p></div>
      <p className={s.note}>Founder’s academic eligibility uses JEE Main rank up to <strong>2,000</strong> from the amended document; the policy’s older 20,000 figure is not used here. Perambalur Constituency is marked renewal-only.</p>
      <div className={s.awards}>{awards.map((award, i) => <details className={s.award} id={award.id} key={award.id} data-responsive-scholarship>
        <summary><span className={s.number}>{String(i + 1).padStart(2, "0")}</span><span className={s.awardName}><strong>{award.name}</strong><small>{award.audience}</small></span><span className={s.benefit} data-tier={award.benefit.includes("100%") ? "full" : award.benefit.includes("%") ? "partial" : "standard"}>{award.benefit}</span><span className={s.plus} aria-hidden="true">+</span></summary>
        <div className={s.awardDetails}>
          <details className={s.infoGroup} data-responsive-scholarship><summary><h3>Who is eligible?</h3><span aria-hidden="true">+</span></summary><ul>{award.eligibility.map(text => <li key={text}><HighlightedBullet text={text} /></li>)}</ul></details>
          <details className={s.infoGroup} data-responsive-scholarship><summary><h3>What is covered?</h3><span aria-hidden="true">+</span></summary><ul>{award.coverage.map(text => <li key={text}><HighlightedBullet text={text} /></li>)}</ul></details>
          <details className={`${s.infoGroup} ${s.renewalGroup}`} data-responsive-scholarship><summary><h3>How to renew</h3><span aria-hidden="true">+</span></summary><p>{award.renewal}</p></details>
        </div>
      </details>)}</div>
      <p className={s.note}>Percentages refer to the specified fee, not the total cost of study. A dash or blank in the schedule does not establish a fee waiver. Awards remain subject to approval and the applicable scheme conditions.</p>
    </section>

    <section id="faculty" className={`${s.section} ${s.dark}`} aria-labelledby="faculty-title">
      <div className={s.heading}><div><p className={s.eyebrow}>02 / By programme</p><h2 id="faculty-title">Find your faculty award</h2></div><p>Entrance scores, board results and diversity awards from the official policy. Campus restrictions are shown on each card.</p></div>
      <div className={s.facultyIntro}><h3>Read the right measure.</h3><p>Score, rank, percentile and board percentage are different criteria. All percentages in the tables below are tuition waivers. Faculty awards are processed after first-year enrolment and document verification; paid fees may be reimbursed or adjusted against later years.</p></div>
      <div className={s.faculties}>{faculties.map(faculty => <details key={faculty.name} className={s.faculty} data-responsive-scholarship><summary><span><small>{faculty.scope}</small><h3>{faculty.name}</h3></span><span className={s.plus} aria-hidden="true">+</span></summary><div className={s.facultyBody}>{faculty.tables.map(table => <div className={s.tableWrap} key={table.title}><table><caption>{table.title}</caption><thead><tr><th scope="col">{table.measure}</th><th scope="col">Tuition waiver</th></tr></thead><tbody>{table.rows.map(([band, benefit]) => <tr key={band}><th scope="row">{band}</th><td>{benefit}</td></tr>)}</tbody></table></div>)}<ul>{faculty.notes.map(note => <li key={note}><HighlightedBullet text={note} /></li>)}</ul></div></details>)}</div>
      <p className={s.note}>For all faculty renewals: apply within the prescribed dates, have no arrears/backlogs, and no break in study, detention or disciplinary/malpractice action. Use the scheme’s CGPA requirement above. Faculty-specific provisions come from the policy page; the general schedule’s exclusions still require checking for your programme.</p>
    </section>

    <section id="apply" className={s.section} aria-labelledby="apply-title">
      <div className={s.heading}><div><p className={s.eyebrow}>03 / Your next step</p><h2 id="apply-title">Applying & renewing</h2></div><p>Check eligibility first. Keep your evidence ready. Apply through the process specified for your award.</p></div>
      <div className={s.applyGrid}><figure className={s.supportImage}><Image src="/home/clubs.webp" alt="Students together on an SRMIST campus walkway" fill sizes="(max-width: 760px) 100vw, 40vw" /></figure><div className={s.steps}>
        <details className={s.step} data-responsive-scholarship><summary><span>01</span><h3>Confirm your scheme</h3></summary><p>Check your programme, campus, admission route and category. Committee approval is required; a qualifying score alone does not guarantee an award.</p></details>
        <details className={s.step} data-responsive-scholarship><summary><span>02</span><h3>Prepare your evidence</h3></summary><p>Depending on your scheme: rank/score reports, academic records, income proof, NGO recommendations, disability or service certificates, alumni registration, sports/arts recognition, and Aadhaar for regional-diversity claims.</p></details>
        <details className={s.step} data-responsive-scholarship><summary><span>03</span><h3>Follow the correct application route</h3></summary><p>The policy gives an annual online application window of <strong>1–10 July</strong>, with provisional selections by 1 August. Confirm the current cycle with Admissions. Employee ward applications are called in April; sports selection, counselling awards and defence applications at enrolment have separate routes.</p></details>
        <details className={s.step} data-responsive-scholarship><summary><span>04</span><h3>Renew each year</h3></summary><p>Submit a renewal application on time and meet the scheme’s academic, participation and conduct conditions. Awards are not retrospective; the committee’s decision is final and scholarships may be revoked for misconduct or fraud.</p></details>
      </div></div>
      <div className={s.contact}><div><h3>Not sure which category applies?</h3><p>Ask Admissions to confirm the scheme, documents and current application window for your programme.</p></div><a className={s.button} href={`mailto:${admissionsEmails.domestic}?subject=Scholarship%20eligibility%20enquiry`}>Email Admissions <span aria-hidden="true">↗</span></a></div>
    </section>

  </div><SiteFooter /></>;
}
