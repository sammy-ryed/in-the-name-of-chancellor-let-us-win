import { fieldPhotos } from "../photography";
import { applicantCounts } from "./applicants";
import type { Programme } from "./types";

const areas = {
  computing: { title: "Computer Science & AI" },
  engineering: { title: "Engineering & Technology" },
  health: { title: "Medicine & Health Sciences" },
  business: { title: "Business & Commerce" },
  sciences: { title: "Natural Sciences & Mathematics" },
  humanities: { title: "Arts, Humanities & Education" },
  design: { title: "Architecture, Design & Media" },
  agriculture: { title: "Agriculture" },
  law: { title: "Law" },
  hospitality: { title: "Hotel Management & Culinary Arts" },
};

export type StudyAreaId = keyof typeof areas;

export function studyAreaOf(p: Pick<Programme, "name" | "college" | "department">): StudyAreaId {
  const inDepartment = (...ids: string[]) => p.department.some(id => ids.includes(id));
  if (p.college.includes("24139")) return "health";
  if (p.college.includes("28996")) return "agriculture";
  if (p.college.includes("29281")) return "law";
  if (inDepartment("24108")) return "hospitality";
  if (p.college.includes("29288") || inDepartment("28850", "28853", "23887")) return "business";
  if (inDepartment("13448", "24107", "24767", "23800")) return "design";
  if (inDepartment("23797", "24094", "13519", "13534", "13537", "13522", "93651") ||
      (!p.department.length && /computer science/i.test(p.name))) return "computing";
  if (inDepartment("23817", "24092", "30758", "146423", "28841", "217452")) return "sciences";
  if (inDepartment("13546")) return "humanities";
  if (p.college.includes("9812") || p.college.includes("266746")) return "engineering";
  return "humanities";
}

export function groupStudyAreas(programmes: Programme[]) {
  const groups = new Map((Object.keys(areas) as StudyAreaId[]).map(id => [
    id, { id, ...areas[id], photo: fieldPhotos[id], programmes: [] as Programme[], applications: 0 },
  ]));
  for (const p of programmes) {
    const group = groups.get(studyAreaOf(p))!;
    group.programmes.push(p);
    group.applications += applicantCounts.get(p.id) ?? 0;
  }
  return [...groups.values()].filter(g => g.programmes.length).sort((a, b) =>
    b.applications - a.applications || b.programmes.length - a.programmes.length || a.title.localeCompare(b.title));
}

export type StudyArea = ReturnType<typeof groupStudyAreas>[number];

export const studyAreaHref = (area: StudyArea) => `/programmes?area=${area.id}`;
