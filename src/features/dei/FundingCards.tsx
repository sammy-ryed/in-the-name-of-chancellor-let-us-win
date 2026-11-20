import Image from "next/image";
import Link from "next/link";
import { funding } from "./showcase";
import styles from "./showcase.module.css";

/** Funding programmes as plain fact cards: who it's for, what you get, how to apply. */
export function FundingCards() {
  return (
    <ul className={styles.funding}>
      {funding.map(f => {
        const external = !f.href.startsWith("/");
        return (
          <li key={f.id} id={f.id} className={styles.fund}>
            <div className={styles.fundFace}>
              <div className={styles.fundHead}>
                {f.logo
                  ? <span className={styles.fundLogo}><Image src={f.logo} alt="" width={120} height={48} unoptimized /></span>
                  : <span className={styles.fundBadge}>{f.name}</span>}
              </div>
              <h3>{f.full}</h3>
              <p className={styles.fundBy}>{f.by}</p>
              <dl className={styles.fundFacts}>
                <div><dt>For</dt><dd>{f.audience}</dd></div>
                <div>
                  <dt>You get</dt>
                  <dd><ul>{f.offers.map(o => <li key={o}>{o}</li>)}</ul></dd>
                </div>
                <div><dt>Apply</dt><dd>{f.apply}</dd></div>
              </dl>
            </div>
            {external
              ? <a className={styles.fundCta} href={f.href} target="_blank" rel="noopener noreferrer">{f.cta} <span aria-hidden="true">↗</span></a>
              : <Link className={styles.fundCta} href={f.href}>{f.cta} <span aria-hidden="true">→</span></Link>}
          </li>
        );
      })}
    </ul>
  );
}
