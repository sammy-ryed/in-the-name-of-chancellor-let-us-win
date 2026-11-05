import { Guide, Section, Resources } from "@/components/Guide";
const s = "https://www.srmist.edu.in";
export const metadata = { title: "Parents" };
export default function Page() {
  return (
    <Guide
      title="Parents"
      image="campus"
      intro="Choose the portal for your student’s intake, or go directly to the office that can help."
    >
      <Section title="Choose your parent portal">
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
      <Section title="Fees, housing & visits">
        <Resources
          items={[
            {
              title: "Programme fees and eligibility",
              href: "/programmes",
              note: "Check the specific campus and degree.",
            },
            {
              title: "Hostels and dining",
              href: "/campus#housing",
              note: "Compare blocks, facilities and booking guidance.",
            },
            {
              title: "Visit Kattankulathur",
              href: s + "/visitors/",
              note: "Directions, campus maps and arrival information.",
            },
            {
              title: "Scholarships and aid",
              href: s + "/policies/scholarship-policy/",
              note: "Read eligibility, conditions and renewal guidance.",
            },
          ]}
        />
      </Section>
      <Section title="Safety and support">
        <Resources
          items={[
            {
              title: "Anti-ragging support",
              note: "Reach the university’s dedicated anti-ragging committee.",
              href: s + "/life-at-srm/anti-ragging/",
            },
            {
              title: "Anti-discrimination",
              note: "Find the separate discrimination reporting channel.",
              href: s + "/life-at-srm/anti-discrimination/",
            },
            {
              title: "Student counselling",
              note: "Wellbeing resources and contact details.",
              href: s + "/life-at-srm/student-counselling-services/",
            },
            {
              title: "Contact SRM",
              note: "University and admissions contacts.",
              href: s + "/contact-us/",
            },
          ]}
        />
      </Section>
    </Guide>
  );
}
