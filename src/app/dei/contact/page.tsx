import { careers, contact, dei } from "@/features/dei/data";
import { Btn, Rows, Section, pageStyles as s } from "@/features/dei/blocks";
import { DeiAction, DeiHero } from "@/features/dei/ui";

export const metadata = {
  title: "Contact DEI",
  description: "Phone, email and address for SRM DEI, who to contact for incubation, labs and patents, and open roles.",
};

const tel = (p: string) => `tel:${p.replace(/\s/g, "")}`;
const maps = "https://www.google.com/maps/search/?api=1&query=SRM+Institute+of+Science+and+Technology+Kattankulathur";

export default function DeiContact() {
  return (
    <div className={s.page}>
      <DeiHero
        current="Contact"
        title="Contact"
        accent="DEI"
        lead="Call, email or visit the DEI office on the SRM Kattankulathur campus."
        image="/parents/tech-park-panorama.webp"
        alt="Aerial view of the SRM Kattankulathur campus"
      >
        <DeiAction href={`mailto:${contact.emails[0].address}`}>Email DEI</DeiAction>
        <DeiAction href="#who" quiet>Who to contact</DeiAction>
      </DeiHero>

      <Section title="Reach us">
        <div className={s.methods}>
          <div className={s.method}>
            <h3>Call</h3>
            {contact.phones.map(p => <a key={p} className={s.big} href={tel(p)}>{p}</a>)}
            <p className={s.methodNote}>Monday to Friday, office hours</p>
          </div>
          <div className={s.method}>
            <h3>Email</h3>
            <a className={s.bigText} href={`mailto:${contact.emails[0].address}`}>{contact.emails[0].address}</a>
            <p className={s.methodNote}>General questions, programmes and events</p>
          </div>
          <div className={s.method}>
            <h3>Visit</h3>
            <address>{contact.address.map(l => <span key={l}>{l}</span>)}</address>
            <div className={s.actions}><Btn href={maps} kind="dark">Get directions</Btn></div>
          </div>
        </div>
      </Section>

      <Section id="who" title="Who to contact" tone="pale">
        <Rows items={[
          { title: "Incubation and applications", detail: "associate.outreach@srmbrc.com", action: { label: "Email", href: "mailto:associate.outreach@srmbrc.com" } },
          { title: "Programmes, events and general", detail: "admin.dei@srmist.edu.in", action: { label: "Email", href: "mailto:admin.dei@srmist.edu.in" } },
          { title: "BioNEST lab and biotech incubation", detail: "so.bionest@srmist.edu.in · +91 88709 19462", action: { label: "Email", href: "mailto:so.bionest@srmist.edu.in" } },
          { title: "Patents and technology transfer", detail: "admin.ciap@srmist.edu.in", action: { label: "Email", href: "mailto:admin.ciap@srmist.edu.in" } },
          { title: "FabLab membership and machines", detail: "fablab.srmdei.com", action: { label: "Visit", href: "https://fablab.srmdei.com" } },
          { title: "Institution's Innovation Council", detail: "conveneriic.dei@srmist.edu.in", action: { label: "Email", href: "mailto:conveneriic.dei@srmist.edu.in" } },
        ]} />
      </Section>

      <Section id="careers" title="Jobs at DEI">
        <Rows items={careers.map(c => ({ title: c.title, detail: c.body, action: { label: "Apply", href: `${dei}/careers` } }))} />
      </Section>
    </div>
  );
}
