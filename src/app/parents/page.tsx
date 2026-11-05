import { Guide, Section, Resources } from "@/components/Guide";
import Link from "next/link";
import { routes, srm } from "@/lib/navigation";
export const metadata = { title: "Parents" };
export default function Page() {
  return (
    <Guide
      title="Parents"
      links={[
        ["Attendance and marks", "parent-portals"],
        ["Fees, housing and visits", "family-visits"],
        ["Safety and support", "family-support"],
      ]}
      image="campus"
      intro="Choose the portal for your student’s intake, or go directly to the office that can help."
    >
      <Section id="parent-portals" title="Your student’s academic records">
        <p>Choose your student’s intake to sign in for attendance and marks.
          For a faculty advisor’s number, contact the student’s department. <Link href={routes.score.href}>About SCORE</Link></p>
        <Resources
          items={[
            {
              title: "2025 batch onwards",
              note: "ParentConnect for the newer intake.",
              href: "https://parentconnect.srmist.edu.in/",
            },
            {
              title: "Earlier batches",
              note: "SRM’s legacy parent login.",
              href: "https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/parentLogin.jsp",
            },
          ]}
        />
      </Section>
      <Section id="family-visits" title="Fees, housing & visits">
        <Resources
          items={[
            {
              title: "Programme fees and eligibility",
              href: "/programmes/fees",
              note: "Check the specific campus and degree.",
            },
            {
              title: "Hostels and dining",
              href: routes.housing.href,
              note: "Compare blocks, facilities and booking guidance.",
            },
            {
              title: "Visit Kattankulathur",
              href: srm + "/visitors/",
              note: "Directions, campus maps and arrival information.",
            },
            {
              title: "Scholarships and aid",
              href: srm + "/policies/scholarship-policy/",
              note: "Read eligibility, conditions and renewal guidance.",
            },
          ]}
        />
      </Section>
      <Section id="family-support" title="Safety and support">
        <Resources
          items={[
            {
              title: "Anti-ragging support",
              note: "Reach the university’s dedicated anti-ragging committee.",
              href: srm + "/life-at-srm/anti-ragging/",
            },
            {
              title: "Anti-discrimination",
              note: "Find the separate discrimination reporting channel.",
              href: srm + "/life-at-srm/anti-discrimination/",
            },
            {
              title: "Student counselling",
              note: "Wellbeing resources and contact details.",
              href: srm + "/life-at-srm/student-counselling-services/",
            },
            {
              title: "Contact SRM",
              note: "University and admissions contacts.",
              href: srm + "/contact-us/",
            },
          ]}
        />
      </Section>
    </Guide>
  );
}
