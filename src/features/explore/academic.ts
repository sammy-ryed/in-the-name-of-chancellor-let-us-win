import records from "./courses.json";
import { routes, srm as university } from "@/lib/navigation";
export { university };
export const applyBtech = routes.apply.href;
export const faculties: Record<string, string> = {
  engineering: "Engineering & Technology",
  management: "Management",
  "science-and-humanities":
    "Liberal Arts & Business Studies (Science & Humanities)",
  law: "Law",
  "medicine-health-sciences": "Medicine & Health Sciences",
  "agricultural-science": "Agricultural Sciences",
  "hotel-and-catering-management": "Hotel & Catering Management",
  phd: "Doctoral research",
};
export type Course = (typeof records)[number];
export const courses = records;
export function source(c: Course) {
  return university + "/admission-india/" + c.faculty + "/";
}
export function price(fee: string) {
  return /^\d+$/.test(fee)
    ? "₹" + Number(fee).toLocaleString("en-IN")
    : fee || "Confirm with admissions";
}
export function criteria(c: Course) {
  if (c.eligibility && !/^eligibility( criteria)?$/i.test(c.eligibility))
    return c.eligibility;
  if (c.faculty === "engineering" && /b\.?\s*tech|integrated/i.test(c.degree))
    return /biotech|genetic|biomedical/i.test(c.name)
      ? "SRM accepts specified science subject combinations with a 60% aggregate. Biology-route entrants may need first-year mathematics. Check the exact combination for this specialisation."
      : "For the regular Indian 10+2 route, SRM lists a 60% aggregate in Physics, Mathematics and one approved third subject. Other qualifications have separate rules.";
  return (
    "The faculty publishes subject, qualification and entrance requirements by degree. Check the eligibility section for " +
    c.degree +
    " before applying."
  );
}
export function application(c: Course) {
  const base = "https://applications.srmist.edu.in/";
  const degree = c.degree.toLowerCase().replace(/[^a-z]/g, "");
  const pg = c.level === "Postgraduate";
  switch (c.faculty) {
    case "phd":
      return "https://admissions.srmist.edu.in/srmistonline/phdapplication";
    case "engineering":
      if (degree === "btech" || degree.includes("integrated"))
        return applyBtech;
      if (degree === "mtech") return base + "m-tech";
      if (["barch", "bdes"].includes(degree))
        return base + "architecture-and-design";
      if (["march", "mdes"].includes(degree)) return base + "m-arch-m-des";
      break;
    case "management":
      if (degree === "mba") return base + "mba";
      if (degree === "bba") return base + "bba";
      break;
    case "law":
      if (degree === "llm") return base + "llm-application";
      if (degree.includes("llb"))
        return base + (degree.startsWith("llb") ? "llb" : "law");
      break;
    case "science-and-humanities":
      return (
        base + (pg ? "science-and-humanities-pg" : "science-and-humanities")
      );
    case "agricultural-science":
      return (
        base +
        (pg ? "pg-agricultural-sciences-form" : "agricultural-sciences-form")
      );
    case "hotel-and-catering-management":
      return (
        base +
        (pg ? "hotel-and-catering-management-pg-application-form" : "hcma")
      );
  }
  return source(c);
}
