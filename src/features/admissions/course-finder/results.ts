import { familyNames, type FamilyId } from "@/features/explore/course-families";
import { closer, core, notTried, questionPath, type Answers } from "./questions";

type FamilyGuide = {
  description: string; tradeOff: string; tryThis: string; subjects: string; tile: number;
};
export const guides: Record<FamilyId, FamilyGuide> = {
  computing: {
    description: "Use rules, data and code to make a task work reliably.",
    tradeOff: "A small program can take longer to test and fix than it took to write.",
    tryThis: "Write instructions for sorting six playing cards. Ask a friend to follow them exactly and see where a step is missing.",
    subjects: "Compare the maths, programming and statistics modules. Check the Class 12 subject combination for each degree.", tile: 6,
  },
  engineering: {
    description: "Build and test things that have to work in the physical world.",
    tradeOff: "Expect to work through calculations and unsuccessful tests before a prototype works.",
    tryThis: "Span a gap between two books with a sheet of paper. Try two different folds and compare how many coins each can hold.",
    subjects: "Look up the maths and science entry subjects for each branch, then compare the labs and design projects.", tile: 1,
  },
  "architecture-design": {
    description: "Shape objects and spaces around the people who use them.",
    tradeOff: "A design often needs several revisions after people try it or point out a constraint.",
    tryThis: "Sketch your classroom from above. Ask someone where it’s hard to move and redraw that part to suit them.",
    subjects: "Check the entry subjects, drawing or aptitude requirements and studio hours for each route.", tile: 1,
  },
  business: {
    description: "Work out how people, money and decisions fit together in an organisation.",
    tradeOff: "Making a plan involves revisiting costs and listening to people who have competing priorities.",
    tryThis: "Price a one-day snack stall on paper. See what happens to your budget if only half your customers turn up.",
    subjects: "Compare the finance, management and quantitative modules. Check whether a course specifies mathematics or another entry subject.", tile: 4,
  },
  "arts-sciences": {
    description: "Investigate a question, interpret evidence or communicate a story. This family includes several quite different paths.",
    tradeOff: "A promising explanation or a first draft may change once you look at more evidence or hear another reading.",
    tryThis: "Choose a question about your street. Collect three observations and tell the story in a short paragraph or a labelled diagram.",
    subjects: "Choose a subject within this broad family first. Compare the lab, reading or studio work and its specific Class 12 requirements.", tile: 2,
  },
  law: {
    description: "Read a rule closely, weigh different accounts and explain a reasoned position.",
    tradeOff: "An argument usually takes more careful reading, note-taking and rewriting than time spent presenting it.",
    tryThis: "Find a school rule two people read differently. Write the strongest argument for each reading and suggest clearer wording.",
    subjects: "Compare the emphasis on legal reading, writing and the accompanying subjects in each integrated degree. Check its entry route.", tile: 5,
  },
  health: {
    description: "Learn about the body and practise working carefully with people who need support.",
    tradeOff: "People-facing work needs patience, accurate records and repeated practice, including when progress is slow.",
    tryThis: "Ask someone to show you an everyday task they find awkward. Listen first, then draw two changes and ask which would help.",
    subjects: "Check the required science subjects, entrance route and clinical or supervised training for the exact health degree.", tile: 7,
  },
  agriculture: {
    description: "Study how crops, soil, water and growing conditions affect one another.",
    tradeOff: "A result may take weeks and a good plan can still be interrupted by weather or uneven conditions.",
    tryThis: "Put two similar pots in different light. Keep the rest of their care the same and record the change you expect to see.",
    subjects: "Compare the science entry subjects, fieldwork and time spent at the teaching farm for each programme.", tile: 3,
  },
  hospitality: {
    description: "Design and deliver food, service and guest experiences with a team.",
    tradeOff: "The visible event depends on preparation, cleaning and working to a timetable while people are waiting.",
    tryThis: "Plan tea for four people. Work backwards from serving time, try your timetable and note what you would prepare earlier.",
    subjects: "Compare practical kitchens, service training, placements and the stated school qualification for each route.", tile: 4,
  },
};
export const practical: Record<string, string> = {
  cost: "Compare tuition for the same period and campus. Check which compulsory charges are extra.",
  duration: "Look at the full duration, including any required internship or supervised training.",
  earning: "Compare when supervised training ends and what a first role involves. Read the cohort and year on every placement figure.",
  location: "Pick a campus you could travel to or live at, then check which degrees it actually offers.",
  options: "Look for a shared first year, optional modules and the requirements for further study.",
};

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
