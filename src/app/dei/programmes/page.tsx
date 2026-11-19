import { dei } from "@/features/dei/data";
import { Features, Picker, Rows, Section, pageStyles as s, type Feature } from "@/features/dei/blocks";
import { DeiAction, DeiCallToAction, DeiHero } from "@/features/dei/ui";

export const metadata = {
  title: "Programmes and courses",
  description: "Minors in Entrepreneurship and Design Innovation and in BioDesign and Innovation, the Design Thinking course and bootcamps at SRMIST.",
};

const programmes: Feature[] = [
  {
    id: "minor-edi", eyebrow: "Minor · Undergraduate", title: "Minor in Entrepreneurship and Design Innovation",
    text: "Learn to spot problems, build products and start a company, using the Berkeley Method of Entrepreneurship.",
    image: "/home/developer.webp", alt: "An SRM student at a technology event",
    facts: [
      { label: "For", value: "SRMIST undergraduates" },
      { label: "Entry", value: "CGPA 7.0 or above" },
      { label: "Method", value: "Berkeley Method of Entrepreneurship" },
    ],
    actions: [{ label: "Course details", href: `${dei}/courses`, kind: "dark" }],
  },
  {
    id: "minor-bdi", eyebrow: "Minor · UG and PG", title: "Minor in BioDesign and Innovation",
    text: "A fast, project-based minor for students who want to build technology that improves healthcare.",
    image: "/research/nano.webp", alt: "Researchers working with lab equipment at SRM",
    facts: [
      { label: "For", value: "Undergraduate and postgraduate students" },
      { label: "Entry", value: "CGPA 7.0 or above" },
      { label: "Format", value: "Project-based, healthcare focus" },
    ],
    actions: [{ label: "Course details", href: `${dei}/courses`, kind: "dark" }],
  },
  {
    id: "design-thinking", eyebrow: "Course · UG and PG", title: "Design Thinking",
    text: "Solve real problems the human-centred way: empathise, prototype, test and iterate.",
    image: "/dei/photos/initiative-workshops.jpg", alt: "Students at a session in the DEI innovation space",
    badge: { value: "6,000+", label: "students completed" },
    facts: [
      { label: "For", value: "All UG and PG students" },
      { label: "Type", value: "Core, elective or optional" },
      { label: "You learn", value: "Empathy, prototyping, iteration" },
    ],
    actions: [{ label: "Course details", href: `${dei}/design-thinking-course`, kind: "dark" }],
  },
  {
    id: "bootcamps", eyebrow: "Short format · Students and faculty", title: "Bootcamps",
    text: "Intensive sprints that take you from problem to pitch in days, not semesters.",
    image: "/dei/photos/bootcamp.jpg", alt: "Participants taking notes at the DEI Entrepreneurship Bootcamp",
    facts: [
      { label: "Includes", value: "Entrepreneurship Bootcamp, Design Bootcamp" },
      { label: "Also", value: "Blockchain Technology and Social Impact course" },
      { label: "Length", value: "Usually five days" },
    ],
    actions: [{ label: "See events", href: "/dei/events", kind: "dark" }],
  },
];

export default function DeiProgrammes() {
  return (
    <div className={s.page}>
      <DeiHero
        current="Programmes"
        title="Programmes"
        accent="and courses"
        lead="Minors, courses and bootcamps on entrepreneurship and design, for SRMIST students."
        image="/campus/students-hero.webp"
        alt="Four SRM students from different programmes"
      >
        <DeiAction href="#find" quiet>Find your programme</DeiAction>
      </DeiHero>

      <Section id="find" title="Which one is for you?">
        <Picker items={[
          { task: "I'm an undergrad and want to learn to start a company", dest: "Entrepreneurship minor", href: "#minor-edi" },
          { task: "I want to build healthcare technology", dest: "BioDesign minor", href: "#minor-bdi" },
          { task: "I want a course on solving real problems", dest: "Design Thinking", href: "#design-thinking" },
          { task: "I want a short, intensive start", dest: "Bootcamps", href: "#bootcamps" },
        ]} />
      </Section>

      <Section title="All programmes" tone="pale">
        <Features items={programmes} />
      </Section>

      <Section id="minors" title="Minor eligibility">
        <Rows cols={2} items={[
          { title: "When", detail: "Take the minor alongside your major degree, not after it." },
          { title: "Grades", detail: "You need a CGPA of 7.0 or above when you join." },
          { title: "Who runs it", detail: "SRM Innovation and Design Centre (SIDC), part of DEI." },
        ]} />
      </Section>

      <DeiCallToAction />
    </div>
  );
}
