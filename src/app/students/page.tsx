import { Guide, Section, Action, Resources } from "@/components/Guide";
export const metadata = { title: "Students" };
export default function Page() {
  return (
    <Guide
      section="Students"
      title="Students"
      image="students"
      intro="Go straight to attendance, fees, campus Wi-Fi or support."
      links={[
        ["Academic portals", "portals"],
        ["Wi-Fi & IT", "wifi"],
        ["SCORE", "score"],
      ]}
    >
      <Section id="portals" title="Your academic portals">
        <Resources
          items={[
            {
              title: "Academia · attendance, marks & registration",
              note: "SRM directs second-, third- and final-year B.Tech students at Kattankulathur here.",
              href: "https://academia.srmist.edu.in/",
            },
            {
              title: "Student Information Portal",
              note: "Engineering and Technology student services, fee payments and certificates.",
              href: "https://sp.srmist.edu.in/",
            },
            {
              title: "StudentConnect",
              note: "From the 2025 batch for Medicine & Health Sciences, Law, Management and Science & Humanities, excluding PhD.",
              href: "https://studentconnect.srmist.edu.in/",
            },
            {
              title: "Exams & results",
              note: "Find the Controller of Examinations, notices and results.",
              href: "https://www.srmist.edu.in/controller-of-examinations/",
            },
            {
              title: "Academic calendar",
              note: "Engineering and Technology · 2026–27 UG and PG schedules.",
              href: "https://www.srmist.edu.in/students/cet-academic-schedule-2026-2027-ug-pg/",
            },
            {
              title: "Career Centre",
              note: "Placement figures, training and contacts.",
              href: "/career-centre",
            },
          ]}
        />
      </Section>
      <Section id="wifi" title="Wi-Fi & IT help">
        <p>
          Join the campus network first. If the sign-in screen doesn’t open,
          choose the portal for your location.
        </p>
        <Resources
          items={[
            {
              title: "IAC Connect · academic blocks",
              note: "Open the campus Wi-Fi sign-in page.",
              href: "https://iac.srmist.edu.in/Connect",
            },
            {
              title: "Hostel Wi-Fi sign-in",
              note: "Use the hostel network access page.",
              href: "https://iach.srmist.edu.in/connect",
            },
            {
              title: "ITKM service desk",
              note: "Report a connection or account problem.",
              href: "https://sd.srmist.edu.in/",
            },
            {
              title: "Reset NetID password",
              note: "Recover your SRM account access.",
              href: "https://ssp.srmist.edu.in/",
            },
          ]}
        />
      </Section>
      <Section id="score" title="SCORE">
        <div className="spotlight">
          <small>Student project · in development</small>
          <h3>A fresh take on SCOPE.</h3>
          <p>
            Our team is building SCORE as a more intuitive alternative to the
            SCOPE app. While we develop it, your official academic records are
            available through SRM’s student portals.
          </p>
          <Action href="https://academia.srmist.edu.in/">Open Academia</Action>
        </div>
      </Section>
      <Resources
        items={[
          {
            title: "Clubs and hostels",
            note: "Find a student community or accommodation.",
            href: "/campus",
          },
          {
            title: "Library",
            note: "Catalogue, digital library and opening hours.",
            href: "https://www.srmist.edu.in/library/",
          },
          {
            title: "Campus events",
            note: "Browse the university calendar.",
            href: "/events",
          },
          {
            title: "Counselling",
            note: "Contact SRM student counselling services.",
            href: "https://www.srmist.edu.in/life-at-srm/student-counselling-services/",
          },
        ]}
      />
    </Guide>
  );
}
