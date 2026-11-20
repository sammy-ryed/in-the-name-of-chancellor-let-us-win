import { price, type Course } from "./academic";
import { feeConflicts } from "./course-matches";

export type FeeListing = Pick<Course, "id" | "name" | "degree" | "faculty" | "campus" | "level" | "duration" | "mode" | "shift" | "notes"> & {
  fee: string;
  period: string;
  amount: number | null;
  conflict?: string;
  alternateSource?: string;
};

/** Preserve conditions in the source. Only an unambiguous figure can be subtracted from another. */
export function programmeFee({ id, fee, period, notes }: Pick<Course, "fee" | "period" | "notes"> & { id?: string }) {
  const conflict = id ? feeConflicts.get(id) : undefined;
  const fullFee = fee.match(/^([\d,]+)\s*\(for the entire programme\)$/i);
  const raw = fullFee ? fullFee[1].replaceAll(",", "") : fee;
  const numeric = /^\d+$/.test(raw);
  const ambiguousUnit = /[\d,]+\s+lakhs?\b/i.test(raw);
  const quoted = /^\d+\*$/.test(raw) ? price(raw.slice(0, -1)) + "*" : price(raw);
  return {
    fee: ambiguousUnit ? "Confirm with the faculty" : quoted,
    period: fullFee ? "Full programme fee" : period,
    // Notes can specify a concession, internship charge or different rate for later years.
    amount: numeric && !conflict && !/\d/.test(notes) ? Number(raw) : null,
    conflict: conflict?.note,
    alternateSource: conflict?.url,
  };
}

export function feeListing(course: Course): FeeListing {
  const { id, name, degree, faculty, campus, level, duration, mode, shift, notes } = course;
  return { id, name, degree, faculty, campus, level, duration, mode, shift, notes, ...programmeFee(course) };
}
