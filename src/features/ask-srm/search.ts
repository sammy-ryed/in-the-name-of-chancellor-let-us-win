import "server-only";
import { catalogue } from "./catalogue";
import type { Source } from "./types";

const fillers = new Set(
  "a an and are as at be by can do does for from get give go how i in information is it me my of on or please srm srmist tell that the their there this to university us want what when where which who will with would you your".split(
    " ",
  ),
);

function terms(text: string): string[] {
  const words =
    text
      .toLowerCase()
      .normalize("NFKC")
      .replace(/wi[\s-]?fi/g, "wifi")
      .replace(/\bktr\b/g, "kattankulathur")
      .replace(/\bcse\b/g, "computer science engineering")
      .replace(/\bb[\s.-]*tech\b/g, "btech")
      .replace(/\b(?:cost|costs|fees|tuition)\b/g, "fee")
      .replace(/\b(?:net|internet|network)\b/g, "wifi")
      .replace(/\b(?:dorms?|dormitories)\b/g, "hostel")
      .replace(/\b(?:long|length|lasts)\b/g, "duration")
      .replace(/\./g, "")
      .match(/[a-z0-9]+/g) ?? [];
  return [
    ...new Set(
      words
        .filter((w) => w.length > 1 && !fillers.has(w))
        .map((w) =>
          w.length > 4 && w.endsWith("s") && !w.endsWith("ss")
            ? w.slice(0, -1)
            : w,
        ),
    ),
  ];
}

const docs = catalogue().map(({ keywords = "", ...source }) => ({
  source,
  title: terms(source.title),
  tags: terms(source.section + " " + keywords),
  body: new Set(terms(source.summary)),
}));
const counts = new Map<string, number>();
for (const d of docs) {
  for (const word of new Set([...d.title, ...d.tags, ...d.body]))
    counts.set(word, 1 + (counts.get(word) ?? 0));
}

export function findSources(question: string, previous = ""): Source[] {
  const current = terms(question);
  const prior = previous
    ? terms(previous).filter((w) => !current.includes(w))
    : [];
  if (!current.length && !prior.length) return [];
  const weights = [...current, ...prior].map((word, i) => ({
    word,
    prior: i >= current.length,
    weight:
      (i < current.length ? 1 : 0.55) *
      Math.log(2 + docs.length / (counts.get(word) ?? 1)),
  }));
  const ranked = docs
    .map((doc) => {
      let score = 0,
        hits = 0;
      let distinctiveMatch = false;
      for (const { word, weight, prior } of weights) {
        let strength = 0;
        if (doc.title.includes(word)) strength = 7;
        else if (doc.tags.includes(word)) strength = 4;
        else if (doc.body.has(word)) strength = 2;
        else if (word.length >= 3 && doc.title.some((t) => t.startsWith(word)))
          strength = 3;
        if (!strength) continue;
        if (strength > 2 || (counts.get(word) ?? 0) < docs.length / 12)
          distinctiveMatch = true;
        score += weight * strength;
        if (!prior) hits++;
      }
      // A complete title is a better destination than a catalogue entry mentioning the same words.
      if (doc.title.length && doc.title.every((t) => current.includes(t)))
        score *= 1.35;
      const coverage = hits / Math.max(1, current.length);
      return {
        doc,
        score: distinctiveMatch ? score * (0.3 + coverage * coverage) : 0,
      };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
  const sources: Source[] = [];
  const seen = new Set<string>();
  for (const { doc, score } of ranked) {
    if (score < ranked[0].score * 0.32 || sources.length === 5) break;
    if (seen.has(doc.source.href)) continue;
    seen.add(doc.source.href);
    sources.push(doc.source);
  }
  return sources;
}
