import { familyNames, type FamilyId } from "@/features/explore/course-families";
import { placementOverview, placementsQuestion } from "@/features/explore/ai-placements";
import { guides, practical } from "../family-guides";
import { core, closer, noFit, notTried, questionPath, type Answers, type Choice } from "./questions";
import { artsSubjects, frictions, workSignals, type Subject } from "./signals";

export { guides };
export { placementSources } from "@/features/explore/ai-placements";
export const coachPrompts = {
  why: "Which answers led here?", together: "Why did both families come up?",
  next: "What could I try this week?", compare: "What should I look for in a degree?", placements: placementsQuestion,
};
export type CoachPrompt = keyof typeof coachPrompts;

const bank = new Map([...core, ...Object.values(closer)].map(q => [q.id, q]));

export function validAnswers(value: unknown): value is Answers {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const entries = Object.entries(value);
  if (entries.length > core.length + 2) return false;
  for (const [key, ids] of entries) {
    const q = bank.get(key);
    if (!q || !Array.isArray(ids) || ids.length > (q.max ?? 1) || new Set(ids).size !== ids.length) return false;
    if (q.signal && ids.length === 1 && (ids[0] === noFit || ids[0] === notTried)) continue;
    if (!ids.every(id => typeof id === "string" && q.choices.some(c => c.id === id))) return false;
  }
  const active = new Set(questionPath(value as Answers).map(q => q.id));
  return entries.every(([key]) => active.has(key));
}

type Observation = { id: string; choice: Choice; reason: string; direct: boolean };
type Avoidance = { id: string; choice: Choice };
type Direction = ReturnType<typeof evidenceFor>;

// Each situation contributes at most one observation per family. A closer look
// can refine the original answer or shift its emphasis, never supply a second vote.
function readChoices(answers: Answers) {
  const byFamily = new Map<FamilyId, Map<string, Observation>>();
  const answered = new Set<string>();
  const avoidances: Avoidance[] = [];
  for (const q of questionPath(answers)) {
    if (!q.signal) continue;
    const context = q.parentId ?? q.id;
    const selected = answers[q.id] ?? [];
    for (const choice of q.choices) {
      if (!selected.includes(choice.id)) continue;
      const id = q.id + "/" + choice.id;
      if (q.signal === "aversion") {
        avoidances.push({ id, choice });
        continue;
      }
      answered.add(context);
      const clues = workSignals[id];
      if (!clues) continue;
      if (q.parentId) {
        for (const scenes of byFamily.values()) {
          const original = scenes.get(context);
          if (original) original.direct = false;
        }
      }
      clues.forEach(([family, reason], index) => {
        const scenes = byFamily.get(family) ?? new Map<string, Observation>();
        scenes.set(context, { id, choice, reason, direct: index === 0 });
        byFamily.set(family, scenes);
      });
    }
  }
  return { byFamily, answered: answered.size, avoidances };
}

function evidenceFor(id: FamilyId, scenes: Map<string, Observation> | undefined, avoidances: Avoidance[]) {
  const notes = [...(scenes?.values() ?? [])].sort((a, b) => Number(b.direct) - Number(a.direct));
  const direct = notes.filter(note => note.direct);
  const related = notes.length - direct.length;
  // Several loose associations cannot outweigh two direct, independent choices.
  const strength = direct.length * 3 + Math.min(2, related);
  const supported = direct.length >= 2 || (direct.length === 1 && related >= 2);
  const subjects = id === "arts-sciences" ? direct.map(note => artsSubjects[note.id]).filter(Boolean) : [];
  const supportedSubjects = [...new Set(subjects)].filter(subject => subjects.filter(s => s === subject).length >= 2);
  const subjectChoice = supportedSubjects.length === 1 ? supportedSubjects[0] : undefined;
  const concerns = avoidances.flatMap(avoid => {
    const concern = frictions[avoid.id]?.[id];
    if (!concern || (concern.subject && !subjects.includes(concern.subject))) return [];
    return [{ choice: avoid.choice, ...concern }];
  });
  const first = concerns[0];
  const friction = first ? "You’d rather avoid “" + first.choice.label.replace(/\.$/, "") + "”. " + first.note : null;
  return { id, notes, directCount: direct.length, strength, supported, subjectChoice, friction,
    // One task or three can reveal the same tension. It can soften a lead by
    // less than one direct choice, but never nominate another family by default.
    adjusted: strength - Number(Boolean(friction)), changeActivity: concerns.some(item => item.repeatsActivity || item.subject === subjectChoice && Boolean(subjectChoice)),
  };
}

const alternativeTrials: Partial<Record<FamilyId, string>> = {
  computing: "Draw a timetable for three teams sharing one court. Show someone how you avoided giving a team two matches at once.",
  engineering: "Find photos of two different cycle frames. Sketch where you think the rider’s weight travels and write one question you would ask the designer.",
  "architecture-design": "Choose two objects people carry on a crowded bus. Explain how the shape of each helps or gets in the way.",
  law: "Pick one school rule you would introduce. Explain who it would help and an exception you think it needs.",
  health: "Try picking up your school bag and setting it down. Use a school biology book to identify two joints involved in the movement.",
  agriculture: "Compare two places where a school could put a vegetable bed. Sketch how the plants in each would get light and water.",
  hospitality: "Imagine welcoming a guest who has never visited your school. Walk their route and list three details you could arrange before they arrive.",
};
const subjectTrials: Record<Subject, { description: string; tryThis: string; alternative: string }> = {
  writing: {
    description: "Two of your choices involved shaping a story for someone else. Writing is one direction within this broad family.",
    tryThis: "Ask someone about a place they remember well. Write a short opening in any language using one detail you want your reader to notice.",
    alternative: "Tell a short story aloud using a memory someone shared with you. Ask a listener which detail stayed with them.",
  },
  science: {
    description: "You chose to test explanations in two different situations. Experimental science is one direction within this broad family.",
    tryThis: "Place two ice cubes on different kitchen surfaces. Predict which will melt first and explain what else you would keep the same.",
    alternative: "Think of two explanations for why a wet cloth dries faster on one side of a room. Draw a simple way to tell the explanations apart.",
  },
};

function familyCard(entry: Direction) {
  const guide = guides[entry.id];
  const subject = entry.subjectChoice ? subjectTrials[entry.subjectChoice] : undefined;
  const tryThis = entry.changeActivity
    ? subject?.alternative ?? alternativeTrials[entry.id] ?? guide.tryThis
    : subject?.tryThis ?? guide.tryThis;
  return { id: entry.id, name: familyNames[entry.id], ...guide, description: subject?.description ?? guide.description,
    tryThis, friction: entry.friction, url: "/programmes/compare?family=" + entry.id };
}

const stageNotes: Record<string, string> = {
  "class-10": "Before choosing your Class 11 subjects, try one activity. Tell a teacher which part held your attention and ask which subjects would keep that route open.",
  "class-11": "Check whether the subjects you are taking meet the requirements for two degrees. Try a small part of the work before narrowing your list.",
  "class-12": "Look up the entry subjects and compare a first-year module and a practical assignment in each degree.",
  finished: "Check the entry subjects against the ones you finished school with. Then compare the first-year work in two degrees.",
};

export function recommend(answers: Answers) {
  const { byFamily, answered, avoidances } = readChoices(answers);
  const directions = (Object.keys(guides) as FamilyId[]).map(id => evidenceFor(id, byFamily.get(id), avoidances));
  const ranked = directions.filter(e => e.notes.length).sort((a, b) => b.strength - a.strength || b.notes.length - a.notes.length);
  const [first, second] = ranked;
  const positiveTie = Boolean(first && second && (first.strength === second.strength ||
    first.supported && second.supported && first.directCount === second.directCount && first.strength - second.strength === 1));
  const tension = Boolean(first?.friction && second && first.strength > second.strength && first.adjusted <= second.adjusted);
  const hasMatch = answered >= 3 && first?.supported && !positiveTie && !tension;
  const matches = hasMatch ? ranked.filter(e => e.supported && first.strength - e.strength <= 3).slice(0, 3).map(entry => ({
    ...familyCard(entry), reasons: entry.notes.slice(0, 2).map(note => "“" + note.choice.label + "” " + note.reason),
  })) : [];
  // With no positive evidence these are explicitly examples. A different
  // activity within the same family can avoid repeating a disliked task.
  const exampleOrder: FamilyId[] = ["engineering", "law", "agriculture", "hospitality", "computing", "business", "health", "architecture-design", "arts-sciences"];
  const fillers = exampleOrder.map(id => directions.find(e => e.id === id)!).filter(e => !e.notes.length)
    .sort((a, b) => Number(Boolean(a.friction)) - Number(Boolean(b.friction)));
  const activities = matches.length ? [] : [...ranked, ...fillers].slice(0, 2).map(familyCard);
  let exploreReason: string | null = null;
  if (!matches.length) {
    if (!answered) exploreReason = avoidances.length
      ? "You’ve identified work you’d rather skip. These are two examples to try while you find out what you enjoy."
      : "These are two examples of different kinds of work. Try one, or look through the degrees if neither appeals.";
    else if (answered < 3) exploreReason = "There are only a few situations to go on. These activities are examples you can try before narrowing your choices.";
    else if (positiveTie) exploreReason = "Your choices gave different families similarly strong support. These are two examples of the work you could try next.";
    else if (tension) exploreReason = "Some work you picked overlaps with a task you’d rather avoid. Try these two activities and see which parts you would want to repeat.";
    else exploreReason = "Your answers point in several directions. Try these two examples and notice which part you would willingly do again.";
  }
  const arts = directions.find(e => e.id === "arts-sciences")!;
  const subjectChoice = [...matches, ...activities].some(c => c.id === arts.id) ? arts.subjectChoice : undefined;
  const stage = answers.stage?.[0];
  return { state: matches.length ? "matches" as const : "explore" as const, matches, activities, exploreReason, subjectChoice,
    stage, stageGuide: stageNotes[stage] ?? "Try a small activity, then check which school subjects each degree asks for.",
    priorities: (answers.priorities ?? []).flatMap(id => Object.hasOwn(practical, id) ? [practical[id]] : []),
  };
}
export type FinderResult = ReturnType<typeof recommend>;

export function localCoach(result: FinderResult, prompt: CoachPrompt): string {
  if (prompt === "placements") return placementOverview;
  const [first, second] = result.matches;
  if (prompt === "compare") return [result.stageGuide, result.priorities[0] ?? first?.subjects].filter(Boolean).join(" ");
  if (!first) {
    const [a, b] = result.activities;
    if (prompt === "next") return a.tryThis + " You can also try the activity for " + b.name + " to see what you would do again.";
    return result.exploreReason + " The examples cover " + a.name + " and " + b.name + ".";
  }
  if (prompt === "next") return first.tryThis;
  if (prompt === "together" && second) return first.name + " came up through this choice. " + first.reasons[0] + " " + second.name + " came up through another. " + second.reasons[0];
  return [first.name + " came up in different situations.", ...first.reasons, first.friction].filter(Boolean).join(" ");
}
