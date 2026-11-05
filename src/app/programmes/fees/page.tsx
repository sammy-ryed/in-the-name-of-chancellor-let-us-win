import { Suspense } from "react";
import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SiteFooter } from "@/components/SiteFooter";
import { courses, faculties } from "@/features/explore/academic";
import { feeListing } from "@/features/explore/fee-listing";
import { FeeCatalogue, FeesFromURL } from "@/features/explore/Finder";
import { routes } from "@/lib/navigation";
import styles from "@/features/explore/fees.module.css";

export const metadata = {
  title: "Programme fees & eligibility",
  description: "Browse SRM programme fees by subject, study level and campus. Compare tuition and fee periods side by side.",
};
const records = courses.map(feeListing);

export default function FeesPage() {
  return (
    <>
      <div className={styles.page}>
        <header className={styles.cover}>
          <div className={styles.coverInner}>
            <div className={styles.intro}>
              <Breadcrumbs className={styles.crumbs} parents={[routes.home, routes.programmes]} current="Fees & eligibility" />
              <h1>Programme <em>fees.</em></h1>
              <p>Find the fee for your course and campus. Compare up to three options, then check the entry requirements.</p>
            </div>
            <figure className={styles.coverPhoto} data-search-surface="media">
              <Image src="/campus/srm-university-lake.webp" alt="The SRM University building above the trees at Kattankulathur" fill sizes="(max-width: 700px) 0px, 31vw" />
            </figure>
          </div>
        </header>
        <Suspense fallback={<FeeCatalogue records={records} faculties={faculties} />}>
          <FeesFromURL records={records} faculties={faculties} />
        </Suspense>
      </div>
      <SiteFooter />
    </>
  );
}
