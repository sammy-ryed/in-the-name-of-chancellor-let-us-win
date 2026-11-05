import styles from "./wayfinding.module.css";

export function Compass() {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={styles.compass} aria-hidden="true" focusable="false">
      <circle cx="100" cy="100" r="96" fill="var(--navy)" stroke="currentColor" strokeWidth="2" />
      <circle cx="100" cy="100" r="88" stroke="currentColor" strokeWidth="6" pathLength="360" strokeDasharray="1 5" />
      <circle cx="100" cy="100" r="84" stroke="currentColor" strokeWidth="12" pathLength="360" strokeDasharray="1 29" />
      <circle cx="100" cy="100" r="54" stroke="currentColor" strokeOpacity=".25" />
      <path d="M100 48v104M48 100h104" stroke="currentColor" strokeOpacity=".3" strokeDasharray="2 5" />
      <g className={styles.bearings} textAnchor="middle" dominantBaseline="central">
        <text x="100" y="35" fill="var(--color-gold-light)">N</text>
        <text x="165" y="100">E</text>
        <text x="100" y="165">S</text>
        <text x="35" y="100">W</text>
      </g>
      <g className={styles.needle}>
        <path d="M100 32 117 100 100 94 83 100Z" fill="var(--color-gold-light)" />
        <path d="M100 32 117 100 100 94Z" fill="var(--color-gold)" />
        <path d="M100 168 83 100 100 106 117 100Z" fill="var(--surface-warm)" />
        <path d="m100 168 17-68-17 6Z" fill="var(--color-blue-light)" />
        <circle cx="100" cy="100" r="6" fill="var(--navy)" stroke="currentColor" strokeWidth="2" />
      </g>
    </svg>
  );
}
