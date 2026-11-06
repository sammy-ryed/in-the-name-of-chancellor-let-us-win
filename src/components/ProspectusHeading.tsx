import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SrmCrest } from "@/components/HomeLogo";
import type { NavLink } from "@/lib/navigation";
import styles from "./ProspectusHeading.module.css";

export function ProspectusHeading({ edition, parents, current, compact, children }: {
  edition: "admissions" | "programmes";
  parents: NavLink[];
  current: string;
  compact?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={styles.cover} data-edition={edition} data-compact={compact || undefined}>
      {edition === "admissions" && <div className={styles.art} aria-hidden="true"><SrmCrest sizes="(max-width: 760px) 30vw, 22vw" /></div>}
      <Breadcrumbs className={styles.trail} parents={parents} current={current} />
      <h1 className={styles.title}>{children}</h1>
    </div>
  );
}
