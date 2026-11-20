import { applyIncubation } from "@/features/dei/data";
import { FundingCards } from "@/features/dei/FundingCards";
import { JourneyAccordion } from "@/features/dei/JourneyAccordion";
import { PartnerMarquee } from "@/features/dei/PartnerMarquee";
import { StartupShowcase } from "@/features/dei/StartupShowcase";
import { DeiAction, DeiCallToAction, DeiHero, DeiSection } from "@/features/dei/ui";

export const metadata = {
  title: "Startups: incubation and funding",
  description: "Apply for incubation through BRC, find seed funding from NewGen IEDC and SISFS, and see the startups DEI supports.",
};

export default function DeiStartups() {
  return (
    <>
      <DeiHero
        current="Startups"
        title="Your startup,"
        accent="backed"
        lead="Workspace, mentors, funding and investors. One application."
        image="/dei/photos/startup-workspace.jpg"
        alt="Founders working on laptops in a busy shared startup workspace"
        credit={{ text: "Photo: Ann0611, CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Toong_Coworking_Space_in_Hanoi.jpg" }}
      >
        <DeiAction href={applyIncubation}>Apply for incubation</DeiAction>
        <DeiAction href="#funding" quiet>Funding programmes</DeiAction>
      </DeiHero>

      <DeiSection id="portfolio" tone="pale" title="Our" accent="startups">
        <StartupShowcase />
      </DeiSection>

      <DeiSection id="incubation" tone="navy" title="Idea to" accent="launch">
        <JourneyAccordion />
      </DeiSection>

      <DeiSection id="funding" title="Funding" accent="programmes">
        <FundingCards />
      </DeiSection>

      <DeiSection id="partners" tone="pale" title="Partners &" accent="networks">
        <PartnerMarquee />
      </DeiSection>

      <DeiCallToAction />
    </>
  );
}
