import { rupees, type TuitionRanking as Ranking } from "@/features/explore/tuition-ranking";
import styles from "./compare.module.css";

const letter = (slot: number) => ["A", "B", "C"][slot];
export function TuitionRanking({ groups, excluded }: Ranking) {
  return <section className={styles.prices} aria-labelledby="tuition-order">
    <h3 id="tuition-order">Which course costs more?</h3>
    {groups.map(group => {
      const { rows, highest, lowest, difference, period } = group;
      return <div className={styles.priceGroup} key={period}>
        <p className={styles.priceBasis}>{period} · before other charges</p>
        <ol>{rows.map(row => <li key={row.slot}>
          <span className={styles.letter}>{letter(row.slot)}</span>
          <div><strong>{row.name}</strong><small>{row.campus}</small></div>
          <div className={styles.rate}><b>{rupees(row.amount)}</b>
            <small>{row.rank}{row.rank && row.aboveLowest > 0 ? " · " + rupees(row.aboveLowest) + " above lowest" : ""}</small></div>
        </li>)}</ol>
        <p className={styles.arithmetic}>{rows.length === 1
          ? "Add another course with this billing period to compare the price."
          : difference === 0
            ? "These options have the same tuition. The difference is ₹0."
            : "Option " + letter(rows[0].slot) + " costs " + rupees(difference) + " more than option " + letter(rows.at(-1)!.slot) + ". " + rupees(highest) + " − " + rupees(lowest) + " = " + rupees(difference) + "."}</p>
      </div>;
    })}
    {groups.length > 1 && <p className={styles.feeIssue}>The billing periods differ. Each group above covers a different length of time.</p>}
    {excluded.length > 0 && <div className={styles.feeIssue}><strong>Fees to confirm before ranking</strong>
      {excluded.map(entry => <p key={entry.slot}>Option {letter(entry.slot)} · {entry.explanation}</p>)}</div>}
  </section>;
}
