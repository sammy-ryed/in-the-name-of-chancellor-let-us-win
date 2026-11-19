import { courses } from "@/features/explore/academic";
import { familyFor, type FamilyId } from "@/features/explore/course-families";

// The same examples appear for everyone exploring a family. The quiz scores
// families only. Students choose which exact degree and campus to compare.
const examples: Record<FamilyId, readonly string[]> = {
  computing: ["a4bf715656e", "110704d00ae", "1f74325795a"],
  engineering: ["4a24e398417", "b51c84f7f04", "a0bcde7404f"],
  "architecture-design": ["afccd862f02", "04c2cfe6159", "fb8b19a15c1"],
  business: ["230f1c469fa", "af28832158a", "6fc71c3768c"],
  "arts-sciences": ["83388e2d08d", "b580150bdd4", "c6f117f7d14"],
  law: ["20fe4cd82ef", "7b3e277334f", "36dcaa18b67"],
  health: ["a2bf7304bc2", "e7c29c55a2e", "9538a8885eb"],
  agriculture: ["cb26a1d8d87", "457c32ab100"],
  hospitality: ["c4455182888", "003d7484800", "c36938b3cf8"],
};

export const degreeOptions = courses.flatMap(course => {
  const family = familyFor(course);
  if (!family || course.level !== "Undergraduate") return [];
  const name = course.name.replace(/\s+w\/s\.?\s+(?:in\s+)?/ig, " with ");
  const title = name.toLowerCase().startsWith(course.degree.toLowerCase()) || course.degree === "Bachelor"
    ? name : course.degree + " · " + name;
  const description = [course.campus, course.shift && "Shift " + course.shift, course.mode && course.mode !== "Full Time" && course.mode]
    .filter(Boolean).join(" · ");
  return [{ id: course.id, title, campus: course.campus, description, family, example: examples[family].includes(course.id) }];
}).sort((a,b) => a.title.localeCompare(b.title, "en") || a.description.localeCompare(b.description, "en"));

export type DegreeOption = (typeof degreeOptions)[number];
