import { Guide, Section, Resources } from "@/components/Guide";
const s = "https://www.srmist.edu.in";
export const metadata = { title: "Placements & career support" };
export default function Page() {
  return (
    <Guide
      title="Career Centre"
      image="convocation"
      intro="Prepare for placement, read the published outcomes and reach the placement team."
      links={[
        ["Placement figures", "outcomes"],
        ["Training & contacts", "support"],
      ]}
    >
      <Section id="outcomes" title="Placement figures">
        <p>
          University-reported totals. One student can receive several offers.
          These figures do not give a placement rate for a particular course.
        </p>
        <div className="table-wrap">
          <table>
            <caption>SRMIST placement outcomes by graduating batch</caption>
            <thead>
              <tr>
                <th scope="col">Measure</th>
                <th scope="col">2023 batch</th>
                <th scope="col">2025 batch</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Offers", "13,069", "10,190+"],
                ["High-paying offers", "3,970", "4,346+"],
                ["Highest annual pay", "₹1 crore", "₹61 lakh CTC"],
                ["Average annual pay", "₹10.5 lakh", "₹6.5 lakh CTC"],
              ].map(([m, a, b]) => (
                <tr key={m}>
                  <th scope="row">{m}</th>
                  <td>{a}</td>
                  <td>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="source-note">
          2023 figures:{" "}
          <a href="https://webstor.srmist.edu.in/web_assets/downloads/2024/srmist-university-brochure-2024-25.pdf">
            university brochure, p. 25
          </a>
          . 2025 figures:{" "}
          <a href={s + "/career-centre/"}>Career Centre, as of 12 June 2026</a>.
          CTC means cost to company. The sources do not specify the same
          threshold for high-paying offers or a campus breakdown.
        </p>
      </Section>
      <Section id="support" title="Training & contacts">
        <Resources
          items={[
            {
              title: "Placement preparation",
              href: s + "/placements/activities/",
              note: "Training, pre-placement activities and career development.",
            },
            {
              title: "Contact the placement team",
              href: s + "/placements/leadership-contact/",
              note: "Student placement queries and recruiter enquiries.",
            },
            {
              title: "Student placement dashboard",
              href: "https://sp.srmist.edu.in/",
              note: "Sign in for your cohort’s company and eligibility information.",
            },
            {
              title: "Work at SRM",
              href: "https://careers.srmist.edu.in/careerportal/careerportal/loginManager/applyJobs.jsp",
              note: "University staff vacancies and faculty recruitment.",
            },
          ]}
        />
      </Section>
    </Guide>
  );
}
