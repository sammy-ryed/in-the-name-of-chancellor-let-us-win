import type { StudyAreaId } from "./finder/studyAreas";

// The same field photographs are used by the index, course rows and fee detail pages.
export const fieldPhotos = {
  computing: "/programmes/editorial/computing.webp",
  engineering: "/programmes/editorial/engineering.webp",
  health: "/home/subjects/health.webp",
  business: "/programmes/1cc3affb7474.webp",
  sciences: "/home/subjects/sciences.webp",
  humanities: "/home/subjects/humanities.webp",
  design: "/home/subjects/design.webp",
  agriculture: "/home/subjects/agriculture.webp",
  law: "/home/subjects/law.webp",
  hospitality: "/programmes/3ea73b8f3f7a.webp",
} satisfies Record<StudyAreaId, string>;

// Specific activities take precedence over broad names such as "Computer Science and Engineering".
const subjectPhotos: [RegExp, string][] = [
  [/artificial intelligence|machine (?:learning|intelligence|vision)|\bAI\b/i, "/programmes/editorial/ai.webp"],
  [/big data analytics|business (?:analytics|systems)/i, fieldPhotos.business],
  [/\bdata\b|\banalytics\b|\bstatistics\b|biostatistics/i, "/programmes/editorial/data.webp"],
  [/network|cloud|block\s?chain|information technology/i, "/career-centre/training.webp"],
  [/gaming technology/i, "/programmes/45bc437ffd11.webp"],
  [/software|full stack|devsecops|cyber|information security|digital forensics/i, "/programmes/adde7c0a39ca.webp"],
  [/electronics|embedded|semiconductor|internet of things/i, "/programmes/4e74a0c1166a.webp"],
  [/computer science|computer applications|computing/i, fieldPhotos.computing],
  [/aeronautic|aerospace|space technology/i, "/programmes/d6cb87b6a323.webp"],
  [/automobile|automotive|electric vehicle/i, "/home/racing.webp"],
  [/civil|construction|geotechnical|structural engineering/i, "/programmes/6b0e2abb949c.webp"],
  [/biotech|microbiolog|biochem|genetic|medicinal|chemical engineering|chemistry/i, fieldPhotos.sciences],
  [/food (?:safety|process|tech)|nutrition/i, "/programmes/f83be2bf3a5b.webp"],
  [/pharma/i, "/programmes/ab8522940ec0.webp"],
  [/nurs/i, "/programmes/491eaa10b9ca.webp"],
  [/psycholog|counsell/i, "/programmes/5071c15ea988.webp"],
  [/physiotherapy|occupational therapy/i, "/programmes/d1a8e26f3945.webp"],
  [/journalism|visual communication/i, "/programmes/a4df7afd9d09.webp"],
  [/finance|accounting|commerce|management studies/i, fieldPhotos.business],
  [/architecture|interior design/i, fieldPhotos.design],
];

// Retain a reviewed programme-specific photograph where the catalogue has one.
export function coursePhoto(subject: string, fallback: string, specific?: string) {
  return specific ?? subjectPhotos.find(([pattern]) => pattern.test(subject))?.[1] ?? fallback;
}
