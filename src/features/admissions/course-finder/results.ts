import { familyNames, type FamilyId } from "@/features/explore/course-families";
import { closer, core, notTried, questionPath, type Answers } from "./questions";

import { guides, practical } from "./family-guides";
export { guides, practical };

export function validAnswers(value: unknown): value is Answers {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const entries = Object.entries(value);
  if (entries.length > 10) return false;
  const bank = [...core, ...Object.values(closer)];
  for (const [key, ids] of entries) {
    const question = bank.find(item => item.id === key);
    if (!question || !Array.isArray(ids) || ids.length > (question.max ?? 1) || new Set(ids).size !== ids.length) return false;
    if (ids.length === 1 && ids[0] === notTried && key !== "stage" && key !== "priorities") continue;
    if (ids.some(id => typeof id !== "string" || !question.choices.some(choice => choice.id === id))) return false;
  }
  const path = questionPath(value as Answers);
  return entries.every(([key]) => path.some(question => question.id === key));
}

export function recommend(answers: Answers) {
  const path = questionPath(answers);
  const totals = new Map<FamilyId, { points: number; reasons: string[] }>();
  let answered = 0;
  for (const q of path) {
    const chosen = q.choices.filter(c => c.observation && answers[q.id]?.includes(c.id));
    if (!chosen.length) continue;
    answered++;
    // An answer that names one kind of work is more specific than an answer
    // shared by three families. Each prompt contributes at most once per family.
    for (const family of Object.keys(guides) as FamilyId[]) {
      const best = chosen.filter(c => c.families.includes(family)).sort((a, b) => a.families.length - b.families.length)[0];
      if (!best) continue;
      const previous = totals.get(family) ?? { points: 0, reasons: [] };
      previous.points += 6 / best.families.length;
      previous.reasons.push(best.label + " — " + best.observation + ".");
      totals.set(family, previous);
    }
  }
  const ranking = [...totals].sort((a, b) => b[1].points - a[1].points || b[1].reasons.length - a[1].reasons.length);
  const eligible = ranking.filter(([, entry]) => entry.reasons.length >= 2);
  const equallySplit = eligible.length > 1 && eligible[0][1].points === eligible[1][1].points;
  const explore = answered < 3 || !eligible.length || equallySplit;
  const strongest = eligible[0]?.[1].points ?? 0;
  const matches = explore ? [] : eligible.filter(([, entry]) => entry.points >= strongest * 0.55).slice(0, 3)
    .map(([id, entry]) => {
      const reasons = entry.reasons;
      return { id, name: familyNames[id], ...guides[id], reasons: [reasons[0], reasons[reasons.length - 1]], url: "/programmes/compare?family=" + id };
    });
  const first = ranking[0]?.[0] ?? "engineering";
  const second = ranking.map(([id]) => id).find(id => id !== first && guides[id].tile !== guides[first].tile)
    ?? (first === "law" ? "engineering" : "law");
  const activities = explore ? [first, second].map(id => ({ id, name: familyNames[id], ...guides[id], url: "/programmes/compare?family=" + id })) : [];
  const stage = answers.stage?.[0];
  const stageGuide = stage === "class-10"
    ? "Before choosing your Class 11 subjects, try a small activity below. Bring what you noticed to a teacher and ask which subjects let you explore it further."
    : stage === "class-11" ? "You have time to experiment. Try an activity, then check how the subjects you’re taking line up with two degrees."
    : stage === "class-12" || stage === "finished" ? "Choose two actual degrees and compare their entry subjects, required modules and first-year work."
    : "Try an activity, then look up the school subjects each degree asks for.";
  return { state: explore ? "explore" as const : "matches" as const, matches, activities, stageGuide, stage,
    priorities: (answers.priorities ?? []).flatMap(id => practical[id] ? [practical[id]] : []) };
}
export type FinderResult = ReturnType<typeof recommend>;
export const coachPrompts = {
  why: "Why did these families come up?",
  together: "Why did these two families come up together?",
  next: "How can I try this before I decide?",
  compare: "What should I check when I compare degrees?",
};
export type CoachPrompt = keyof typeof coachPrompts;

export function localCoach(result: FinderResult, prompt: CoachPrompt): string {
  const [first, second] = result.matches;
  if (prompt === "compare") return [result.stageGuide, ...result.priorities.slice(0, 1), first?.subjects ?? "Start with the entry subjects and one required first-year module."].join(" ");
  if (!first) {
    const [a, b] = result.activities;
    if (prompt === "next") return a.tryThis + " Then notice which part you would willingly do again.";
    return "Your answers leave several directions open. Try one activity from " + a.name + " and one from " + b.name + ". Write down which part you would do a second time and use that to revisit your choices.";
  }
  if (prompt === "next") return first.tryThis + " Afterwards, write down what you wanted to keep doing and what you would hand off.";
  if (prompt === "together" && second) {
    return first.name + " showed up through this choice: " + first.reasons[0] + " " + second.name + " also showed up through: " + second.reasons[1] + " Trying the two activities will help you see which kind of work you want to repeat.";
  }
  return first.name + " came up because of two things you picked. " + first.reasons.join(" ") + " " + first.description;
}
