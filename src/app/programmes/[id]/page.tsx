import { Disclosure } from "@/components/Disclosure";
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

// The catalogue ships with the app. Reject unknown IDs before a loading boundary can stream a 200.
export const dynamicParams = false;
export function generateStaticParams() {
  return courses.map(({ id }) => ({ id }));
}
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
        <Disclosure summary="What does this fee cover?" open>
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
        </Disclosure>
        <Disclosure summary="Am I eligible to apply?" open>
          <p>{criteria(c)}</p>
          <a href={source(c)}>Full eligibility and selection rules ↗</a>
        </Disclosure>
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
