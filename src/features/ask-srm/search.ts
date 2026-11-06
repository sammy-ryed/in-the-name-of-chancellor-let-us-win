import "server-only";
import { catalogue } from "./catalogue";
import { candidates } from "@/features/admissions/programme-quiz/guided/catalogue";
import { routes } from "@/lib/navigation";
import events from "@/features/explore/events.json";
import { topicContext } from "./conversation";
import type { ChatMessage, Source } from "./types";

const fillers = new Set(
  "a an and are as at be by can could do does for from get give go how i in information is it like me my of on or please srm srmist tell that the their there this to university us want what when where which who will with would you your".split(
    " ",
  ),
);

function terms(text: string): string[] {
  const words =
    text
      .toLowerCase()
      .normalize("NFKC")
      .replace(/wi[\s-]?fi/g, "wifi")
      .replace(/\bwhat about\b/g, "")
      .replace(/\b(?:enquir|inquir)(?:y|ies)\b/g, "enquiry")
      .replace(/\b(?:ktr|kattangulathur)\b/g, "kattankulathur")
      .replace(/\btrichy\b/g, "tiruchirappalli")
      .replace(/\b(?:aarush|arush)\b/g, "aaruush")
      .replace(/\b(?:instruments?|instrumentation)\b/g, "instrument")
      .replace(/\bbook(?:ing)?\b/g, "booking")
      .replace(/\b(?:hostels?|accommodation|housing|dorms?)\b/g, "hostel")
      .replace(/\bfacilities\b/g, "facility")
      .replace(/\b(?:laboratories|labs?)\b/g, "laboratory")
      .replace(/\bcolleges\b/g, "college")
      .replace(/\b(?:program|programs)\b/g, "programme")
      .replace(/\b(?:how much|pricing|price)\b/g, "fee")
      .replace(/\bai\b/g, "artificial intelligence")
      .replace(/\bml\b/g, "machine learning")
      .replace(/\bece\b/g, "electronics communication engineering")
      .replace(/\beee\b/g, "electrical electronics engineering")
      .replace(/\bcse\b/g, "computer science engineering")
      .replace(/\bb[\s.-]*tech\b/g, "btech")
      .replace(/\b(?:costs?|fees|tuition)\b(?!\s+to company)/g, "fee")
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

// Keep the intent of short institutional questions before removing common words.
// More specific service questions ("where is the hostel Wi-Fi login?") use normal ranking.
function queryTerms(question: string): string[] {
  const sentence = question
    .toLowerCase()
    .replace(/[’']/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  const location =
    /\b(where|address|location|located|situated|directions|reach|city|get to|travel to)\b/.test(
      sentence,
    );
  const rest = sentence
    .replace(
      /\b(srm|srmist|institute|of|science|and|technology|university|college|the|a|an|s|where|what|which|how|is|are|at|in|to|do|i|can|you|give|tell|me|please|find|get|its|it|your|exact|postal|address|located|situated|location|directions|reach|city|main|campus|chennai|ktr|kattankulathur|ramapuram|vadapalani|trichy|tiruchirappalli|delhi|ncr|modinagar|baburayanpettai)\b/g,
      "",
    )
    .trim();
  if (location && !rest) {
    const campus =
      sentence.match(
        /\b(ramapuram|vadapalani|ktr|kattankulathur|trichy|tiruchirappalli|delhi|ncr|modinagar|baburayanpettai)\b/,
      )?.[1] ?? "main campus";
    return terms(campus + " address");
  }
  const words = terms(question);
  if (!words.length && /\bsrm(?:ist)?\b/.test(sentence))
    return ["about", "introduction"];
  return words;
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

const campusWords = new Set(["kattankulathur", "ramapuram", "vadapalani", "tiruchirappalli",
  "ncr", "acharapakkam", "baburayanpettai", "haryana", "ap", "sikkim"]);
const contactIntents = new Set(["contact", "call", "phone", "telephone", "email", "helpline"]);
const generalContactTerms = new Set([...contactIntents, "general", "main", "number", "detail", "office", "address", "desk", "helpdesk", "enquiry", "inquiry"]);
const courseIntents = new Set(["fee", "eligibility", "duration", "semester", "tuition"]);
const researchIntents = new Set(["research", "facility", "laboratory", "centre", "equipment", "instrument"]);

function rankSources(current: string[], prior: string[]) {
  if (!current.length && !prior.length) return [];
  const weights = [...current, ...prior].map((word, i) => ({
    word,
    prior: i >= current.length,
    weight:
      (i < current.length ? 1 : 0.55) *
      Math.log(2 + docs.length / (counts.get(word) ?? 1)),
  }));
  const campuses = current.filter(w => campusWords.has(w));
  const wantsContact = current.some(word => contactIntents.has(word));
  const hasCourseIntent = [...current, ...prior].some(w => courseIntents.has(w));
  const hasResearchIntent = current.some(w => researchIntents.has(w));
  const familyQuestion = [...current, ...prior].some(w => ["parent", "guardian", "child", "son", "daughter", "parentconnect"].includes(w));
  return docs
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
      if (doc.source.section === "Course details") {
        // On campus changes and side-by-side comparisons keep the requested campus.
        if (campuses.length && !campuses.some(w => doc.title.includes(w))) score = 0;
        if (hasCourseIntent) score *= 1.22;
        // Specificity: plain CSE is a different listing from a named specialisation.
        const extra = doc.title.filter(t => !current.includes(t) && !prior.includes(t));
        score *= 1 / (1 + extra.length * 0.06);
      }
      if (wantsContact && doc.source.section === routes.contact.label) score *= 1.6;
      if (hasResearchIntent && doc.source.section === "Research") score *= 1.8;
      if (doc.source.section === "Parents" && !familyQuestion) score *= 0.64;
      if (doc.source.section === "Course details" && hasResearchIntent && !hasCourseIntent) score *= 0.65;
      const coverage = hits / Math.max(1, current.length);
      return {
        doc,
        score: distinctiveMatch ? score * (0.3 + coverage * coverage) : 0,
      };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

// The admissions quiz already has reviewed course tasters. Use them as concrete
// conversation starters when somebody is choosing a field, not as a prediction.
const tasters = candidates.map(({course, topics, example}) => ({
  name: course.degree + " " + course.name,
  tokens: terms([course.name, course.degree, ...topics].join(" ")),
  example,
  href: "/programmes/" + course.id,
}));

function isCourseChoice(question: string) {
  return /\b(?:(?:torn|choos(?:e|ing)|decid(?:e|ing)) between|my interests|what (?:course|programme|should i study)|which (?:course|programme|degree|branch).*(?:fit|suit|pick|choose|right for)|recommend (?:a |an |some )?(?:course|degree|programme))\b/i.test(question);
}

function courseSuggestions(question: string, ranked: ReturnType<typeof rankSources>): Source[] {
  const interests = terms(question.replace(/coding|programming/gi, "software computer science")
    .replace(/drawing|sketching/gi, "design").replace(/biology/gi, "life health"));
  const matches = tasters.map(taster => ({
    taster,
    hits: taster.tokens.filter(t => interests.includes(t)),
    named: terms(taster.name).filter(t => interests.includes(t)),
  })).filter(match => match.hits.length)
    .sort((a,b) => b.named.length - a.named.length || b.hits.length - a.hits.length);
  // Select one example per named field before filling the remaining slots.
  const varied = interests.flatMap(word => {
    const example = matches.find(m => m.named.includes(word)) ?? matches.find(m => m.hits.includes(word));
    return example ? [example] : [];
  });
  const finder = docs.find(({source}) => source.href === routes.finder.href)!.source;
  const results = [...new Set([...varied, ...matches])].slice(0, 3).map(({ taster }): Source => ({
    title: taster.name, section: "Course finder", href: taster.href,
    summary: "An illustrative undergraduate course-finder activity for " + taster.name + ": " + taster.example
      + " This is an example of the work to try, not an assessed course requirement.",
  }));
  return [finder, ...(results.length ? results : ranked.filter(({doc}) => doc.source.href !== finder.href).slice(0, 3).map(({doc}) => doc.source))];
}

function calendarSources(question: string): Source[] | undefined {
  if (!/\b(?:event|events|happening|workshops?)\b/i.test(question)
    || !/\b(?:upcoming|coming up|this week|this month|today|tomorrow|next (?:week|seven days|7 days)|on campus soon)\b/i.test(question)) return;
  if (/\balumni\b/i.test(question)) return;
  const campusDate = new Date(Date.now() + 330 * 60_000);
  const iso = (day: Date) => day.toISOString().slice(0, 10);
  const after = new Date(campusDate);
  if (/tomorrow/i.test(question)) after.setUTCDate(after.getUTCDate() + 1);
  const daysToSunday = (7 - campusDate.getUTCDay()) % 7;
  if (/next week/i.test(question)) after.setUTCDate(after.getUTCDate() + daysToSunday + 1);
  const end = new Date(after);
  if (/this month/i.test(question)) end.setUTCMonth(end.getUTCMonth() + 1, 0);
  else if (/this week/i.test(question)) end.setUTCDate(end.getUTCDate() + daysToSunday);
  else if (/week|seven days|7 days/i.test(question)) end.setUTCDate(end.getUTCDate() + 6);
  const until = /today|tomorrow|month|week|seven days|7 days/i.test(question) ? iso(end) : undefined;
  const subject = terms(question.replace(/\b(?:events?|happening|coming up|upcoming|this|today|tomorrow|on campus|next|week|month|seven|7|days|any|soon|being held|taking place|scheduled)\b/gi, ""));
  const relevant = events.filter(e => e.end >= iso(after) && (!until || e.start <= until)
    && subject.every(word => terms(e.title).includes(word))).sort((a,b) => a.start.localeCompare(b.start));
  return [
    { section: "Events", title: "Campus events calendar", href: routes.events.href,
      summary: relevant.length ? "Listed events for the requested period are below. Confirm timing and registration with the organiser."
        : "The site's calendar has no matching listing for the requested period. Check the university's full calendar for later announcements." },
    ...relevant.slice(0,4).map(e => ({ section: "Events", title: e.title, href: e.url,
      summary: e.title + " is listed for " + e.start + (e.end !== e.start ? " to " + e.end : "") + ". Confirm registration with the organiser." })),
  ];
}

// A campus name can be a fresh lookup or the answer to a question about a course.
const campusAddresses = docs.filter(({ source, title }) => source.section === "Visit SRM" && title.includes("address"));
function namedCampus(question: string) {
  const cleaned = question
    .replace(/\b(?:campus|address|location|directions|located|about|more|mean|means|meaning|stands? for|full form)\b/gi, "")
    .replace(/\bacharapakkam\b/gi, "Baburayanpettai");
  const names = terms(cleaned);
  if (!names.length || names.length > 2) return;
  return campusAddresses.find(({ title }) => names.every(name => name !== "main" && title.includes(name)));
}

const campusTopics = /\b(?:fees?|tuition|costs?|eligib\w*|duration|admissions?|apply|courses?|programmes?|degrees?|b[ .-]?tech|m[ .-]?tech|ph\.?d|cse|engineering|medicine|hostels?|housing|rooms?|accommodation|clubs?|placements?|labs?|laborator\w*|facilit\w*|travel|visits?|tour)\b/i;

export function retrieveQuestion(question: string, history: ChatMessage[]): {
  query: string; sources: Source[]; overview?: string;
} {
  const campus = namedCampus(question);
  const context = topicContext(history);
  if (!campus) return { query: question, sources: findSources(question, context) };

  const previousTopic = history.findLast(turn => turn.role === "user" && !namedCampus(turn.content));
  const explicitLookup = /\b(?:where|address|location|directions|what is|meaning|mean|stands? for|full form)\b/i.test(question);
  if (!explicitLookup && previousTopic && campusTopics.test(previousTopic.content)) {
    // Give the model the canonical name as well as the user's input. This keeps a reply
    // such as “KTR” attached to the programme or hostel question that prompted it.
    const query = question.replace(/\bktr\b/i, "Kattankulathur").replace(/\btrichy\b/i, "Tiruchirappalli");
    const subject = context.includes(previousTopic.content) ? context : previousTopic.content;
    return { query, sources: findSources(query, subject) };
  }

  const sources = [campus.source];
  if (campus.title.includes("kattankulathur")) {
    const explore = docs.find(({ source }) => source.href === "/campus#explore");
    if (explore) sources.push(explore.source);
  }
  return { query: question, sources, overview: campus.source.summary };
}

export function findSources(question: string, previous = ""): Source[] {
  const calendar = calendarSources(question);
  if (calendar) return calendar;
  const current = queryTerms(question);
  const explicitCampuses = current.filter(w => campusWords.has(w));
  // A new campus replaces the earlier one. Other topic words can carry forward.
  const prior = previous ? queryTerms(previous).filter(w =>
    !current.includes(w) && !(explicitCampuses.length && campusWords.has(w))) : [];
  // A generic phone or email query belongs to the university desk, not a faculty chosen by index order.
  if (!prior.length && current.some(word => contactIntents.has(word)) && current.every(word => generalContactTerms.has(word))) {
    const general = docs.find(({ source }) => source.href === routes.contact.href);
    if (general) return [general.source];
  }
  const ranked = rankSources(current, prior);
  if (isCourseChoice(question)) return courseSuggestions(question, ranked);
  // SRM publishes international fees separately. A domestic amount is never
  // supporting evidence for an NRI applicant's bill, even for the same degree.
  const admissionContext = question + " " + previous;
  const internationalApplicant = /\b(?:nri|foreign national|international (?:students?|applicants?|admissions?|applications?|fees?|tuition))\b/i.test(admissionContext)
    && !/\b(?:hostels?|rooms?|accommodation)\b/i.test(question);
  if (internationalApplicant && [...current, ...prior].some(w => ["fee", "admission", "application", "apply", "eligibility", "tuition"].includes(w))) {
    const gateway = docs.find(({source}) => source.title === "International and NRI admissions");
    if (gateway) {
      const contact = current.some(word => contactIntents.has(word)) &&
        docs.find(({ source }) => source.href === routes.contact.href + "#international-admissions");
      return contact ? [contact.source, gateway.source] : [gateway.source];
    }
  }
  if (!ranked.length) return [];

  const sources: Source[] = [];
  const seen = new Set<string>();
  function add(source: Source) {
    if (!seen.has(source.href)) {
      sources.push(source);
      seen.add(source.href);
    }
  }
  // Give both named campuses a voice even when one has far more specialisations.
  if (explicitCampuses.length >= 2 && ranked[0].doc.source.section === "Course details") {
    // A campus alone is not a match: don't substitute an unrelated branch when
    // the first campus's programme isn't listed at the second campus.
    let comparisonProgramme: string | undefined;
    for (const campus of explicitCampuses.slice(0, 3)) {
      const campusResult = rankSources(current.filter(w => !campusWords.has(w) || w === campus), prior)
        .find(({ doc }) => doc.source.section === "Course details" && doc.title.includes(campus)
          && (!comparisonProgramme || doc.source.title.split(" · ")[0] === comparisonProgramme));
      if (campusResult) {
        comparisonProgramme ??= campusResult.doc.source.title.split(" · ")[0];
        add(campusResult.doc.source);
      }
    }
    if (sources.length > 1) add({
      title: "Compare these programme listings", section: "Fees & eligibility",
      href: "/programmes/fees?compare=" + sources.map(s => s.href.split("/").pop()).join(","),
      summary: "The fee comparison opens with these listings selected: " + sources.map(s => s.title).join("; ") + ".",
    });
  }
  for (const { doc, score } of ranked) {
    if (score < ranked[0].score * 0.4 || sources.length === 5) break;
    add(doc.source);
  }
  return sources;
}
