import Image from "next/image";
import { dei, pastEvents, social } from "@/features/dei/data";
import { Btn, Rows, Section, pageStyles as s } from "@/features/dei/blocks";
import { DeiAction, DeiCallToAction, DeiHero } from "@/features/dei/ui";

export const metadata = {
  title: "Events",
  description: "IRIS, hackathons, bootcamps and workshops at SRM DEI, plus news from the DEI blog.",
};

const types = [
  { name: "IRIS Expo", text: "Two days where startups and researchers show their work to industry.", src: "/dei/photos/iris-expo.jpg", alt: "Guests trying a humanoid robot at the IRIS expo" },
  { name: "Hackathons", text: "Build in teams, demo to mentors, win support.", src: "/dei/photos/initiative-hackathons.jpg", alt: "Students building a prototype at a DEI hackathon" },
  { name: "Bootcamps", text: "Five days from problem to pitch.", src: "/dei/photos/bootcamp.jpg", alt: "Participants at the DEI Entrepreneurship Bootcamp" },
  { name: "Workshops", text: "Hands-on IP, fundraising, design and fabrication.", src: "/dei/photos/initiative-workshops.jpg", alt: "Students at a workshop in the DEI innovation space" },
];

const instagram = social.find(x => x.label === "Instagram")!.href;
const linkedin = social.find(x => x.label === "LinkedIn")!.href;

export default function DeiEvents() {
  return (
    <div className={s.page}>
      <DeiHero
        current="Events"
        title="DEI"
        accent="events"
        lead="Hackathons, bootcamps, workshops and the IRIS expo. Open to SRMIST students, faculty and startups."
        image="/dei/photos/iris-expo.jpg"
        alt="Guests trying a humanoid robot at the IRIS expo"
      >
        <DeiAction href={instagram}>Get event updates</DeiAction>
      </DeiHero>

      <Section title="Upcoming events">
        <div className={s.callout}>
          <p>No dates are announced right now. New events are posted first on Instagram and LinkedIn.</p>
          <div className={s.actions}>
            <Btn href={instagram} kind="dark">Follow on Instagram</Btn>
            <Btn href={linkedin} kind="secondary">Follow on LinkedIn</Btn>
          </div>
        </div>
      </Section>

      <Section title="What we run" tone="pale">
        <ul className={s.tiles}>
          {types.map(t => (
            <li key={t.name} className={s.tile}>
              <Image src={t.src} alt={t.alt} fill unoptimized={t.src.startsWith("/dei/")} sizes="(max-width: 560px) 100vw, (max-width: 1024px) 50vw, 33vw" />
              <div className={s.tileText}><h3>{t.name}</h3><p>{t.text}</p></div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Past events">
        <Rows cols={2} items={pastEvents.map(e => ({ title: e.name, detail: e.date }))} />
      </Section>

      <Section title="News" tone="pale">
        <div className={s.callout}>
          <p>Stories, startup updates and BioNEST news are on the DEI blog.</p>
          <Btn href={`${dei}/blog`} kind="dark">Read the blog</Btn>
        </div>
      </Section>

      <DeiCallToAction />
    </div>
  );
}
