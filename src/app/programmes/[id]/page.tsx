import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SiteFooter } from "@/components/SiteFooter";
import { application, courses, criteria, faculties, source } from "@/features/explore/academic";
import { programmeFee } from "@/features/explore/fee-listing";
import { coursePhoto, fieldPhotos } from "@/features/programmes/photography";
import { routes } from "@/lib/navigation";
import { CompareCourseLink } from "./CompareCourseLink";
import styles from "./detail.module.css";

// All course pages and their metadata come from the same local catalogue.
export const dynamicParams = false;
export function generateStaticParams() {
  return courses.map(({ id }) => ({ id }));
}

type Props = { params: Promise<{ id: string }> };

const byId = new Map(courses.map(course => [course.id, course]));
const facultyPhoto: Record<string, string> = {
  engineering: fieldPhotos.engineering,
  management: fieldPhotos.business,
  "hotel-and-catering-management": fieldPhotos.hospitality,
  "medicine-health-sciences": "/home/subjects/health.webp",
  "agricultural-science": "/home/subjects/agriculture.webp",
  law: "/home/subjects/law.webp",
  phd: "/home/research.webp",
};

async function getCourse(params: Props["params"]) {
  const course = byId.get((await params).id);
  if (!course) notFound();
  return course;
}

export async function generateMetadata({ params }: Props) {
  const course = await getCourse(params);
  return { title: `${course.degree} · ${course.name} · ${course.campus}` };
}

export default async function Page({ params }: Props) {
  const course = await getCourse(params);
  const { fee, period } = programmeFee(course);
  const official = source(course);
  const apply = application(course);
  const facts = [
    ["Campus", course.campus], ["Duration", course.duration], ["Study level", course.level],
    ["Approved intake", course.intake], ["Mode", course.mode], ["Shift", course.shift],
  ].filter(([, value]) => value);

  return (
    <>
      <article className={styles.page}>
        <div className={styles.inner}>
          <Breadcrumbs className={styles.crumbs} parents={[routes.home, routes.programmes]} current="Course details" />
          <header className={styles.header}>
            <div>
              <p className={styles.degree}>{course.degree}</p>
              <h1>{course.name}</h1>
              <p className={styles.faculty}>{faculties[course.faculty]}</p>
            </div>
            <div className={styles.photo}>
              <Image src={coursePhoto(course.name, facultyPhoto[course.faculty] ?? "/home/campus.webp")} alt="" fill sizes="(max-width: 700px) 0px, 26vw" />
            </div>
          </header>
          <div className={styles.body} id="guide-content">
            <div className={styles.details}>
              <section aria-labelledby="at-a-glance">
                <h2 id="at-a-glance">At a glance</h2>
                <dl>{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
              </section>
              <section aria-labelledby="eligibility">
                <h2 id="eligibility">Entry requirements</h2>
                <p>{criteria(course)}</p>
                <a href={official}>Full eligibility and selection rules <span aria-hidden="true">↗</span></a>
              </section>
            </div>
            <aside className={styles.fees} aria-labelledby="fee-label">
              <h2 id="fee-label">{period || "Listed fee"}</h2>
              <p className={styles.amount} data-prose={fee.length > 19 || undefined}>{fee}</p>
              <Suspense fallback={<Link className={styles.compare} href={`${routes.fees.href}?compare=${course.id}`}>Compare this fee <span aria-hidden="true">→</span></Link>}>
                <CompareCourseLink className={styles.compare} courseId={course.id} />
              </Suspense>
              <p>{course.notes || "Check the faculty schedule for registration, exams and other charges. Hostel and dining are listed separately."}</p>
              <p className={styles.note}>Listing checked 5 November 2026. Confirm the fee for your intake in the <a href={official}>official fee schedule</a>.</p>
              <div className={styles.actions}>
                <a className={styles.apply} href={apply}>{apply === official ? "See application routes" : "Apply for this programme"} <span aria-hidden="true">↗</span></a>
                <Link href={{ pathname: routes.admissions.href, query: { course: course.id }, hash: "enquiry" }}>Ask admissions about this course</Link>
              </div>
            </aside>
          </div>
        </div>
      </article>
      <SiteFooter />
    </>
  );
}
