import { application, courses, price } from "@/features/explore/academic";
import { programmeFee } from "@/features/explore/fee-listing";
import { coursePhoto, fieldPhotos } from "../photography";
import { studyAreaOf } from "./studyAreas";
import raw from "./programmes.json";
import { cardSnapshots as snapshots, courseByProgrammeId, programmePickerContext } from "@/features/explore/course-matches";
import type { FinderData, Programme } from "./types";

const researchFees = courses.filter(c => c.faculty === "phd");
const programmes = raw.programmes.map((p): Programme => {
  const published = snapshots[p.id];
  const doctoral = p.level.includes("Ph.D");
  const researchGroup = p.college.includes("9812") ? "Engineering & Technology"
    : p.college.includes("24139") ? "Science & Medical" : undefined;
  const researchMode = p.type.includes("fulltime") ? "Full Time"
    : /external/i.test(p.name) ? "Part Time - External" : undefined;
  const research = doctoral ? researchFees.find(c => c.name === researchGroup && c.mode === researchMode) : undefined;
  const match = research || courseByProgrammeId.get(p.id);
  const feeCourseId = courseByProgrammeId.get(p.id)?.id;
  const choice = feeCourseId ? undefined : programmePickerContext(String(p.id));
  const matchedFee = match?.fee ? programmeFee(match) : undefined;
  const publishedFee = published?.fee?.trim();
  // A few source rows contain a contradictory unit ("5,00,000 lakhs").
  // Point to the official listing for those rather than interpreting the amount.
  const ambiguous = /[\d,]+\s+lakhs?\b/i.test(publishedFee || "");
  const numeric = publishedFee?.replace(/^(?:₹|rs\.?|inr)\s*/i, "").replace(/[,\s]/g, "");
  const fee = numeric && /^\d+$/.test(numeric) ? price(numeric) : publishedFee;
  const period = /entire programme/i.test(fee || "") ? "Full programme fee" : published?.period || "Annual fees";
  return {
    ...p,
    duration: p.duration || published?.duration || match?.duration,
    fee: matchedFee?.fee ?? (ambiguous ? undefined : fee),
    feePeriod: matchedFee?.period ?? (ambiguous || !fee ? undefined : period),
    feeConflict: matchedFee?.conflict,
    feeCourseId,
    compareCandidates: choice?.candidates.map(course => course.id),
    compareSearch: choice?.search || undefined,
    feeUrl: doctoral ? "https://www.srmist.edu.in/admission-india/phd/" : undefined,
    photo: coursePhoto(p.subject, fieldPhotos[studyAreaOf(p)], published?.photo),
    applyUrl: doctoral ? "https://admissions.srmist.edu.in/srmistonline/phdapplication"
      : match ? application(match) : "https://applications.srmist.edu.in/",
  };
});

const compareCourses = courses.map(course => ({
  id: course.id,
  title: course.name.toLowerCase().startsWith(course.degree.toLowerCase() + " ") ? course.name : course.degree + " " + course.name,
  place: [course.campus, course.shift, course.mode].filter(Boolean).join(" · "),
}));

export const finderData: FinderData = { ...raw, programmes, compareCourses };
