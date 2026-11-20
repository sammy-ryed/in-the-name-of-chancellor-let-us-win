import { routes } from "@/lib/navigation";
import { criteria, type Course } from "@/features/explore/academic";
import { courseIndex, pickerCourse } from "@/features/explore/course-evidence";
import { programmeFee } from "@/features/explore/fee-listing";
import { comparisonHref, parseShortlist } from "@/features/explore/shortlist";
import { rankTuition, rupees } from "@/features/explore/tuition-ranking";
import type { ChatMessage, SearchResponse, Source } from "./types";

const amountQuestion = /\b(?:fees?|tuition|costs?|price|cheaper|cheapest|expensive|affordable|lowest|pay|kharcha|how much)\b/;
const lengthQuestion = /\b(?:duration|how (?:long|many years)|length)\b/;
const entryQuestion = /\b(?:eligib\w*|qualif\w*|subjects?|requirements?|can i (?:apply|get in)|do i need)\b/;
const genericWords = new Set(("a an the and or in at for here on of to from me my we i you it its is are am be was should would do does can will " +
  "about how what whats which who much long many years take this that these those one ones course courses degree degrees programme programmes program programs " +
  "my choices picks pick choice option options slot slots selected cheapest cheaper affordable most least lowest highest more less expensive pay fees fee cost costs difference between " +
  "tuition price per year annual total duration length eligible eligibility qualify qualifications subjects subject requirements required need entry apply get " +
  "than which has have compared compare both all them they tell please kitni kitna kya hai kharcha ki ka").split(/\s+/));

function questionTopic(text: string) {
  if (amountQuestion.test(text)) return "fee";
  if (lengthQuestion.test(text)) return "duration";
  if (entryQuestion.test(text)) return "entry";
}

function identityWords(text: string) {
  return text.toLowerCase().replace(/[’'.]/g, "").replace(/&/g, " and ")
    .replace(/\bcomputer science and engineering\b/g, "cse")
    .replace(/\bartificial intelligence\b/g, "ai").replace(/\bmachine learning\b/g, "ml")
    .replace(/\bktr\b/g, "kattankulathur").replace(/\btrichy\b/g, "tiruchirappalli")
    .match(/[\p{L}\p{N}]+/gu)?.filter(word => !genericWords.has(word)) ?? [];
}

type CourseTurn = { topic?: ReturnType<typeof questionTopic>; choices?: Course[]; slot?: number; group?: boolean };

function courseTurn(raw: string, slots: (Course | undefined)[], previous?: Course[]): CourseTurn | undefined {
  const text = raw.toLowerCase().trim();
  const reference = slots.length && (/\b(?:option|course|slot|pick|choice)\s+([abc])\b|\b(first|second|third)(?:\s+(?:one|choice|course|option|pick)|(?=[?.! ]*$))/.exec(text)
    || /^(?:(?:and|what about|how about)\s+)?(?:the )?([abc])[?.! ]*$/.exec(text));
  if (reference) {
    const slot = reference[1] ? "abc".indexOf(reference[1]) : ["first", "second", "third"].indexOf(reference[2]);
    const remaining = text.replace(reference[0], "it");
    // A different subject or campus alongside a slot needs a fresh lookup.
    if (identityWords(remaining).length) return;
    const course = slots[slot];
    return { choices: course ? [course] : [], slot, topic: questionTopic(remaining) };
  }
  const topic = questionTopic(text);
  const words = identityWords(text);
  if (!words.length) {
    if (topic) return { topic, group: Boolean(slots.length) && /\b(?:choices|picks|both|these|those|them|they|compare|compared|cheaper|cheapest|difference|lowest|highest|most expensive|least expensive)\b/.test(text) };
    return;
  }

  // Match only public names in the current shortlist. Every explicit word must
  // fit the same listing; a shared name is kept ambiguous across campuses.
  const choices = slots.filter((c): c is Course => Boolean(c)).filter(c => {
    const name = identityWords(c.name + " " + c.degree + " " + pickerCourse(c).short + (c.name === "Computer Science and Engineering" ? " core" : ""));
    const identity = new Set([...name, ...identityWords(c.campus), ...(c.shift ? ["shift", c.shift] : [])]);
    return words.some(word => name.includes(word)) && words.every(word => identity.has(word));
  });
  if (choices.length) return { topic, choices };
  // A campus-only answer can disambiguate a named course without switching
  // to an unrelated degree that happens to be offered at that campus.
  if (previous?.length) {
    const onCampus = slots.filter((c): c is Course => Boolean(c)).filter(c =>
      words.join(" ") === identityWords(c.campus).join(" ") && previous.some(p => p.name === c.name && p.degree === c.degree));
    if (onCampus.length) return { topic, choices: onCampus };
  }
}

const housing: Source = { href: routes.housing.href, title: "Hostel rooms and booking", section: "Campus life",
  summary: "Check hostel blocks and follow the hostel booking and office links for current availability." };
const fees: Source = { title: "Check fees and entry requirements", section: "Programmes", href: routes.fees.href,
  summary: "Choose the exact degree and campus to check its published fee and billing period." };
const examFee: Source = { title: "SRMJEEE application fee", section: "Admissions", href: routes.apply.href + "#faq",
  summary: "The SRMJEEE 2027 application fee is ₹1,400 per phase. Each phase has a separate, non-refundable fee." };
const admissions: Source = { title: "Ask Admissions", section: "Admissions", href: "/admissions#enquiry",
  summary: "Ask Admissions to confirm the requirement for your programme, campus and intake." };
const courseQuestions = { fee: "What is the tuition for this course?", duration: "How long is this course?", entry: "What subjects do I need for this course?" } as const;

function guide(answer: string, sources: Source[], suggestions?: string[]): SearchResponse {
  return { kind: "guide", answer, sources, suggestions };
}
function clarify(answer: string, sources: Source[], suggestions?: string[]): SearchResponse {
  return { kind: "reply", answer, sources, suggestions };
}
function courseTitle(c: Course) {
  const name = c.name.toLowerCase().startsWith(c.degree.toLowerCase()) ? c.name : c.degree + " " + c.name;
  return [name, c.campus, c.shift && "Shift " + c.shift, c.mode && c.mode !== "Full Time" && c.mode].filter(Boolean).join(" · ");
}
function quotedFee(c: Course) {
  const listing = programmeFee(c);
  const period = listing.period === "Listed fee" ? "billing period unspecified" : listing.period.toLowerCase();
  return [listing.fee + " (" + period + ").", listing.conflict, c.notes].filter(Boolean).join(" ");
}
function courseAnswer(course: Course, topic: keyof typeof courseQuestions, question: string, slot = -1) {
  const title = courseTitle(course);
  const topics = new Set([topic]);
  if (lengthQuestion.test(question)) topics.add("duration");
  if (entryQuestion.test(question)) topics.add("entry");
  const text = [...topics].map(item => {
    if (item === "fee") return "Published domestic fee: " + quotedFee(course);
    if (item === "entry") return criteria(course);
    return course.duration ? "Duration: " + course.duration + "." : "Confirm the duration with the faculty for your intake.";
  }).join("\n");
  const courseSource = { title, section: "Course details", href: "/programmes/" + course.id, summary: text };
  const subject = slot === -1 ? "this course" : "course " + "ABC"[slot];
  const suggestions = (Object.keys(courseQuestions) as (keyof typeof courseQuestions)[])
    .filter(key => !topics.has(key)).map(key => courseQuestions[key].replace("this course", subject));
  return guide(title + "\n\n" + text, [courseSource], suggestions);
}

function compareTuition(value: string) {
  const picked = parseShortlist(value).map(id => courseIndex.get(id));
  const ids = picked.map(course => course?.id ?? "");
  const link = { title: "Open your course comparison", section: "Compare courses", href: comparisonHref(ids),
    summary: "Open Fees & costs to see the published tuition, periods and source notes for these choices." };
  if (picked.filter(Boolean).length < 2) {
    return clarify("Which two courses would you like to compare? Add a degree and campus for each choice, then I can compare their published tuition.", [link]);
  }
  const { groups, excluded } = rankTuition(picked.map(c => c ? { ...pickerCourse(c), fee: programmeFee(c) } : null));
  const prices = groups.map(group => {
    const rows = [...group.rows].reverse().map(row => "• " + "ABC"[row.slot] + " · " + row.name + " · " + row.campus + " — " + rupees(row.amount));
    const lowest = group.rows.filter(row => row.amount === group.lowest).map(row => "ABC"[row.slot]).join(" and ");
    const verdict = group.rows.length < 2 ? "" : group.difference === 0 ? "These choices have the same tuition."
      : lowest + (lowest.length === 1 ? " has" : " have") + " the lowest tuition in this group. The difference from the highest is " + rupees(group.difference) + ".";
    return [group.period, ...rows, verdict].filter(Boolean).join("\n");
  });
  const unresolved = excluded.map(({slot, explanation}) => "• " + "ABC"[slot] + " · " + courseTitle(picked[slot]!) + " — " + explanation);
  if (unresolved.length) prices.push("Needs confirmation\n" + unresolved.join("\n"));
  if (groups.length > 1 || excluded.length) prices.push("Only fees with the same published billing period and confirmed amounts can be ranked together.");
  const details = picked.flatMap(c => c ? [{ title: courseTitle(c), section: "Course details", href: "/programmes/" + c.id, summary: quotedFee(c) }] : []);
  return guide(prices.join("\n\n"), [link, ...details]);
}

export function contextualReply(question: string, history: ChatMessage[], page: string, compare: string): SearchResponse | undefined {
  const words = question.toLowerCase();
  // Live stock and admissions decisions cannot be established from a static guide.
  if (/\b(hostels?|rooms?|beds?)\b/.test(words) && /\b(tonight|right now|today|still available|currently available|vacanc(?:y|ies)|rooms? left|beds? left)\b/.test(words)
      && /\b(free|available|left|vacan\w*|book|rooms? left|beds? left)\b/.test(words)) {
    return guide("Room availability changes as students book. Open the hostel booking service or contact the hostel office for the current vacancies at your campus.", [housing]);
  }
  const predicted = /\b(?:will|can|would|could)\s+i\s+get\s+(?:in\b|into\b|a seat\b|admission\b)|\b(?:guarantee\w*|chances of)\b.{0,30}\b(?:admission|seat|getting in)\b/i;
  if (predicted.test(question) && /\b(?:rank|marks?|percentile|score|cut[ -]?off|seat)\b|\d\s*%/i.test(question)) {
    return guide("A score or rank alone can’t confirm a seat. The course, campus, counselling round and seats available all matter. Ask Admissions about your intake and check the published entry requirements for the degree.", [admissions, fees]);
  }
  const courseId = /^\/programmes\/([a-f0-9]{11})$/.exec(page)?.[1];
  const course = courseId ? courseIndex.get(courseId) : undefined;
  const slots = page === routes.compare.href ? parseShortlist(compare).map(id => courseIndex.get(id)) : [];

  let choices = course ? [course] : undefined;
  let previousTopic: CourseTurn["topic"];
  let pageRelevant = true;
  // Reconstruct the student's references from their turns. Assistant prose never
  // establishes a course, an amount, or admission eligibility.
  for (const turn of history) {
    if (turn.role !== "user") continue;
    const previous = courseTurn(turn.content, slots, choices);
    if (!previous) {
      choices = undefined;
      previousTopic = undefined;
      pageRelevant = false;
      continue;
    }
    if (previous.choices || previous.group) {
      choices = previous.choices;
      pageRelevant = true;
    }
    previousTopic = previous.topic ?? previousTopic;
  }
  const current = courseTurn(question, slots, choices);
  if (!current) return;
  if (current.choices || current.group) {
    choices = current.choices;
    pageRelevant = true;
  }
  if (!pageRelevant) return;
  if (current.slot !== undefined && !choices?.length) {
    return clarify("There isn’t a course in slot " + "ABC"[current.slot] + " yet. Choose one on the comparison page.",
      [{ title: "Open your course comparison", section: "Compare courses", href: comparisonHref(slots.map(c => c?.id ?? "")), summary: "Choose a degree and campus for the empty slot." }]);
  }
  const topic = current.topic ?? (current.choices ? previousTopic : undefined);
  if ((topic === "fee" || topic === "entry") && (choices?.length || slots.some(Boolean))) {
    const category = history.findLast(t => t.role === "user" && /\b(?:nri|international (?:student|applicant)|foreign national|domestic|indian (?:student|applicant))\b/i.test(t.content));
    if (category && /\b(?:nri|international|foreign national)\b/i.test(category.content)) {
      const source = { href: routes.international.href, title: "International and NRI admissions", section: "Admissions",
        summary: "Check the international fee schedule and entry requirements for your applicant category, programme and campus." };
      return guide(source.summary, [source]);
    }
  }
  if (!topic) {
    if (choices?.length === 1 && current.choices) {
      const selected = choices[0];
      const label = "course " + "ABC"[slots.indexOf(selected)];
      return clarify("What would you like to know about " + courseTitle(selected) + "?", [],
        Object.values(courseQuestions).map(q => q.replace("this course", label)));
    }
    return;
  }
  if (choices?.length === 1) return courseAnswer(choices[0], topic, words, slots.indexOf(choices[0]));
  if (page === routes.compare.href) {
    if (topic === "fee" && !choices && (current.group || slots.filter(Boolean).length !== 1)) return compareTuition(compare);
    const candidates = slots.flatMap((c, slot) => c && (!choices || choices.includes(c)) ? [{ c, label: "ABC"[slot] }] : []);
    if (candidates.length === 1) return courseAnswer(candidates[0].c, topic, words, slots.indexOf(candidates[0].c));
    if (candidates.length > 1) {
      const labels = candidates.map(({ c, label }) => label + " · " + courseTitle(c));
      return clarify("Which course do you mean?\n\n" + labels.join("\n"), [],
        candidates.map(({ label }) => courseQuestions[topic].replace("this course", "course " + label)));
    }
  }
  if (topic === "fee" && page === routes.apply.href) return guide(examFee.summary, [examFee]);
  if (topic === "fee" && page === routes.housing.href) return guide("Hostel charges depend on the block and room type. Open Accommodation & dining for the room options and the hostel office’s current fee information.", [housing]);
  if (topic === "fee" && (page === routes.fees.href || /\btuition\b/i.test(question))) {
    return clarify("Which degree and campus are you considering? For example, try “BA English at KTR” or choose a listing in the fee directory.", [fees]);
  }
  if (topic === "fee") {
    return clarify("Which cost are you checking — tuition for a degree, a hostel room, or the SRMJEEE application fee?",
      [fees, housing, examFee], ["Tuition for a degree", "How much is a hostel room?", "What is the SRMJEEE application fee?"]);
  }
  if (topic === "entry" && page === routes.scholarships.href) return clarify("Which scholarship or faculty are you looking at? Each category lists its own eligibility and renewal rules.", [{ title: "Find your scholarship category", section: "Scholarships", href: routes.scholarships.href + "#categories", summary: "Open an award to read its eligibility and renewal requirements." }]);
  if (topic === "entry") return clarify("Which course and campus are you applying to? Entry subjects and the admissions route depend on the degree.", [fees, admissions]);
}
