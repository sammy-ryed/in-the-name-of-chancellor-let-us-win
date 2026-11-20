import Link from "next/link";
import { ApplicationPortal } from "./ApplicationForm";
import s from "./apply.module.css";

export function ApplicationHero() {
  return <header className={s.hero}>
    <div className={s.heroCopy}>
      <nav className={s.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/admissions">Admissions</Link><span>/</span><span aria-current="page">Apply</span></nav>
      <h1>Apply for SRMJEEE</h1>
      <p className={s.open}>Admissions 2027–28</p>
      <h2>Prepare your B.Tech application.</h2>
      <p>Check what you’ll need, then register or sign in on SRM’s application portal.</p>
      <div className={s.heroFacts}><span><strong>₹1,400</strong> per SRMJEEE phase</span><span><strong>2 phases</strong> in 2027</span></div>
      <a href="#application-form">Go to applications ↓</a>
    </div>
    <div className={s.formWrap}><ApplicationPortal /></div>
  </header>;
}
