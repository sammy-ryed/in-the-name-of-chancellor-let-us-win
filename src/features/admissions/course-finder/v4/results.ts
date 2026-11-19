import { familyNames, type FamilyId } from "@/features/explore/course-families";
import { guides, practical } from "../family-guides";
import { closer, core, noFit, notTried, questionPath, type Answers, type Choice } from "./questions";

import { placementOverview, placementsQuestion } from "@/features/explore/ai-placements";

export { placementSources } from "@/features/explore/ai-placements";
export { guides };
export const coachPrompts = {
  placements: placementsQuestion,
  why: "Which answers led here?",
  together: "Why did both families come up?",
  next: "What could I try this week?",
  compare: "What should I look for in a degree?",
};
export type CoachPrompt = keyof typeof coachPrompts;

const bank = new Map([...core, ...Object.values(closer)].map(question => [question.id, question]));

export function validAnswers(value: unknown): value is Answers {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const entries = Object.entries(value);
  if (entries.length > core.length + 2) return false;
  for (const [key, ids] of entries) {
    const question = bank.get(key);
    if (!question || !Array.isArray(ids) || ids.length > (question.max ?? 1) || new Set(ids).size !== ids.length) return false;
    if (question.signal && ids.length === 1 && (ids[0] === noFit || ids[0] === notTried)) continue;
    if (!ids.every(id => typeof id === "string" && question.choices.some(choice => choice.id === id))) return false;
  }
  const active = new Set(questionPath(value as Answers).map(question => question.id));
  return entries.every(([key]) => active.has(key));
}

type Evidence = {
  id: FamilyId;
  tasks: Choice[];
  followups: Choice[];
  interest: boolean;
};

function concreteCount(entry: Evidence) {
  return entry.tasks.length + entry.followups.length;
}

// These interests sit inside the same catalogue family. Keep its identity and
// course link, but let the student try the kind of work they actually picked.
const artsActivities: Record<string, Pick<typeof guides["arts-sciences"], "description" | "tradeOff" | "tryThis" | "subjects">> = {
  writing: {
    description: "You picked interviewing and writing. One route through this broad family is finding stories and giving readers an account they can follow.",
    tradeOff: "Be ready to rewrite a favourite line if your notes don’t support it.",
    tryThis: "Interview someone about a change they’ve seen in your neighbourhood. Write 100 words in a language you like, then ask them to check one detail.",
    subjects: "Compare how much reporting, editing or close reading the first-year assignments involve.",
  },
  film: {
    description: "You picked planning scenes. Film and performance are two ways to explore storytelling within this broad family.",
    tradeOff: "A scene you like may need to be cut or reordered for the whole story to make sense.",
    tryThis: "Draw six frames for a short scene with no dialogue. Swap the order of two frames and ask someone what changed about the story.",
    subjects: "Look at which modules are required and how much of the course involves making films, studying them or performing.",
  },
  science: {
    description: "You picked the light experiment. The experimental sciences are one route within this broad family.",
    tradeOff: "You may have to repeat the same measurement several times before you can explain a result.",
    tryThis: "Stand a pencil upright and trace its shadow. Move a torch closer, leaving the pencil in place. Predict the change, then compare the outlines.",
    subjects: "Check the school science subjects each degree requires and look for the experiments students do in the first year.",
  },
  maths: {
    description: "You picked number patterns. One route within this broad family is mathematics, where you work out why a rule holds.",
    tradeOff: "A few examples can suggest a pattern. Showing why it holds takes more work.",
    tryThis: "Add consecutive odd numbers, starting with 1. Draw dots for each total. Can you use the drawings to explain what the next total will be?",
    subjects: "Compare required maths modules and how much time students spend on proofs, modelling and computations.",
  },
  people: {
    description: "You picked a question about memory. Exploring how people think and behave is one route within this broad family.",
    tradeOff: "Two accounts can differ even when both people are trying to be accurate. It takes care to explain what an observation supports.",
    tryThis: "Show two willing people the same picture for 30 seconds. Ask each what they remember. Compare their lists and think of two possible reasons for a difference.",
    subjects: "Compare the first-year psychology or behavioural science modules and how students learn to design and interpret studies.",
  },
};

function familyCard(id: FamilyId, answers: Answers) {
  const interest = answers["closer-arts-sciences"]?.[0];
  const detail = id === "arts-sciences" && Object.hasOwn(artsActivities, interest) ? artsActivities[interest] : undefined;
  return { id, name: familyNames[id], ...guides[id], ...detail, url: "/programmes/compare?family=" + id };
}

function explainChoice(choice: Choice) {
  const observation = choice.observation!.trim();
  const sentence = observation[0].toUpperCase() + observation.slice(1);
  return `You chose “${choice.label}”. ${sentence}${/[.!?]$/.test(sentence) ? "" : "."}`;
}

const stageNotes: Record<string, string> = {
  "class-10": "Try an activity before you choose your Class 11 subjects. Tell a teacher which part you liked and ask which subject combinations would keep that route open.",
  "class-11": "Try a small piece of the work now. Then check the entry subjects of two degrees against the subjects you are taking.",
  "class-12": "Compare the required modules and entry subjects of two degrees. Pick one first-year task you would like to try before applying.",
  finished: "Check the entry requirements against the subjects you finished with. Compare one required module and a practical project in each degree.",
};

export function recommend(answers: Answers) {
  const signals = new Map<FamilyId, Evidence>();
  let answered = 0;
  for (const question of questionPath(answers)) {
    if (!question.signal) continue;
    const chosen = (answers[question.id] ?? []).flatMap(id => {
      const choice = question.choices.find(item => item.id === id);
      return choice?.families.length && (question.signal === "interest" || choice.observation?.trim()) ? [choice] : [];
    });
    if (!chosen.length) continue;
    answered++;
    // Only the work actually described by the choice earns evidence. Nearby fields
    // and two selections on the same prompt cannot supply a second reason.
    const seen = new Set<FamilyId>();
    for (const choice of chosen) {
      const family = choice.families[0];
      if (seen.has(family)) continue;
      seen.add(family);
      const entry: Evidence = signals.get(family) ?? { id: family, tasks: [], followups: [], interest: false };
      signals.set(family, entry);
      if (question.signal === "interest") entry.interest = true;
      else if (question.signal === "task") entry.tasks.push(choice);
      else entry.followups.push(choice);
    }
  }

  const ranked = [...signals.values()].sort((a, b) =>
    concreteCount(b) - concreteCount(a) || b.tasks.length - a.tasks.length || Number(b.interest) - Number(a.interest));
  const [first, next] = ranked;
  const tied = first && next && concreteCount(first) === concreteCount(next);
  // An interest can open a question, but never settle a tie or corroborate the
  // answer to that question. At least one observation must come from the common tasks.
  const supported = (entry: Evidence) => entry.tasks.length > 0 && concreteCount(entry) >= 2;
  const workChoices = ranked.reduce((count, entry) => count + concreteCount(entry), 0);
  const scattered = first && concreteCount(first) === 2 && workChoices >= 5 && !first.interest;
  const hasMatch = answered >= 3 && first && supported(first) && !tied && !scattered;
  const matches = hasMatch ? ranked.filter(entry => supported(entry) && concreteCount(entry) >= concreteCount(first) - 1)
    .slice(0, 3).map(entry => {
      const second = entry.followups[0] ?? entry.tasks[1];
      return { ...familyCard(entry.id, answers), reasons: [explainChoice(entry.tasks[0]), explainChoice(second)] };
    }) : [];
  const firstActivity = first?.id ?? "engineering";
  const secondActivity = next?.id ?? (firstActivity === "law" ? "engineering" : "law");
  const activities = matches.length ? [] : [firstActivity, secondActivity].map(id => familyCard(id, answers));
  let exploreReason: string | null = null;
  if (!matches.length) {
    if (!answered) {
      exploreReason = "These two activities are examples. Try one, or look through the degrees if neither appeals to you.";
    } else if (tied && concreteCount(first) >= 2) {
      exploreReason = "You picked tasks from these families equally often. Try a short task from each before you narrow it down.";
    } else if (scattered) {
      exploreReason = "You picked work from several different families. Try these two activities and notice which one you would come back to.";
    } else {
      exploreReason = "There isn’t a recurring pattern across enough of your choices yet. Try these two activities and see what holds your attention.";
    }
  }
  const stage = answers.stage?.[0];
  return {
    state: matches.length ? "matches" as const : "explore" as const, matches, activities, exploreReason,
    stage, stageGuide: stageNotes[stage] ?? "Try one activity. Then check which school subjects each degree asks for.",
    priorities: (answers.priorities ?? []).flatMap(id => Object.hasOwn(practical, id) ? [practical[id]] : []),
  };
}
export type FinderResult = ReturnType<typeof recommend>;

export function localCoach(result: FinderResult, prompt: CoachPrompt): string {
  if (prompt === "placements") return placementOverview;
  const [first, second] = result.matches;
  if (prompt === "compare") {
    const advice = first?.subjects ?? "Compare the entry subjects and one required first-year module in each degree.";
    return [result.stageGuide, result.priorities[0] ?? advice].join(" ");
  }
  if (!first) {
    const [a, b] = result.activities;
    if (prompt === "next") return a.tryThis + " After that, try the activity for " + b.name + " and see which one you want to repeat.";
    return result.exploreReason + " The activities here explore " + a.name + " and " + b.name + ".";
  }
  if (prompt === "next") return first.tryThis + " When you finish, write down the part you wanted to keep doing.";
  if (prompt === "together" && second) {
    return first.name + " came up more than once. " + first.reasons[0] + " " + second.name + " also came up more than once. " + second.reasons[0];
  }
  return first.name + " came up in two separate choices. " + first.reasons.join(" ");
}
