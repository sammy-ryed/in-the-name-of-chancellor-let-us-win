import { Guide, Resources, Section } from "@/components/Guide";
import {
  courses,
  faculties,
  price,
  university,
} from "@/features/explore/academic";
import Finder from "@/features/explore/Finder";
export const metadata = { title: "Programmes" };
export default function Page() {
  return (
    <Guide
      title="Programmes"
      section="Programmes"
      image="research"
      intro="Choose a field, compare campuses and see what it costs to study there."
      links={[
        ["Course finder", "finder"],
        ["More study routes", "study-routes"],
      ]}
    >
      <Section id="finder" title="Find your programme">
        <Finder
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
