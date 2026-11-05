import { start } from "@/features/admissions/programme-quiz/guided/flow";
import { ProgrammeQuiz } from "@/features/admissions/programme-quiz/ProgrammeQuiz";
import { Disclosure } from "@/components/Disclosure";
import Link from "next/link";
import { Action, Section, Resources } from "@/components/Guide";
import {
  courses,
  applyBtech,
  application,
  university,
} from "@/features/explore/academic";
import { AdmissionsLayout, internationalAdmissions, internationalApplication } from "./AdmissionsLayout";
import Enquiry from "@/features/explore/Enquiry";
import "@/components/light-guide.css";
export const metadata = { title: "Admissions" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ course?: string; view?: string }>;
}) {
  const { course, view } = await searchParams;
  const selected = courses.find((c) => c.id === course);
  return (
    <AdmissionsLayout classic={view === "classic"}>
      <Section id="programme-finder" title="Which SRM programme fits your interests?">
        <ProgrammeQuiz initial={start()} />
      </Section>
      <Section
        id="apply"
        title={selected ? "Domestic application for your programme" : "Domestic applications"}
      >
        {selected && (
          <p>
            <strong>
              {selected.degree} · {selected.name}
            </strong>{" "}
            / {selected.campus}
          </p>
        )}
        <div className="action-row">
          <Action href={selected ? application(selected) : applyBtech}>
            {selected
              ? "Official application route"
              : "Apply for B.Tech / SRMJEEE"}
          </Action>
          <Action
            href={selected ? "/programmes/" + selected.id : "/programmes"}
          >
            {selected ? "Review fees & eligibility" : "Explore courses & fees"}
          </Action>
          <a href={university + "/admission-india/"}>
            All domestic application forms ↗
          </a>
        </div>
      </Section>
      <Section id="international" title="International applications">
        <p>Applying as a foreign national, NRI or NRI-sponsored student? Start with SRM’s international admissions portal. Check the applicant category and programme requirements before you register.</p>
        <div className="action-row">
          <Action href={internationalApplication}>Start the 2027 international application</Action>
          <a href={internationalAdmissions}>Eligibility, programmes and fees ↗</a>
        </div>
        <p className="source-note">For help choosing your category, email International Relations at{" "}
          <a href="mailto:admissions.ir@srmist.edu.in">admissions.ir@srmist.edu.in</a>.
        </p>
      </Section>
      <Section id="exam" title="SRMJEEE 2027">
        <p>
          B.Tech and integrated M.Tech entrance examination. SRM lists two
          tentative phases for its centre-based computer test.
        </p>
        <div className="phase-grid">
          {[
            ["Phase 1", "2 April 2027", "17–18 April 2027"],
            ["Phase 2", "4 June 2027", "19–20 June 2027"],
          ].map(([phase, deadline, date]) => (
            <article key={phase}>
              <small>{phase}</small>
              <h3>{date}</h3>
              <p>
                Application deadline <strong>{deadline}</strong>
              </p>
            </article>
          ))}
        </div>
        <p className="source-note">
          Dates may change.{" "}
          <a href={applyBtech}>Check the official schedule and apply ↗</a>
        </p>
      </Section>
      <Section id="faq" title="Admissions questions">
        <Disclosure summary="What are the B.Tech entry requirements?" open>
          <p>
            For the regular domestic route, SRM lists 60% aggregate across
            Physics, Mathematics and an approved third subject in 10+2.
            Biomedical, biotechnology and genetic engineering have additional
            subject combinations. Check the requirements for your chosen branch.
          </p>
          <a href={university + "/admission-india/engineering/"}>
            Read the eligibility rules ↗
          </a>
        </Disclosure>
        <Disclosure summary="How much does it cost to apply?">
          <p>
            The official 2027 B.Tech form lists a non-refundable ₹1,400 fee per
            SRMJEEE phase. Tuition depends on the programme and campus.
          </p>
        </Disclosure>
        <Disclosure summary="Does my course use SRMJEEE?">
          <p>
            SRMJEEE is the engineering entrance route. Law, medicine, management
            and other degrees have their own selection rules and forms.
          </p>
          <Link href="/programmes">Look up your course</Link>
        </Disclosure>
        <Disclosure summary="Where do I find scholarships or international admissions?">
          <p>
            <a href={university + "/admission-india/engineering/scholarships/"}>
              Scholarships and aid
            </a>{" "}
            ·{" "}
            <a href="#international">
              International applicants
            </a>
          </p>
        </Disclosure>
      </Section>
      <Section id="enquiry" title="Ask admissions">
        <p>For an international application, <a href="mailto:admissions.ir@srmist.edu.in">email International Relations</a>. For a domestic enquiry, prepare your email below.</p>
        <Enquiry
          context={
            selected
              ? selected.degree +
                " · " +
                selected.name +
                " / " +
                selected.campus
              : "General admissions"
          }
          courseId={selected?.id}
        />
      </Section>
      <Resources
        items={[
          {
            href: "/parents",
            title: "For parents",
            note: "Portal access, fees, housing and student support.",
          },
        ]}
      />
    </AdmissionsLayout>
  );
}
