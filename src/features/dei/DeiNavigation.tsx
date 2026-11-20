"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { applyIncubation, deiNavigation, deiRoutes } from "./data";
import styles from "./dei.module.css";

/** DEI's own section bar: sits under the SRM site header and stays in view while scrolling. */
export function DeiNavigation() {
  const pathname = usePathname();
  return (
    <div className={styles.bar} data-search-surface="dark">
      <nav className={styles.barInner} aria-label="DEI">
        <Link className={styles.wordmark} href={deiRoutes.home.href} aria-current={pathname === "/dei" ? "page" : undefined}>
          <span className={styles.wordmarkMark}>DEI</span>
          <span className={styles.wordmarkText}>Entrepreneurship &amp; Innovation</span>
        </Link>
        <ul className={styles.barLinks}>
          {deiNavigation.map(link => {
            const current = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <li key={link.href}>
                <Link href={link.href} aria-current={current ? "page" : undefined}>{link.label}</Link>
              </li>
            );
          })}
        </ul>
        {pathname !== applyIncubation && <Link className={styles.barApply} href={applyIncubation}>Apply for incubation</Link>}
      </nav>
    </div>
  );
}
