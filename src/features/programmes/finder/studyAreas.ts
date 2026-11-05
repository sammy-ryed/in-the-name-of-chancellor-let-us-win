import { applicantCounts } from "./applicants";
import type { Programme } from "./types";

const areas = {
  computing: { title: "Computer Science & AI", photo: "/career-centre/training.webp" },
  engineering: { title: "Engineering & Technology", photo: "/home/racing.webp" },
  health: { title: "Medicine & Health Sciences", photo: "/home/subjects/health.webp" },
  business: { title: "Business & Commerce", photo: "/programmes/43f1c39be556.webp" },
  sciences: { title: "Natural Sciences & Mathematics", photo: "/home/subjects/sciences.webp" },
  humanities: { title: "Arts, Humanities & Education", photo: "/home/subjects/humanities.webp" },
  design: { title: "Architecture, Design & Media", photo: "/home/subjects/design.webp" },
  agriculture: { title: "Agriculture", photo: "/home/subjects/agriculture.webp" },
  law: { title: "Law", photo: "/home/subjects/law.webp" },
  hospitality: { title: "Hotel Management & Culinary Arts", photo: "/programmes/3ea73b8f3f7a.webp" },
};

export type StudyAreaId = keyof typeof areas;

export function studyAreaOf(p: Programme): StudyAreaId {
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
    id, { id, ...areas[id], programmes: [] as Programme[], applications: 0 },
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
