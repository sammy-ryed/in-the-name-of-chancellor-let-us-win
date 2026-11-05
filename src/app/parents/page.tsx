import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Disclosure } from "@/components/Disclosure";
import { SrmCrest } from "@/components/HomeLogo";
import { SiteFooter } from "@/components/SiteFooter";
import { routes, srm } from "@/lib/navigation";
import styles from "./parents.module.css";

export const metadata = {
  title: "Parents & families",
  description: "Open the SRM parent portal for your student's intake, find academic records and get help with fees, visits and campus life.",
};

const parentGateway = srm + "/parents/";
const portals = [
  { label: "2025 batch onwards", service: "ParentConnect", href: "https://parentconnect.srmist.edu.in/" },
  { label: "Before the 2025 batch", service: "Parent Portal", href: "https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/parentLogin.jsp" },
];

const portalGuide = [
  { title: "Set up your first login", body: "Use the parent or guardian email registered during enrolment. On the ParentConnect sign-in screen, choose “Forgot Password” to receive the setup email." },
  { title: "Check attendance and marks", body: "Open Course beside your student’s name. Choose Attendance for the course-by-course record or Marks for examination marks." },
  { title: "Find the faculty advisor (FA)", body: "Check the student dashboard for an assigned mentor or class coordinator. If the contact is missing, ask the department for your student’s FA. Have their registration number, programme and section ready.", link: { label: "Search the SRM staff directory", href: srm + "/faculty/" } },
  { title: "Find a fee receipt", body: "Open Fees beside your student’s name. Choose Online Payment Receipt for a past payment, or Academic Fees and Hostel Fees to review those charges separately." },
];
type Resource = { title: string; note: string; href: string };
const planning: Resource[] = [
  { title: "Tuition & eligibility", note: "Compare published programme fees by campus.", href: routes.fees.href },
  { title: "Hostel & dining", note: "Explore rooms, meals and booking guidance.", href: routes.housing.href },
  { title: "Examination notices", note: "Check announcements from the Controller of Examinations.", href: srm + "/controller-of-examinations/" },
  { title: "Visit Kattankulathur", note: "Find the campus address and directions for your visit.", href: srm + "/visitors/" },
  { title: "Campus transport", note: "Find SRM transport information and bus routes.", href: srm + "/transport-facility/" },
  { title: "Scholarships", note: "Review SRM’s scholarship eligibility and renewal policy.", href: srm + "/policies/scholarship-policy/" },
];
const support: Resource[] = [
  { title: "Hostel office", note: "Contact campus life about accommodation or a residential concern.", href: srm + "/srm-hostels/#hostels-contact" },
  { title: "Student counselling", note: "Find the student counselling service and its contact details.", href: srm + "/life-at-srm/student-counselling-services/" },
  { title: "Anti-ragging", note: "Reach SRM’s anti-ragging committee.", href: srm + "/life-at-srm/anti-ragging/" },
  { title: "Anti-discrimination", note: "Find the right office to report discrimination.", href: srm + "/life-at-srm/anti-discrimination/" },
];

function ResourceList({ items }: { items: Resource[] }) {
  return <ul className={styles.list}>
    {items.map(({ title, note, href }) => <li key={href}>
      <Link href={href}><strong>{title}</strong><span aria-hidden="true">{href.startsWith("/") ? "→" : "↗"}</span><small>{note}</small></Link>
    </li>)}
  </ul>;
}

export default function ParentsPage() {
  return <>
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <Breadcrumbs className={styles.crumb} parents={[routes.home]} current="Parents" />
            <h1>Parents <em>&amp; families.</em></h1>
            <p>Check how your student is doing, plan a campus visit or find someone at SRM to talk to.</p>
            <a className={styles.heroLink} href="#parent-portals">Find your parent portal <span aria-hidden="true">↓</span></a>
          </div>
          <figure className={styles.postcard}>
            {/* Photograph from SRMIST’s official Parents page. */}
            <Image src="/parents/tech-park-panorama.webp" alt="The white towers and colourful facade of SRM Tech Park, with green hills behind the campus" width={868} height={446} loading="eager"
              sizes="(max-width: 700px) 88vw, (max-width: 1300px) 43vw, 570px" />
            <figcaption><span>Tech Park, Kattankulathur</span><SrmCrest /></figcaption>
          </figure>
        </div>
      </header>
      <div className={styles.body}>
        <section id="parent-portals" className={styles.portals}>
          <div><h2>Parent sign-in</h2><p>Choose the year your student joined SRM.</p></div>
          <div className={styles.portalGroup}>
            {portals.map(({label, service, href}) => <a href={href} key={href}><strong>{label}</strong><small>{service}</small><span aria-hidden="true">↗</span></a>)}
            <a className={styles.alternate} href={parentGateway}>Portal help &amp; mobile app links <span aria-hidden="true">↗</span></a>
          </div>
        </section>
        <section className={styles.spread} aria-labelledby="records">
          <div><h2 id="records">Using ParentConnect</h2>
            <p>A quick guide to the 2025-onwards portal.</p>
            <Link href={routes.score.href}>About the SCORE project <span aria-hidden="true">→</span></Link>
          </div>
          <div className={styles.faqs}>
            {portalGuide.map(({title,body,link}) => <Disclosure key={title} summary={title}><p>{body}</p>{link && <a href={link.href}>{link.label} ↗</a>}</Disclosure>)}
          </div>
        </section>
        <section id="family-visits" className={styles.spread}><div><h2>Plan the semester</h2>
          <p>Money, travel and the practical details of life on campus.</p></div><ResourceList items={planning} /></section>
        <section id="family-support" className={styles.spread}><div><h2>Talk to someone</h2>
          <p>For a general enquiry, start with the SRM Information Centre.</p>
          <a className={styles.phone} href="tel:+914427455510">044 2745 5510</a>
          <a href={srm + "/contact-us/"}>University contacts <span aria-hidden="true">↗</span></a>
        </div><ResourceList items={support} /></section>
      </div>
    </div>
    <SiteFooter />
  </>;
}
