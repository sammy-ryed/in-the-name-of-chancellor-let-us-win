"use client";

import Link from "next/link";
import { useState } from "react";
import { ApplicationForm } from "./ApplicationForm";
import s from "./apply.module.css";

function heading(exam: string) {
  return exam === "Others" ? "Apply to SRM" : `Apply for ${exam}`;
}

export function ApplicationHero() {
  const [exam, setExam] = useState("SRMJEEE");

  return <header className={s.hero}>
    <div className={s.heroCopy}>
      <nav className={s.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/admissions">Admissions</Link><span>/</span><span>Apply</span></nav>
      <h1>{heading(exam)}</h1>
      <p className={s.open}>Admissions 2027–28 are open</p>
      <h2>Begin your application in about 15 minutes.</h2>
      <p>Engineering, computer applications, management, health sciences and more. Register from your phone or computer.</p>
      <div className={s.heroFacts}><span><strong>₹1,400</strong> per SRMJEEE phase</span><span><strong>2 phases</strong> in 2027</span></div>
      <Link href="/programmes">Explore programmes →</Link>
    </div>
    <div className={s.formWrap}><ApplicationForm exam={exam} onExamChange={setExam} /></div>
  </header>;
}
