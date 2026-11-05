import { Guide, Section } from "@/components/Guide";
import Finder from "@/features/explore/Finder";
import { courses, faculties, price } from "@/features/explore/academic";

export const metadata = { title: "Programme fees & eligibility" };
const listings = courses.map(({ id, name, degree, faculty, campus, level, duration, fee, period }) => ({
  id, name, degree, faculty, campus, level, duration, fee: price(fee), period,
}));

export default function FeesPage() {
  return (
    <Guide title="Programme fees & eligibility" image="research"
      intro="Compare fees by campus, then open a programme for entry requirements and its application route."
      links={[["Compare fees", "fees"]]}>
      <Section id="fees" title="Compare programmes">
        <Finder initialFaculty="" records={listings} faculties={faculties} />
      </Section>
    </Guide>
  );
}
