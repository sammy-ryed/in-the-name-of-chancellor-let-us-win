import Image from "next/image";
import { partnerLogos } from "./showcase";
import styles from "./showcase.module.css";

const half = Math.ceil(partnerLogos.length / 2);
const rows = [partnerLogos.slice(0, half), partnerLogos.slice(half)];

/** Two rows of partner logos scrolling in opposite directions, endlessly. Pauses on hover; static with reduced motion. */
export function PartnerMarquee() {
  return (
    <div className={styles.marquee}>
      <ul className={styles.srOnly}>{partnerLogos.map(p => <li key={p.name}>{p.name}</li>)}</ul>
      {rows.map((row, r) => (
        <div key={r} className={styles.marqueeRow} data-reverse={r === 1 || undefined} aria-hidden="true">
          {[0, 1].map(copy => (
            <ul key={copy} className={styles.marqueeTrack}>
              {row.map(p => (
                <li key={p.name} title={p.name}>
                  <Image src={p.src} alt="" width={160} height={64} unoptimized />
                </li>
              ))}
            </ul>
          ))}
        </div>
      ))}
    </div>
  );
}
