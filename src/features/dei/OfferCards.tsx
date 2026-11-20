import Link from "next/link";
import { offers } from "./data";
import styles from "./showcase.module.css";

/**
 * Each card is one link. On hover or keyboard focus it flips to preview the page it opens.
 * On touch screens the preview sits below the front instead, so nothing is hidden.
 */
export function OfferCards() {
  return (
    <ul className={styles.offers}>
      {offers.map((o, i) => (
        <li key={o.title}>
          <Link href={o.href} className={styles.flip}>
            <span className={styles.flipInner}>
              <span className={styles.flipFront}>
                <span className={styles.offerNumber}>0{i + 1}</span>
                <span className={styles.offerTitle}>{o.title}</span>
                <span className={styles.offerBody}>{o.body}</span>
              </span>
              <span className={styles.flipBack}>
                <span className={styles.offerPage}>{o.page}</span>
                <span className={styles.offerPoints}>
                  {o.points.map(p => <span key={p}>{p}</span>)}
                </span>
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
