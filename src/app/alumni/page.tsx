import Image from "next/image";
import { SiteFooter } from "@/components/SiteFooter";
import { MemoryReveal } from "@/features/alumni/MemoryReveal";
import { MemoryHero } from "@/features/alumni/MemoryHero";
import { DaysToGo } from "@/features/alumni/DaysToGo";
import { alumniDay, alumniLinks, alumniOffice, notableAlumni, pastEvents } from "@/features/alumni/data";
import "./alumni.css";

export const metadata = {
  title: "Alumni",
  description:
    "Come back to SRM: the places you remember, photographs from alumni reunions, notable SRMIST alumni and Alumni Day 2026.",
};

function Arrow() {
  return (
    <svg className="al-arrow" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5" />
    </svg>
  );
}

const ext = { rel: "noopener noreferrer", target: "_blank" } as const;

export default function Page() {
  return (
    <>
      <div className="al-page">
        {/* 1 — Hero: scroll-driven photo grid */}
        <MemoryHero />

        {/* 3 — Memory gallery */}
        <section id="memories" className="al-memories" aria-labelledby="memories-title">
          <div className="al-section al-head al-head-light al-reveal">
            <h2 id="memories-title">Little moments. Lifetime memories.</h2>
          </div>
          <div className="al-section">
            <MemoryReveal />
          </div>
        </section>

        {/* 4 — Notable alumni */}
        <section id="notable" className="al-section al-notable" aria-labelledby="notable-title">
          <div className="al-head al-reveal">
            <h2 id="notable-title">From here, to everywhere.</h2>
            <p>The same classrooms, the same hostels, and now the White House, the NIA and Tamil cinema.</p>
          </div>
          <ul className="al-people">
            {notableAlumni.map((a, i) => (
              <li key={a.id} className="al-person al-reveal" style={{ "--i": i % 3 } as React.CSSProperties}>
                <figure>
                  <Image src={a.photo} alt={`Portrait of ${a.name}`} fill sizes="(max-width: 760px) 92vw, (max-width: 1100px) 45vw, 30vw" unoptimized />
                </figure>
                <div className="al-person-body">
                  <p className="al-person-field">{a.field}</p>
                  <h3>{a.name}</h3>
                  <p className="al-person-role">{a.role}</p>
                  <p className="al-person-degree">
                    {a.degree}
                    {a.year && <span> · Class of {a.year}</span>}
                  </p>
                  <p className="al-person-note">{a.achievement}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="al-more">
            <a href={alumniLinks.notable} {...ext}>
              More notable alumni <Arrow />
            </a>
            <a href={alumniLinks.stories} {...ext}>
              Alumni success stories <Arrow />
            </a>
          </p>
        </section>

        {/* 5 — Events: Alumni Day as an invitation, then the archive as a row of prints */}
        <section id="events" className="al-events" aria-labelledby="events-title">
          <div className="al-section">
            <div className="al-events-head al-reveal">
              <p className="al-eyebrow">Alumni Day 2026</p>
              <h2 id="events-title">Your campus is waiting.</h2>
            </div>

            <div className="al-invite-wrap">
              <figure className="al-print al-print-left" aria-hidden="true">
                <Image src={pastEvents[2].image} alt="" fill sizes="240px" unoptimized />
              </figure>
              <article className="al-invite al-reveal" aria-labelledby="alumni-day-title">
                <p className="al-invite-from">The Directorate of Alumni Affairs invites you home for</p>
                <h3 id="alumni-day-title">{alumniDay.title}</h3>
                <p className="al-invite-quote">“{alumniDay.quote}”</p>
                <time className="al-invite-date" dateTime={alumniDay.date}>
                  <span>Saturday</span>
                  <b>19 December</b>
                  <span>2026 · {alumniDay.time}</span>
                </time>
                <DaysToGo date={alumniDay.date} />
                <p className="al-invite-venue">{alumniDay.venue}</p>
                <ol className="al-invite-expect">
                  {alumniDay.expect.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ol>
                <div className="al-invite-actions">
                  <a className="al-btn al-btn-navy" href={alumniDay.register} {...ext}>
                    Register for Alumni Day <Arrow />
                  </a>
                  <a className="al-btn al-btn-line" href={alumniDay.nominate} {...ext}>
                    Nominate an alumnus
                  </a>
                </div>
                <p className="al-invite-note">
                  {alumniDay.closes}{" "}
                  <a href={alumniDay.details} {...ext}>
                    Event details
                  </a>
                </p>
              </article>
              <figure className="al-print al-print-right" aria-hidden="true">
                <Image src={alumniDay.image} alt="" fill sizes="240px" unoptimized />
              </figure>
            </div>

          </div>
        </section>

        {/* 6 — Closing CTA */}
        <section className="al-close" aria-labelledby="close-title">
          <div className="al-section al-reveal">
            <h2 id="close-title">You’ll always have a place here.</h2>
            <p>
              Find your batchmates, come back for a reunion, or help the next generation find their way. SRM is still
              home.
            </p>
            <div className="al-close-actions">
              <a className="al-btn al-btn-gold" href={alumniLinks.register} {...ext}>
                Join the alumni network <Arrow />
              </a>
              <a className="al-btn al-btn-ivory" href={alumniLinks.mentor} {...ext}>
                Become a mentor
              </a>
              <a className="al-btn al-btn-ivory" href={alumniLinks.volunteer} {...ext}>
                Volunteer
              </a>
            </div>
            <p className="al-contact">
              Directorate of Alumni Affairs ·{" "}
              {alumniOffice.phones.map((p, i) => (
                <span key={p}>
                  {i > 0 && " · "}
                  <a href={`tel:${p.replace(/\s/g, "")}`}>{p}</a>
                </span>
              ))}{" "}
              · <a href={alumniLinks.instagram} {...ext}>Instagram</a> ·{" "}
              <a href={alumniLinks.linkedin} {...ext}>LinkedIn</a>
            </p>
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}
