import Image from "next/image";
import { applyIncubation, mentors, team } from "@/features/dei/data";
import { Btn, Facts, Rows, Section, pageStyles as s } from "@/features/dei/blocks";
import { DeiAction, DeiCallToAction, DeiHero } from "@/features/dei/ui";

export const metadata = {
  title: "About DEI",
  description: "What SRM's Directorate of Entrepreneurship and Innovation does, how it works with BRC, and the team and mentors behind it.",
};

export default function DeiAbout() {
  return (
    <div className={s.page}>
      <DeiHero
        current="About"
        title="About"
        accent="DEI"
        lead="SRM's Directorate of Entrepreneurship and Innovation. Since 2015 we've helped students, faculty and founders turn ideas into companies."
        image="/campus/tech-park.webp"
        alt="SRM Tech Park building on the Kattankulathur campus"
      >
        <DeiAction href={applyIncubation}>Apply for incubation</DeiAction>
        <DeiAction href="#team" quiet>Meet the team</DeiAction>
      </DeiHero>

      <section className={s.section} data-tight aria-label="DEI in numbers">
        <div className={s.wrap}>
          <Facts items={[
            { value: "2015", label: "founded at SRMIST" },
            { value: "37", label: "startups incubated" },
            { value: "₹225 Cr+", label: "raised by our startups" },
            { value: "4", label: "labs for founders" },
          ]} />
        </div>
      </section>

      <Section title="What DEI does" tone="pale">
        <div className={s.split}>
          <div className={s.prose}>
            <p>
              <strong>DEI</strong> runs SRM&apos;s entrepreneurship programmes and labs: minors and courses, the FabLab,
              BioNEST, CIAP for patents, and events like IRIS and our bootcamps.
            </p>
            <p>
              <strong>The Bootstrappers&apos; Research Council (BRC)</strong> is our Section-8 incubator. It runs
              pre-incubation, incubation and acceleration, with a focus on defence, e-mobility, healthcare and deep tech.
            </p>
            <p>You apply once. We route you to the right programme, lab or incubation track.</p>
            <div className={s.actions}>
              <Btn href="/dei/facilities" kind="dark">See our labs</Btn>
              <Btn href="/dei/programmes" kind="secondary">See programmes</Btn>
            </div>
          </div>
          <div className={s.splitMedia}>
            <Image src="/home/innovation.webp" alt="Machines and workbenches in an SRM innovation workshop" fill sizes="(max-width: 860px) 100vw, 45vw" />
          </div>
        </div>
      </Section>

      <Section title="Mission and vision" tone="navy">
        <div className={s.statements}>
          <div>
            <h3>Mission</h3>
            <p>Support innovators from idea to product with labs, mentors and funding, and protect the IP they create.</p>
          </div>
          <div>
            <h3>Vision</h3>
            <p>An entrepreneurial mindset across campus, and startups that help build a self-reliant India.</p>
          </div>
        </div>
      </Section>

      <Section id="team" title="Team">
        <Rows items={team.map(t => ({
          title: t.name,
          detail: t.role,
          action: t.email ? { label: "Email", href: `mailto:${t.email}` } : undefined,
        }))} />
      </Section>

      <Section id="mentors" title="Mentors" tone="pale" intro="Investors, operators and industry experts who coach our founders.">
        <Rows cols={2} items={mentors.map(m => ({ title: m.name, detail: m.role, tag: m.area }))} />
      </Section>

      <Section id="iic" title="Institution's Innovation Council">
        <div className={s.split}>
          <div className={s.prose}>
            <p>
              SRMIST&apos;s IIC is part of the Ministry of Education&apos;s national innovation network and is run by DEI.
              It organises innovation, IP and startup activities through the year. Any SRMIST student or faculty member can join.
            </p>
            <div className={s.actions}>
              <Btn href="mailto:conveneriic.dei@srmist.edu.in" kind="dark">Email the IIC convener</Btn>
              <Btn href="https://iic.mic.gov.in/" kind="secondary">MoE IIC portal</Btn>
            </div>
          </div>
          <div className={s.splitMedia}>
            <Image src="/dei/photos/initiative-workshops.jpg" alt="Students at a session in the DEI innovation space" fill unoptimized sizes="(max-width: 860px) 100vw, 45vw" />
          </div>
        </div>
      </Section>

      <DeiCallToAction />
    </div>
  );
}
