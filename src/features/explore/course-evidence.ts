import { byApplications, reportedApplications } from "./course-applications";
import { cohortFor } from "@/features/admissions/programme-quiz/guided/earnings";
import { courses, source, type Course } from "./academic";
import { careerFor } from "./career-profiles";
import { hiringEvidence, placementScope, placementsQuestion, taskEvidence, preparationTip } from "./ai-placements";
import { familyFor } from "./course-families";
import { programmeFee } from "./fee-listing";
import { marketFor } from "./role-market";
import { studyReferenceFor } from "./study-references";
import type { Topic } from "./compare-topics";

import { curriculumEdition, curriculumFor } from "./cse-curricula";
export { defaultCourseIds } from "./cse-curricula";
const pdf = "https://webstor.srmist.edu.in/web_assets/downloads/2026/";
const counselling = pdf + "srmjeee-2026-phase-i-round-ii-e-counselling-manual.pdf";


export type Fact = { label: string; text: string; link?: { label: string; href: string } };
function fact(label: string, text: string, linkLabel?: string, href?: string): Fact {
  return { label, text, ...(linkLabel && href ? { link: { label: linkLabel, href } } : {}) };
}
export function pickerCourse(c: Course) {
  const curriculum = curriculumFor(c.id);
  return { id: c.id, title: c.name, short: curriculum?.short || c.name, degree: c.degree, campus: c.campus,
    level: c.level, family: familyFor(c), shift: c.shift, mode: c.mode, applications: reportedApplications(c.id) };
}
export type PickerCourse = ReturnType<typeof pickerCourse>;
export const pickerCourses = courses.map(pickerCourse).sort((a, b) => byApplications(a, b) || a.title.localeCompare(b.title, "en-IN") || a.campus.localeCompare(b.campus, "en-IN"));
export const courseIndex = new Map(courses.map(c => [c.id, c]));

export function courseEvidence(course: Course) {
  const curriculum = curriculumFor(course.id);
  const reference = studyReferenceFor(course.id);
  const career = careerFor(course);
  const market = marketFor(course);
  const fee = programmeFee(course);
  const official = source(course);
  const cohort = cohortFor(course);
  const details = {
    study: curriculum ? [
      fact("The emphasis", curriculum.emphasis),
      fact("Shared foundations", "The 2026 Kattankulathur curricula all require data structures, operating systems, databases and machine learning."),
      fact("Required modules", curriculum.core),
      fact("Elective example", curriculum.elective),
      fact("Practical work", curriculum.lab),
      fact("One project to imagine", career!.project),
      fact("Curriculum edition", curriculumEdition, "Read the curriculum", curriculum.href),
    ] : [
      fact("The emphasis", reference?.focus || course.degree + " · " + course.name + "."),
      ...(reference ? [
        ...(reference.taught ? [fact("Published subjects", reference.taught)] : []),
        ...(reference.elective ? [fact("Elective example", reference.elective)] : []),
        ...(reference.practical ? [fact("Practical work", reference.practical)] : []),
        fact("Curriculum edition", reference.edition, reference.sourceLabel, reference.source),
      ] : [fact("Course specification", "Check the department’s syllabus for the regulation attached to your intake. Required modules, electives and lab hours have yet to be verified here.", "Faculty admissions listing", official)]),
      ...(career ? [fact("One project to imagine", career.project)] : []),
    ],
    work: career ? [
      fact("A possible starting role", career.role),
      fact("A junior might", career.work, career.roleSource.label, career.roleSource.href),
      ...(curriculum ? [fact("Where paths overlap", "Graduates from all three routes can pursue junior software development. The projects and skills you can demonstrate matter to an employer.")] : []),
      fact("Skills to demonstrate", career.skills),
      fact("Further study & qualifications", career.next),
      fact("Indian hiring signal", market.hiring?.text || "A dated Indian hiring signal specific to this pathway is still unverified.", "Read the hiring tracker", market.hiring?.url),
    ] : [fact("Career pathways", "Ask the department for recent roles and the profile of students entering this qualification.", "Faculty listing", official)],
    pay: [
      fact("Exact course outcome", "An independently verifiable salary or CTC figure for this exact course, campus and intake is unavailable in the linked evidence."),
      fact("Broader SRM cohort", cohort
        ? "₹" + (cohort.medianINR / 100000).toFixed(2) + " lakh annual median salary among placed graduates. " + cohort.label + ", " + cohort.year + ". " + cohort.placed.toLocaleString("en-IN") + " graduates placed, " + cohort.graduatedInTime.toLocaleString("en-IN") + " graduated in the minimum time."
        : "No matched institutional cohort figure has been verified for this listing.", "SRM’s NIRF submission", cohort?.source),
      fact("Indian market pay", market.pay?.text || "A sourced Indian salary for a named entry role and experience band is still unverified.", "Payscale role report", market.pay?.url),
      fact("Reading pay figures", "CTC is the employer’s cost. A salary survey can include bonuses or overtime. Take-home is what reaches your account after deductions. These figures describe different groups and measures."),
    ],
    ai: [
      fact(placementsQuestion, hiringEvidence.summary, hiringEvidence.label, hiringEvidence.href),
      fact("What we know about this course", cohort
        ? "The " + cohort.year + " figures cover " + cohort.label + ". SRM’s submission gives no breakdown of AI’s effect on offers for this particular course and campus."
        : placementScope + " Ask your department how many students sought placement and how many were placed in each of the last two batches.",
      "See the SRM reporting group", cohort?.source),
      ...(career ? [
        fact("Starting role", career.role),
        fact("AI could assist with", career.assist),
        fact("Your judgement", career.judgement),
        fact("Practise this", career.practice),
      ] : [fact("Prepare for an interview", preparationTip)]),
      fact("How work may change", taskEvidence.summary, taskEvidence.label, taskEvidence.href),
    ],
    cost: [
      fact("Published tuition", fee.fee + " · " + fee.period + (fee.period === "Listed fee" ? " (billing period unspecified)" : "") + ".", "Faculty fee listing", official),
      ...(fee.conflict ? [fact("Sources disagree", fee.conflict, "Programme page", fee.alternateSource)] : []),
      fact("Mandatory charges", course.degree === "B.Tech" && course.campus === "Kattankulathur" && course.mode === "Full Time"
        ? "The 2026 SRMJEEE counselling manual lists a one-time ₹10,000 registration fee at Kattankulathur. The ₹1 lakh counselling payment counts towards tuition. Confirm exam and other charges for your intake."
        : "A complete schedule of compulsory charges for this option is still unverified. Ask for the registration, examination and any clinical or lab charges in writing.",
        course.degree === "B.Tech" && course.campus === "Kattankulathur" ? "2026 counselling manual" : "Faculty listing",
        course.degree === "B.Tech" && course.campus === "Kattankulathur" ? counselling : official),
      fact("Campus", course.campus),
      fact("Duration", course.duration || "Confirm duration with the faculty."),
      ...(course.notes ? [fact("Published conditions", course.notes)] : []),
    ],
  } satisfies Record<Topic, Fact[]>;
  return { ...pickerCourse(course), fee, details };
}
export type ComparedCourse = ReturnType<typeof courseEvidence>;
