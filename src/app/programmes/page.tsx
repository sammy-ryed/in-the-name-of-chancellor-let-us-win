import Link from "next/link";
import { Guide, Resources, Section } from "@/components/Guide";
import {
  courses,
  faculties,
  price,
  university,
} from "@/features/explore/academic";
import Finder from "@/features/explore/Finder";
export const metadata = { title: "Programmes" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ faculty?: string }>;
}) {
  const requested = (await searchParams).faculty;
  const activeFaculty =
    typeof requested === "string" && Object.hasOwn(faculties, requested)
      ? requested
      : "";
  const totals = new Map<string, number>();
  for (const course of courses)
    totals.set(course.faculty, (totals.get(course.faculty) ?? 0) + 1);
  return (
    <Guide
      title="Programmes"
      section="Programmes"
      image="research"
      intro="Choose a field, compare campuses and see what it costs to study there."
      links={[
        ["Course finder", "finder"],
        ["Faculties", "faculties"],
        ["More study routes", "study-routes"],
      ]}
    >
      <Section id="faculties" title="Faculties & fields of study">
        <p className="faculty-intro">
          Start with a subject. Each faculty lists its degrees, campuses and
          published fees.
        </p>
        <div className="faculty-directory">
          {Object.entries(faculties).map(([key, name]) => (
            <Link
              key={key}
              href={
                "/programmes?faculty=" + encodeURIComponent(key) + "#finder"
              }
            >
              <strong>{name}</strong>
              <small>{totals.get(key) ?? 0} listings</small>
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </Section>
      <Section id="finder" title="Find your programme">
        <Finder
          key={activeFaculty}
          initialFaculty={activeFaculty}
          faculties={faculties}
          records={courses.map((c) => ({
            id: c.id,
            name: c.name,
            degree: c.degree,
            faculty: c.faculty,
            campus: c.campus,
            level: c.level,
            duration: c.duration,
            fee: price(c.fee),
            period: c.period,
          }))}
        />
        <p className="source-note">
          Domestic fee listings checked 5 November 2026. Open a programme for
          fee conditions and the official faculty source.
        </p>
      </Section>
      <Section id="study-routes" title="More ways to study">
        <Resources
          items={[
            {
              title: "Online education",
              href: "https://www.srmonline.in/",
              note: "Explore online programmes and their separate admission routes.",
            },
            {
              title: "Distance education",
              href: "https://www.srmistdistanceeducation.in/",
              note: "Find distance-learning degrees and enrolment details.",
            },
            {
              title: "International admissions",
              href: university + "/admission-international/",
              note: "Find the application and fee information for international applicants.",
            },
            {
              title: "Departments and research",
              href: university + "/departments/",
              note: "Explore the department behind a programme.",
            },
          ]}
        />
      </Section>
    </Guide>
  );
}
