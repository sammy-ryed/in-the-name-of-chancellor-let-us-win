import type { FinderData, Filters, Group, Programme, SortKey } from "./types";

const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\./g, "")
    .replace(/[,()&/-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Searchable text per programme: name, degree, department and college labels. */
export function buildIndex(data: FinderData) {
  const label = new Map<string, string>();
  for (const o of [...data.colleges, ...data.departments]) label.set(o.value, o.label);
  return new Map(
    data.programmes.map((p) => [
      p.id,
      fold([p.name, p.certification, ...p.department.map((d) => label.get(d)), ...p.college.map((c) => label.get(c))].join(" ")),
    ]),
  );
}

/** Campus values each programme belongs to, via its colleges (the site's campus → college cascade). */
export function campusIndex(data: FinderData) {
  return new Map(
    data.programmes.map((p) => [
      p.id,
      data.campuses.filter((c) => p.college.some((col) => c.colleges.includes(col))).map((c) => c.value),
    ]),
  );
}

export type FinderIndex = { text: Map<number, string>; campuses: Map<number, string[]> };

const any = (selected: string[], values: string[]) => selected.length === 0 || selected.some((s) => values.includes(s));
const words = (q: string) => fold(q).split(" ").filter(Boolean);

/**
 * Groups combine with AND; choices inside one group combine with OR (as on the SRMIST finder).
 * `except` ignores one group — that is how each option's live count is worked out.
 */
function matches(p: Programme, f: Filters, ix: FinderIndex, w: string[], except?: Group) {
  return (
    (except === "levels" || any(f.levels, p.level)) &&
    (except === "modes" || any(f.modes, p.mode)) &&
    (except === "types" || any(f.types, p.type)) &&
    (except === "campus" || !f.campus || (ix.campuses.get(p.id) ?? []).includes(f.campus)) &&
    (except === "college" || !f.college || p.college.includes(f.college)) &&
    (except === "department" || !f.department || p.department.includes(f.department)) &&
    w.every((word) => ix.text.get(p.id)!.includes(word))
  );
}

export function filterProgrammes(data: FinderData, ix: FinderIndex, f: Filters): Programme[] {
  const w = words(f.query);
  return data.programmes.filter((p) => matches(p, f, ix, w));
}

/** For every option in every group: how many programmes it would show alongside the other active filters. */
export function facetCounts(data: FinderData, ix: FinderIndex, f: Filters) {
  const w = words(f.query);
  const pick: Record<Group, (p: Programme) => string[]> = {
    levels: (p) => p.level,
    modes: (p) => p.mode,
    types: (p) => p.type,
    campus: (p) => ix.campuses.get(p.id) ?? [],
    college: (p) => p.college,
    department: (p) => p.department,
  };
  const out = {} as Record<Group, Map<string, number>>;
  for (const group of Object.keys(pick) as Group[]) {
    const counts = new Map<string, number>();
    for (const p of data.programmes) {
      if (!matches(p, f, ix, w, group)) continue;
      for (const v of pick[group](p)) counts.set(v, (counts.get(v) ?? 0) + 1);
    }
    out[group] = counts;
  }
  return out;
}

/** Duration in years for sorting ("6 Months" → 0.5, "3–5 Years" → 3); unknown sorts last. */
function years(d?: string) {
  const m = d?.match(/\d+(?:\.\d+)?/);
  if (!d || !m) return Infinity;
  return /^\s*[\d.]+\s*months?/i.test(d) ? Number(m[0]) / 12 : Number(m[0]);
}

export function sortProgrammes(list: Programme[], sort: SortKey, data: FinderData, query: string) {
  const byName = (a: Programme, b: Programme) =>
    a.subject.localeCompare(b.subject, "en", { sensitivity: "base" }) ||
    a.certification.localeCompare(b.certification, "en", { sensitivity: "base" });
  const levelRank = (p: Programme) =>
    Math.min(99, ...p.level.map((l) => data.levels.findIndex((o) => o.value === l)).filter((i) => i >= 0));
  const out = [...list];
  switch (sort) {
    case "name-desc":
      return out.sort((a, b) => byName(b, a));
    case "level":
      return out.sort((a, b) => levelRank(a) - levelRank(b) || byName(a, b));
    case "duration":
      return out.sort((a, b) => years(a.duration) - years(b.duration) || byName(a, b));
    case "relevance": {
      // With a search, titles that start with, then contain, the query rank first; otherwise A–Z.
      const q = fold(query);
      if (!q) return out.sort(byName);
      const score = (p: Programme) => {
        const t = fold(p.subject);
        return t.startsWith(q) ? 0 : t.includes(q) ? 1 : fold(p.name).includes(q) ? 2 : 3;
      };
      return out.sort((a, b) => score(a) - score(b) || byName(a, b));
    }
    default:
      return out.sort(byName);
  }
}

export function activeCount(f: Filters) {
  return f.levels.length + f.modes.length + f.types.length + [f.campus, f.college, f.department, f.query.trim()].filter(Boolean).length;
}
