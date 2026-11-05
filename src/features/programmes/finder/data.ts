import { application, courses, price } from "@/features/explore/academic";
import raw from "./programmes.json";
import facts from "./card-facts.json";
import type { FinderData, Programme } from "./types";

const snapshots: Record<string, { photo?: string; fee?: string; period?: string; duration?: string }> = facts;
const key = (value: string) => value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]/g, "");
const courseKey = (degree: string, subject: string, campus: string) =>
  [degree, subject, campus.split(",")[0]].map(key).join("|");

const byCourse = Map.groupBy(courses, c => courseKey(c.degree, c.name, c.campus));
const researchFees = courses.filter(c => c.faculty === "phd");
const programmes = raw.programmes.map((p): Programme => {
  const published = snapshots[p.id];
  const campuses = raw.campuses.filter(c => p.college.some(id => c.colleges.includes(id)));
  const campus = campuses.length === 1 ? campuses[0].label.split(" - ")[0] : "";
  const matches = byCourse.get(courseKey(p.certification, p.subject, campus)) ?? [];
  const doctoral = p.level.includes("Ph.D");
  const researchGroup = p.college.includes("9812") ? "Engineering & Technology"
    : p.college.includes("24139") ? "Science & Medical" : undefined;
  const researchMode = p.type.includes("fulltime") ? "Full Time"
    : /external/i.test(p.name) ? "Part Time - External" : undefined;
  const research = doctoral ? researchFees.find(c => c.name === researchGroup && c.mode === researchMode) : undefined;
  const match = research || (matches.length === 1 ? matches[0] : undefined);
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
    fee: ambiguous ? undefined : fee || (match?.fee ? price(match.fee) : undefined),
    feePeriod: ambiguous ? undefined : fee ? period : match?.period,
    feeUrl: doctoral ? "https://www.srmist.edu.in/admission-india/phd/" : undefined,
    photo: published?.photo,
    applyUrl: doctoral ? "https://admissions.srmist.edu.in/srmistonline/phdapplication"
      : match ? application(match) : "https://applications.srmist.edu.in/",
  };
});

export const finderData: FinderData = { ...raw, programmes };
