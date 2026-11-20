import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ApplyForm } from "@/features/dei/apply/ApplyForm";
import { deiRoutes } from "@/features/dei/data";
import styles from "@/features/dei/dei.module.css";
import { routes } from "@/lib/navigation";

export const metadata = {
  title: "Apply for incubation",
  description: "Apply to SRM DEI and the Bootstrappers' Research Council for incubation, seed funding, mentoring and lab access. Takes about 5 minutes.",
};

export default function DeiApply() {
  return (
    <>
      <header className={styles.applyHero} data-search-surface="dark">
        <div className={styles.wrap}>
          <Breadcrumbs className={styles.crumbs} parents={[routes.home, deiRoutes.home]} current="Apply" />
          <h1 className={styles.applyTitle}>Apply for <em>incubation</em></h1>
        </div>
      </header>
      <section className={styles.applyBody} aria-label="Application form">
        <div className={styles.wrap}>
          <ApplyForm />
        </div>
      </section>
    </>
  );
}
