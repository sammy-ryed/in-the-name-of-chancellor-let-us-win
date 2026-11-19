import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SiteFooter } from "@/components/SiteFooter";
import { routes } from "@/lib/navigation";
import { familyNames, type FamilyId } from "@/features/explore/course-families";
import { courseEvidence, courseIndex, pickerCourses } from "@/features/explore/course-evidence";
import { rankTuition } from "@/features/explore/tuition-ranking";
import { parseShortlist } from "@/features/explore/shortlist";
import { programmePickerContext } from "@/features/explore/course-matches";
import { ComparisonDesk } from "./ComparisonDesk";
import styles from "./compare.module.css";

export const metadata = {
  title: "Compare courses | SRM student field guide",
  description: "Compare up to three SRM courses by curriculum, career paths, placements, AI and tuition.",
};
type Params = Record<string, string | string[] | undefined>;
const first = (value: Params[string]) => Array.isArray(value) ? value[0] : value;

export default async function ComparePage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const field = first(params.family);
  const family = field && Object.hasOwn(familyNames, field) ? field as FamilyId : "";
  const entry = programmePickerContext(first(params.programme));
  const query = first(params.q) ?? entry?.search ?? "";
  const compare = first(params.compare);
  const slots = parseShortlist(compare ?? "").map(id => {
    const course = courseIndex.get(id);
    return course ? courseEvidence(course) : null;
  });
  const fromPicker = Boolean(family || entry || query);
  const requestedPicker = fromPicker && (compare === undefined || first(params.pick) === "1");
  return <>
    <article className={styles.page}>
      <div className={styles.wrap}>
        <Breadcrumbs className={styles.crumbs} parents={[routes.home, routes.programmes]} current="Compare courses" />
        <header className={styles.intro}>
          <div><h1>Compare your courses</h1>
            <p className={styles.deck}>Choose up to three SRM programmes. Compare their fees, placements and what you’ll study, then keep exploring with your picks saved in this tab.</p>
          </div>
          <figure className={styles.photo}><Image src="/campus/tech-park.webp" alt="SRM Tech Park at Kattankulathur" fill sizes="(max-width: 760px) 0px, 24vw" /><figcaption>Tech Park, Kattankulathur</figcaption></figure>
        </header>
        <ComparisonDesk slots={slots} catalog={pickerCourses} family={family} initialQuery={query}
          explicitCompare={compare !== undefined} requestedPicker={requestedPicker}
          entry={requestedPicker && entry ? { name: entry.name, url: entry.url, candidates: entry.candidates.map(c => c.id) } : undefined}
          pricing={rankTuition(slots)} />
      </div>
    </article>
    <SiteFooter />
  </>;
}
