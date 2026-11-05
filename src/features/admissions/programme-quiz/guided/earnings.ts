import type { Course } from "@/features/explore/academic";

const report = (subject: string) => "https://webstor.srmist.edu.in/web_assets/downloads/2026/flipbook/" + subject + "-nirf-mandatory-srm/files/basic-html/page1.html";
export const cohorts = {
  engineering: { label: "SRMIST Engineering · four-year UG", year: "2024–25", medianINR: 632000, placed: 4144, graduatedInTime: 4408, source: report("engineering") },
  architecture: { label: "SRMIST Architecture · five-year UG", year: "2024–25", medianINR: 500000, placed: 54, graduatedInTime: 58, source: report("architecture") },
  medical: { label: "SRMIST Medical · five-year UG reporting group", year: "2023–24", medianINR: 900000, placed: 136, graduatedInTime: 145, source: report("medical") },
  pharmacy: { label: "SRMIST Pharmacy · four-year UG", year: "2023–24", medianINR: 625000, placed: 54, graduatedInTime: 100, source: "https://www.nirfindia.org/nirfpdfcdn/2025/pdf/Pharmacy/IR-P-U-0473.pdf" },
} as const;
export function cohortFor(course: Course) {
  if (course.faculty === "engineering" && course.degree === "B.Tech" && course.duration === "4 years") return cohorts.engineering;
  if (course.id === "afccd862f02") return cohorts.architecture;
  if (course.id === "61b981b9c53") return cohorts.medical;
  if (course.id === "9538a8885eb") return cohorts.pharmacy;
  return null;
}

export const earningsNote = "These are yearly medians among placed graduates in an SRMIST reporting group. Half earned at least the median. The figures cover past batches and combine courses or campuses where the report does. Your offer can differ. A blank means we have no verified comparable figure for that course.";

