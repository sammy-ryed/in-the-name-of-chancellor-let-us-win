import records from "./courses.json";
import programmes from "../programmes/finder/programmes.json";
import snapshots from "../programmes/finder/card-facts.json";

type Snapshot = { fee?: string; period?: string; duration?: string; photo?: string };
type Course = (typeof records)[number];
type Programme = (typeof programmes.programmes)[number];

export const cardSnapshots: Record<string, Snapshot | undefined> = snapshots;

// These are printing differences in the two official catalogues. Preserve subject,
// specialism, qualification, location and shift when linking a specific fee record.
function identity(value: string) {
  return value.toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\b(?:with speciali[sz]ation|w\s*\/\s*s)(?:\s+in)?\b/g, " ")
    .replace(/\bhonou?rs\b/g, "hons")
    .replace(/[^a-z0-9]/g, "");
}
const campusKey = (value: string) => identity(value.split(/,| - /)[0]);
const bySubject = Map.groupBy(records, c => identity(c.name));
const byTitle = Map.groupBy(records, c => identity(c.degree + " " + c.name));
const programmesById = new Map(programmes.programmes.map(p => [p.id, p]));
const candidatesById = new Map<number, Course[]>();
export const courseByProgrammeId = new Map<number, Course>();
export const feeConflicts = new Map<string, { note: string; url: string }>();
const periodKey = (value: string) => /annual|per annum/i.test(value) ? "annual"
  : /entire programme|total tuition|full programme/i.test(value) ? "total"
  : /semester/i.test(value) ? "semester" : undefined;

function namedRecords(p: Programme) {
  const sameSubject = (bySubject.get(identity(p.subject)) ?? []).filter(c => identity(c.degree) === identity(p.certification));
  const fullTitle = identity(p.name);
  // Some faculty lists put the entire degree in the name field, while the
  // programme card splits off a partial prefix such as "Bachelor".
  const explicitDegree = /^(?:bachelor|master|doctor of|[mb]\.|mbbs\b|btech\b|mtech\b|ph\.?d\b)/i.test(p.name);
  const sameFullTitle = explicitDegree ? bySubject.get(fullTitle) ?? [] : [];
  return [...new Set([...sameSubject, ...(byTitle.get(fullTitle) ?? []), ...sameFullTitle])];
}

for (const p of programmes.programmes) {
  const campuses = programmes.campuses.filter(c => p.college.some(id => c.colleges.includes(id)));
  const named = namedRecords(p);
  const local = named.filter(c => campuses.some(campus => campusKey(campus.label) === campusKey(c.campus)));
  const choices = local.length ? local : named;
  if (choices.length) candidatesById.set(p.id, choices);
  if (campuses.length !== 1 || local.length !== 1) continue;
  const [course] = local;
  courseByProgrammeId.set(p.id, course);
  const snapshot = cardSnapshots[p.id];
  if (!snapshot?.fee || /[\d,]+\s+lakhs?\b/i.test(snapshot.fee)) continue;
  const cardAmount = snapshot.fee.match(/^(?:₹|INR|Rs\.?)?\s*([\d,]+)(?:\s*\(|\s*$)/i);
  const facultyAmount = course.fee.match(/^([\d,]+)(?:\s*\(|\s*$)/);
  if (!cardAmount || !facultyAmount) continue;
  const cardPeriod = periodKey(snapshot.fee) ?? periodKey(snapshot.period || "");
  const facultyPeriod = periodKey(course.fee) ?? periodKey(course.period);
  const amountDiffers = Number(cardAmount[1].replaceAll(",", "")) !== Number(facultyAmount[1].replaceAll(",", ""));
  if (amountDiffers || (cardPeriod && facultyPeriod && cardPeriod !== facultyPeriod)) {
    feeConflicts.set(course.id, {
      note: "The faculty listing and programme page differ. The programme page lists " + snapshot.fee
        + (snapshot.period ? " (" + snapshot.period + ")" : "") + ". Confirm your intake amount with admissions.",
      url: p.url,
    });
  }
}

// Suggestions only seed the editable search box. They never assign a fee record.
const searchableNames = records.map(c => (c.degree + " " + c.name).toLowerCase().replaceAll(".", "").replaceAll("/", " "));
function relatedSearch(p: Programme) {
  const ignored = new Set(["with", "specialisation", "specialization", "science", "engineering", "and", "bachelor", "master", "honours", "degree", "minor", "technology", "the", "for"]);
  const tokens = [...new Set(p.subject.toLowerCase().match(/[a-z]{3,}/g) ?? [])].filter(t => !ignored.has(t));
  const terms = tokens.map(word => ({ word, matches: searchableNames.filter(name => name.includes(word)) }))
    .filter(term => term.matches.length).sort((a, b) => a.matches.length - b.matches.length);
  const first = terms[0];
  const degree = p.certification.toLowerCase().replace(/\./g, "").trim();
  if (!first) return searchableNames.some(name => name.startsWith(degree + " ")) ? degree : "";
  if (degree && first.matches.some(name => name.startsWith(degree + " "))) return degree + " " + first.word;
  const second = terms.slice(1).find(term => first.matches.some(name => name.includes(term.word)));
  return second ? first.word + " " + second.word : first.word;
}

export function programmePickerContext(id: string | undefined) {
  if (!id || !/^\d+$/.test(id)) return undefined;
  const programme = programmesById.get(Number(id));
  if (!programme) return undefined;
  const candidates = candidatesById.get(programme.id) ?? [];
  return { name: programme.name, url: programme.url, candidates, search: candidates.length ? "" : relatedSearch(programme) };
}
