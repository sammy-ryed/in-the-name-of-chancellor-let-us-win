import Link from "next/link";
import type { StudyAreaId } from "@/features/programmes/finder/studyAreas";
import "./subject-links.css";

const subjects = [
  { label: "Engineering", area: "engineering" },
  { label: "Medicine", area: "health" },
  { label: "Architecture", area: "design" },
  { label: "Sciences", area: "sciences" },
  { label: "Humanities", area: "humanities" },
  { label: "Law", area: "law" },
  { label: "Agriculture", area: "agriculture" },
] satisfies { label: string; area: StudyAreaId }[];

export function SubjectLinks() {
  return (
    <details className="s-subject-rail">
      <summary>Browse by subject</summary>
      <nav aria-label="Programmes by subject">
        <ul className="s-subjects">
          {subjects.map(({ label, area }) => (
            <li key={area}><Link href={`/programmes?area=${area}`}>{label}</Link></li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
