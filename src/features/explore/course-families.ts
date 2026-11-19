import type { Course } from "./academic";

export const familyNames = {
  computing: "Computing & data",
  engineering: "Engineering & technology",
  "architecture-design": "Architecture & design",
  business: "Business & commerce",
  "arts-sciences": "Arts, sciences & humanities",
  law: "Law & justice",
  health: "Medicine & health",
  agriculture: "Agriculture & horticulture",
  hospitality: "Hospitality & catering",
} as const;
export type FamilyId = keyof typeof familyNames;

export function familyFor(c: Pick<Course, "faculty" | "name" | "degree">): FamilyId | null {
  switch (c.faculty) {
    case "management": return "business";
    case "law": return "law";
    case "agricultural-science": return "agriculture";
    case "hotel-and-catering-management": return "hospitality";
    case "medicine-health-sciences": return "health";
    case "engineering":
      if (/arch|des/i.test(c.degree)) return "architecture-design";
      if (/^(computer sci|artificial intelligence|ai and|information technology|software|mathematics and computing|quantum computing)/i.test(c.name)) return "computing";
      return "engineering";
    case "science-and-humanities":
      if (/b\.?\s*com|m\.?\s*com/i.test(c.degree) || /^(fintech|economics)$/i.test(c.name)) return "business";
      if (/fashion design/i.test(c.name)) return "architecture-design";
      if (/bca|mca/i.test(c.degree) || /^(computer|cs w\/s|data science)/i.test(c.name)) return "computing";
      return "arts-sciences";
    default: return null;
  }
}
