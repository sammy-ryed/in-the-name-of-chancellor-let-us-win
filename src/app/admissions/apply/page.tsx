import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Disclosure } from "@/components/Disclosure";
import { SiteFooter } from "@/components/SiteFooter";
import { internationalApplicationUrl, routes } from "@/lib/navigation";
import { ApplicationHero } from "./ApplicationHero";
import s from "./apply.module.css";

export const metadata: Metadata = {
  title: "Apply for SRMJEEE 2027",
  description: "Prepare for SRMJEEE 2027 and open the official SRM portal to register or continue your application.",
};

const journey = [
  ["Register", "Your name, mobile number, email and the programme you want."],
  ["Verify your account", "Follow the verification instructions in SRM’s application portal."],
  ["Fill the form", "Personal, family, address and academic details."],
  ["Upload documents", "Photograph, signature and required records."],
  ["Pay & submit", "Pay the application fee online and submit."],
];

export default function ApplyPage() {
  return <><article className={s.page}>
    <ApplicationHero />

    <nav className={s.jump} aria-label="On this page"><a href="#journey">How it works</a><a href="#prepare">Keep these ready</a><a href="#faq">Questions</a><a href="#contact">Application help</a></nav>

    <section className={s.journey} id="journey">
      <div className={s.sectionHead}><h2>Apply in 5 simple steps.</h2><span>Complete these steps on SRM’s application portal.</span></div>
      <ol>{journey.map(([title, detail], index) => <li key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{detail}</p></div></li>)}</ol>
    </section>

    <section className={s.prepare} id="prepare">
      <div className={s.prepareTitle}><h2>Keep these ready.</h2><span>For the SRMJEEE 2027 application</span></div>
      <div className={s.readyCards}>
        <article className={s.photoCard}><h3>Photograph</h3><ul><li>A recent, clear photo</li><li>Check the file requirements in the form</li></ul><Image src="/admissions/apply/applicant-portrait.png" alt="Example passport-style applicant photograph" width={154} height={154} /></article>
        <article className={s.signatureCard}><h3>Signature</h3><ul><li>A clear image of your signature</li><li>Check the file requirements in the form</li></ul><div className={s.signature} aria-label="Example signature">Srm</div></article>
        <article className={s.documentsCard}><h3>Documents</h3><ul><li>Class 10 and 12 academic details</li><li>Keep your school records handy</li></ul><Image src="/admissions/apply/documents.png" alt="Illustration of academic and identity documents" width={220} height={220} /></article>
        <article className={s.paymentCard}><h3>Application fee</h3><ul><li>Online only</li><li>UPI, card or net banking</li><li>Paid at the last step</li></ul><Image src="/admissions/apply/payment.png" alt="Illustration of secure online application payment" width={220} height={220} /></article>
      </div>
      <div className={s.programmePrompt}><div><strong>Choosing between courses?</strong><p>Compare subjects, fees and placement evidence before deciding which degrees to explore.</p></div><Link href={routes.compare.href}>Compare courses →</Link></div>
    </section>

    <section className={s.faq} id="faq">
      <div className={s.sectionHead}><h2>Frequently asked questions.</h2></div>
      <div>
        <Disclosure summary="Does my preferred course lock my admission choice?"><p>No. It is collected only for statistical purposes. Your actual course and campus preference is selected during counselling, based on your SRMJEEE rank and seat availability.</p></Disclosure>
        <Disclosure summary="How much does the application cost?"><p>The SRMJEEE 2027 application fee is ₹1,400 for each phase. It is non-refundable. You may pay by debit card, credit card, UPI or net banking.</p></Disclosure>
        <Disclosure summary="Do I need to apply for both phases?"><p>No. SRMJEEE 2027 has two phases, and you may apply for either phase or both. A separate ₹1,400 fee applies to each phase.</p></Disclosure>
        <Disclosure summary="Which documents do I upload?"><p>SRM lists a photograph and signature image. Keep your Class 10 and 12 academic details ready for the form.</p><a href="https://webstor.srmist.edu.in/web_assets/downloads/2027/srmjeee-2027-faqs.pdf">Read the official SRMJEEE 2027 FAQ ↗</a></Disclosure>
        <Disclosure summary="Can I edit the form after submitting it?"><p>Use the form-correction category in your applicant dashboard. For a payment that still shows as pending, wait 24 hours before raising a payment query.</p></Disclosure>
        <Disclosure summary="Who should use the international application?"><p>NRI, PIO, OCI and foreign-national applicants should use SRMIST’s international application route.</p><a href={internationalApplicationUrl}>Open international applications ↗</a></Disclosure>
      </div>
    </section>

    <section className={s.contact} id="contact">
      <div><h2>Need help before you apply?</h2><span>Ask about eligibility, documents, payments or the correct application route.</span></div>
      <div><a href="mailto:admissions.india@srmist.edu.in?subject=SRMJEEE%202027%20application%20support"><strong>Email Admissions</strong><span>admissions.india@srmist.edu.in ↗</span></a><a href="tel:+918069087000"><strong>Call the helpdesk</strong><span>080 6908 7000 ↗</span></a><Link href={routes.parents.href}><strong>Information for parents</strong><span>Fees, housing and support →</span></Link></div>
    </section>
  </article><SiteFooter /></>;
}
