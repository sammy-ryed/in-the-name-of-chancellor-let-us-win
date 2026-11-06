import Link from "next/link";
import { admissionsEmails } from "@/features/admissions/contact";
import { start } from "@/features/admissions/programme-quiz/guided/flow";
import { ProgrammeQuiz } from "@/features/admissions/programme-quiz/ProgrammeQuiz";
import { Disclosure } from "@/components/Disclosure";
import { Section, Resources } from "@/components/Guide";
import { courses, applyBtech, university } from "@/features/explore/academic";
import { routes } from "@/lib/navigation";
import Enquiry from "@/features/explore/Enquiry";
import { AdmissionsLayout } from "./AdmissionsLayout";
import { InitialSectionScroll } from "./InitialSectionScroll";
import "@/components/light-guide.css";

export const metadata = {
  title: "Admissions",
  description: "Find your SRMIST application, check SRMJEEE deadlines, compare fees and ask the admissions team about your programme.",
};

const examPhases = [
  { name: "Phase 1", applyBy: "2 April", deadline: "2027-04-02", exams: "17–18 April" },
  { name: "Phase 2", applyBy: "4 June", deadline: "2027-06-04", exams: "19–20 June" },
];

export default async function AdmissionsPage({ searchParams }: {
  searchParams: Promise<{ course?: string; view?: string }>;
}) {
  const { course, view } = await searchParams;
  const selected = courses.find((item) => item.id === course);
  return (
    <AdmissionsLayout classic={view === "classic"} course={selected}>
      <InitialSectionScroll />
      <Section id="exam" title="SRMJEEE 2027 dates">
        <p>Applying for B.Tech or integrated M.Tech? Check the application deadline and exam window for each phase of the centre-based test.</p>
        <table className="admission-dates">
          <caption>Tentative schedule for 2027</caption>
          <thead><tr><th scope="col">Phase</th><th scope="col">Apply by</th><th scope="col">Exam dates</th></tr></thead>
          <tbody>{examPhases.map((phase) => <tr key={phase.name}>
            <th scope="row">{phase.name}</th>
            <td><time dateTime={phase.deadline}>{phase.applyBy}</time></td>
            <td>{phase.exams}</td>
          </tr>)}</tbody>
        </table>
        <p className="source-note">Dates may change. <a href={applyBtech}>Confirm the schedule with SRM <span aria-hidden="true">↗</span></a></p>
      </Section>
      <Section id="programme-finder" title={<>Find a course <em>that fits</em></>}>
        <p>Tell us what you enjoy studying. The course finder builds a shortlist you can explore by campus, cost and entry requirements.</p>
        <ProgrammeQuiz initial={start()} />
        <noscript><p><Link href={routes.programmes.href}>Browse programmes by subject and campus</Link>.</p></noscript>
      </Section>
      <Section id="faq" title="Before you apply">
        <Disclosure summary="What are the B.Tech entry requirements?">
          <p>For the regular domestic route, SRM lists a 60% aggregate across Physics, Mathematics and an approved third subject in 10+2. Biomedical, biotechnology and genetic engineering have additional subject combinations.</p>
          <a href={university + "/admission-india/engineering/"}>Check the requirements for your branch ↗</a>
        </Disclosure>
        <Disclosure summary="How much does the B.Tech application cost?">
          <p>The 2027 B.Tech application fee is ₹1,400 per SRMJEEE phase and is non-refundable. <Link href={routes.fees.href}>Compare tuition fees</Link> for your programme and campus.</p>
        </Disclosure>
        <Disclosure summary="Does my course use SRMJEEE?">
          <p>SRMJEEE is the engineering entrance route. Law, medicine, management and other degrees have their own selection rules and forms.</p>
          <Link href={routes.programmes.href}>Look up your course</Link>
        </Disclosure>
        <Disclosure summary="Where can I check scholarship eligibility?">
          <p>SRM lists its engineering scholarships and the criteria for each award on the <a href={university + "/admission-india/engineering/scholarships/"}>scholarships and aid page ↗</a>.</p>
        </Disclosure>
      </Section>
      <Section id="enquiry" title="Contact admissions">
        <p>For an international application or a question about your applicant category, <a href={`mailto:${admissionsEmails.international}`}>email International Relations</a>. For a domestic application, contact the Indian admissions team.</p>
        <Enquiry key={selected?.id ?? "general"} context={selected ? `${selected.degree} · ${selected.name} / ${selected.campus}` : "General admissions"} courseId={selected?.id} />
      </Section>
      <Resources items={[{ href: routes.parents.href, title: "For parents", note: "Portal access, fees, housing and student support." }]} />
    </AdmissionsLayout>
  );
}
