import type { Metadata } from "next";
import { DeiFooter } from "@/features/dei/DeiFooter";
import { DeiNavigation } from "@/features/dei/DeiNavigation";
import styles from "@/features/dei/dei.module.css";

export const metadata: Metadata = {
  title: { default: "Directorate of Entrepreneurship and Innovation", template: "%s | SRM DEI" },
  description:
    "SRM DEI helps founders build, validate and scale: incubation, seed funding, FabLab, BioNEST, IP protection and entrepreneurship programmes at SRMIST.",
};

export default function DeiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.page}>
      <div className={styles.headerSpace} data-search-surface="dark" />
      <DeiNavigation />
      {children}
      <DeiFooter />
    </div>
  );
}
