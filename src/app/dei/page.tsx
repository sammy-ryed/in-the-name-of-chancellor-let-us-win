import { applyIncubation, deiRoutes, stats } from "@/features/dei/data";
import styles from "@/features/dei/dei.module.css";
import { FundingCards } from "@/features/dei/FundingCards";
import { HeroDeck } from "@/features/dei/HeroDeck";
import { JourneyAccordion } from "@/features/dei/JourneyAccordion";
import { OfferCards } from "@/features/dei/OfferCards";
import { PartnerMarquee } from "@/features/dei/PartnerMarquee";
import { StartupShowcase } from "@/features/dei/StartupShowcase";
import { DeiAction, DeiCallToAction, DeiHero, DeiSection } from "@/features/dei/ui";

export const metadata = {
  title: { absolute: "SRM DEI — Startup incubation, funding and labs" },
};

export default function DeiHome() {
  return (
    <>
      <DeiHero
        title="Start your company"
        accent="at SRM"
        lead="DEI gives SRM students, faculty and founders incubation, funding and labs to build a startup."
        media={<HeroDeck />}
      >
        <DeiAction href={applyIncubation}>Apply for incubation</DeiAction>
        <DeiAction href="#startups" quiet>Meet our startups</DeiAction>
      </DeiHero>

      <section className={styles.stats} aria-label="DEI in numbers">
        <div className={styles.wrap}>
          <dl>
            {stats.map(s => (
              <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      <DeiSection id="startups" tone="pale" title="Startups we" accent="back">
        <StartupShowcase />
      </DeiSection>

      <DeiSection title="What we" accent="offer">
        <OfferCards />
      </DeiSection>

      <DeiSection tone="navy" title="How incubation" accent="works">
        <JourneyAccordion />
      </DeiSection>

      <DeiSection id="funding" tone="pale" title="Funding" accent="programmes">
        <FundingCards />
      </DeiSection>

      <DeiSection title="Our" accent="partners">
        <PartnerMarquee />
        <div className={styles.actions} style={{ marginTop: 28 }}>
          <DeiAction href={deiRoutes.startups.href + "#partners"} quiet>All partners</DeiAction>
        </div>
      </DeiSection>

      <DeiCallToAction />
    </>
  );
}
