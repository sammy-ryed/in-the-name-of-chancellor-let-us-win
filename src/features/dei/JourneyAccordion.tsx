import Image from "next/image";
import Link from "next/link";
import styles from "./showcase.module.css";

const stages = [
  { step: "Explore", body: "Take Design Thinking, join a bootcamp or hackathon.", href: "/dei/programmes", cta: "See programmes",
    src: "/dei/photos/bootcamp.jpg", alt: "Participants taking notes at the DEI Entrepreneurship Bootcamp" },
  { step: "Prototype", body: "Validate with BRC mentors. Build at the FabLab.", href: "/dei/facilities", cta: "See facilities",
    src: "/dei/photos/initiative-hackathons.jpg", alt: "Students building a prototype at a DEI hackathon" },
  { step: "Incubate", body: "Get workspace, seed funding and IP support.", href: "/dei/apply", cta: "Apply now",
    src: "/dei/photos/initiative-workshops.jpg", alt: "Founders at a session in the DEI innovation space" },
  { step: "Scale", body: "Raise from investors, license tech, graduate.", href: "/dei/startups#funding", cta: "See funding",
    src: "/dei/photos/iris-expo.jpg", alt: "Guests trying a humanoid robot at the IRIS expo" },
];

/**
 * Image accordion: hover or focus a panel and it opens while its neighbours make room.
 * The first panel is open by default. On phones the panels stack, all open.
 */
export function JourneyAccordion() {
  return (
    <ol className={styles.accordion}>
      {stages.map((s, i) => (
        <li key={s.step} className={styles.panel}>
          <Image src={s.src} alt={s.alt} fill unoptimized sizes="(max-width: 760px) 100vw, 60vw" />
          <div className={styles.panelShade} aria-hidden="true" />
          <span className={styles.panelSpine} aria-hidden="true"><b>0{i + 1}</b>{s.step}</span>
          <div className={styles.panelBody}>
            <span className={styles.panelNumber}>Step 0{i + 1}</span>
            <h3>{s.step}</h3>
            <p>{s.body}</p>
            <Link href={s.href} className={styles.panelCta}>{s.cta} <span aria-hidden="true">→</span></Link>
          </div>
        </li>
      ))}
    </ol>
  );
}
