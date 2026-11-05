import Link from "next/link";
import { notFound } from "next/navigation";
import { Guide, Section, Action } from "@/components/Guide";
import {
  courses,
  faculties,
  price,
  criteria,
  source,
  application,
} from "@/features/explore/academic";
export const metadata = { title: "Programme details" };
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = courses.find((c) => c.id === id);
  if (!c) notFound();
  return (
    <Guide
      section="Programmes"
      title={c.name}
      intro={c.degree + " · " + c.campus + " · " + faculties[c.faculty]}
      image="research"
    >
      <div className="facts">
        {[
          [c.period, price(c.fee)],
          ["Duration", c.duration],
          ["Study level", c.level],
          ["Approved intake", c.intake],
        ].map(([k, v]) => (
          <div key={k}>
            <small>{k}</small>
            <strong>{v || "Check faculty listing"}</strong>
          </div>
        ))}
      </div>
      <Section title="Fees & eligibility">
        <details open>
          <summary>What does this fee cover?</summary>
          <p>
            {c.period}: {price(c.fee)}.{" "}
            {c.notes ||
              "Check the faculty schedule for registration, examination and other charges. Hostel and dining costs are listed separately."}
          </p>
          <p>
            Fee listing checked 5 November 2026. Confirm the applicable intake
            and amounts before payment.
          </p>
          <a href={source(c)}>Official fee schedule ↗</a>
        </details>
        <details open>
          <summary>Am I eligible to apply?</summary>
          <p>{criteria(c)}</p>
          <a href={source(c)}>Full eligibility and selection rules ↗</a>
        </details>
        <div className="action-row">
          <Action href={application(c)}>
            {application(c) === source(c)
              ? "See official application routes"
              : "Open official application"}
          </Action>
          <Action href={"/admissions?course=" + c.id + "#enquiry"}>
            Ask about this course
          </Action>
          <Link href="/programmes">Back to programmes</Link>
        </div>
      </Section>
    </Guide>
  );
}
