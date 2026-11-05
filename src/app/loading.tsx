import { Compass } from "@/components/wayfinding/Compass";
import styles from "@/components/wayfinding/wayfinding.module.css";

export default function Loading() {
  return (
    <div className={styles.loading} role="status">
      <div className={styles.instrument} aria-hidden="true">
        <Compass />
      </div>
      <p>Loading page<span aria-hidden="true">…</span></p>
    </div>
  );
}
