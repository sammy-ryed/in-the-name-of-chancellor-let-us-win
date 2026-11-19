import { Picker, Section, pageStyles as s } from "@/features/dei/blocks";
import { LabChapters } from "@/features/dei/LabChapters";
import { DeiAction, DeiCallToAction, DeiHero } from "@/features/dei/ui";

export const metadata = {
  title: "Labs and facilities",
  description: "FabLab for prototyping, BioNEST for biotech startups, CIAP for patents and the Technology Transfer Office at SRM DEI.",
};

export default function DeiFacilities() {
  return (
    <div className={s.page}>
      <DeiHero
        current="Facilities"
        title="Labs and"
        accent="facilities"
        lead="Four labs at SRM to build prototypes, run biotech experiments, file patents and license technology."
        image="/home/innovation.webp"
        alt="Machines and workbenches in an SRM innovation workshop"
      >
        <DeiAction href="#need">Find the right lab</DeiAction>
      </DeiHero>

      <Section id="need" title="What do you need?">
        <Picker items={[
          { task: "Build a prototype", dest: "FabLab", href: "#fablab" },
          { task: "Run biotech or medtech experiments", dest: "BioNEST", href: "#bionest" },
          { task: "Patent my idea", dest: "CIAP", href: "#ciap" },
          { task: "License SRM research or start a spin-off", dest: "Technology Transfer", href: "#tto" },
        ]} />
      </Section>

      <LabChapters />
      <DeiCallToAction />
    </div>
  );
}
