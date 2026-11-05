import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProspectusHeading } from "@/components/ProspectusHeading";
import { Guide } from "@/components/Guide";
import { GuideContents } from "@/components/GuideContents";
import { SiteFooter } from "@/components/SiteFooter";
import { routes } from "@/lib/navigation";
import { application, applyBtech, university, type Course } from "@/features/explore/academic";
import "./admissions.css";

const internationalApplication = "https://intlapplications.srmist.edu.in/international-application-form-2027";
const sections: [string, string][] = [
  ["SRMJEEE dates", "exam"],
  ["Course finder", "programme-finder"],
  ["Common questions", "faq"],
  ["Contact admissions", "enquiry"],
];

function ApplicationRoutes({ course }: { course?: Course }) {
  return <div className="admission-routes">
    <section id="apply" aria-labelledby="domestic-heading">
      <h2 id="domestic-heading">Domestic applicants</h2>
      <p>{course ? `${course.degree} · ${course.name} / ${course.campus}` : "Apply through the Indian admissions portal for your programme."}</p>
      <div className="admission-route-links">
        <a href={course ? application(course) : applyBtech}>{course ? "Open programme application" : "Apply for B.Tech / SRMJEEE"} <span aria-hidden="true">↗</span></a>
        <a href={university + "/admission-india/"}>All domestic forms <span aria-hidden="true">↗</span></a>
      </div>
      {course && <Link className="admission-course-link" href={"/programmes/" + course.id}>Review this programme’s fees and eligibility</Link>}
    </section>
    <section id="international" aria-labelledby="international-heading">
      <h2 id="international-heading">International applicants</h2>
      <p>For foreign nationals, NRIs and NRI-sponsored students.</p>
      <div className="admission-route-links">
        <a href={internationalApplication}>Apply for 2027 <span aria-hidden="true">↗</span></a>
        <a href={university + "/admission-international/"}>Check eligibility and fees <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  </div>;
}

const planningLinks = [
  { href: routes.programmes.href, label: "Browse programmes" },
  { href: routes.fees.href, label: "Compare tuition fees" },
  { href: "#programme-finder", label: "Take the course finder quiz" },
];

export function AdmissionsLayout({ classic, course, children }: {
  classic: boolean;
  course?: Course;
  children: ReactNode;
}) {
  if (classic) {
    return <div className="admissions-experience light-guide">
      <Guide title="Admissions" image="convocation"
        intro="Find your course, check the requirements and apply through SRM’s official portal."
        links={[["Domestic applications", "apply"], ["International applications", "international"], ...sections]}>
        <ApplicationRoutes course={course} />
        {children}
      </Guide>
    </div>;
  }

  return <div className="admissions-experience admissions-edit">
    <div className="guide-shell">
      <div className="guide">
        <header className="admission-cover">
          <div className="admission-cover-copy">
            <ProspectusHeading edition="admissions" parents={[routes.home]} current="Admissions">
              Admissions
            </ProspectusHeading>
            <p className="admission-intro">Choose your application route.</p>
            <ApplicationRoutes course={course} />
          </div>
          <figure className="admission-campus">
            <div className="admission-photo" data-search-surface="media">
              <Image src="/home/clubs.webp" alt="Students talking along a tree-lined walkway at SRM" fill
                sizes="(max-width: 740px) 100vw, 45vw" loading="eager" />
            </div>
            <figcaption><span>On campus at SRMIST</span><Link href={routes.campus.href}>Explore campus <span aria-hidden="true">→</span></Link></figcaption>
          </figure>
        </header>
        <nav className="admission-planning" aria-label="Programme planning">
          {planningLinks.map(({ href, label }) => <Link href={href} key={href}>{label} <span aria-hidden="true">{href.startsWith("#") ? "↓" : "→"}</span></Link>)}
        </nav>
        <div id="guide-content" tabIndex={-1} data-index>
          <GuideContents links={sections} />
          <div className="guide-body">{children}</div>
        </div>
      </div>
    </div>
    <SiteFooter />
  </div>;
}
