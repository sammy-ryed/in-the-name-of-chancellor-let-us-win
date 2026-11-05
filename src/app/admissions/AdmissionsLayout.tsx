import type { ReactNode } from "react";
import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Guide } from "@/components/Guide";
import { GuideContents } from "@/components/GuideContents";
import { SiteFooter } from "@/components/SiteFooter";
import "./admissions.css";

export const internationalAdmissions = "https://www.srmist.edu.in/admission-international/";
export const internationalApplication = "https://intlapplications.srmist.edu.in/international-application-form-2027";

const sections: [string, string][] = [
  ["Take the programme quiz", "programme-finder"],
  ["Domestic applications", "apply"],
  ["International applications", "international"],
  ["SRMJEEE dates", "exam"],
  ["FAQs", "faq"],
  ["Ask admissions", "enquiry"],
];
const intro = "Find your course, check the requirements and apply through SRM’s official portal.";

export function AdmissionsLayout({ classic, children }: { classic: boolean; children: ReactNode }) {
  if (classic) {
    return <div className="admissions-experience light-guide">
      <Guide title="Admissions" image="convocation" intro={intro} links={sections}>{children}</Guide>
    </div>;
  }
  return <div className="admissions-experience light-guide admissions-edit">
    <div className="guide-shell">
      <div className="guide">
        <header className="admission-cover">
          <Image src="/campus/students-hero.webp" alt="" fill priority sizes="100vw" unoptimized />
          <div className="admission-cover-copy">
            <Breadcrumbs className="admission-crumb" parents={[{ href: "/", label: "Home" }]} current="Admissions" />
            <h1>Admissions</h1>
            <p>Choose your application route.</p>
            <div className="admission-routes">
              <a href="#apply">Domestic applications <span aria-hidden="true">↓</span></a>
              <a href="#international">International applications <span aria-hidden="true">↓</span></a>
            </div>
            <a className="admission-quiz-link" href="#programme-finder">Take the programme quiz <span aria-hidden="true">→</span></a>
          </div>
        </header>
        <div id="guide-content" tabIndex={-1} data-index>
          <GuideContents links={sections} />
          <div className="guide-body">{children}</div>
        </div>
      </div>
    </div>
    <SiteFooter />
  </div>;
}
