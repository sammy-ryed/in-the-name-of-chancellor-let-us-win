import type { Interest, Topic } from "../quiz";

export const version = "srm-ug-guided-v2";
export type Option = { id: string; label: string };
export type Question = {
  id: string; prompt: string; kind: "single" | "multiple" | "amount";
  options?: Option[]; maxChoices?: number; unit?: "INR per year";
};
function options(labels: Record<string, string>): Option[] {
  return Object.entries(labels).map(([id, label]) => ({ id, label }));
}

type Role = [id: string, interest: Interest, label: string];
function scene(id: string, prompt: string, roles: Role[]) {
  const question: Question = { id, prompt, kind: "single", options: roles.map(([id, , label]) => ({ id, label })) };
  return { question, roles };
}
// Each interest appears three times, once in each option position.
export const scenes = [
  scene("stall", "Your class gets one stall at the school fair. Which bit sounds fun?", [
    ["stand", "R", "Make a stand that stays up even if someone bumps it."],
    ["queue", "I", "Find out why the queue moves slowly."],
    ["sign", "A", "Come up with a sign people will stop to read."],
  ]),
  scene("outing", "A few friends are planning a day out. Which job would you pick?", [
    ["newcomer", "S", "Help a friend who is new to the group feel at home."],
    ["plan", "E", "Get everyone to agree on a plan."],
    ["costs", "C", "Work out everyone’s share of the cost."],
  ]),
  scene("game", "You have time for one more round of a game. What would you enjoy?", [
    ["pattern", "I", "Work out why one move keeps winning."],
    ["rule", "A", "Make up a new rule and try it out."],
    ["coach", "S", "Show someone an easier way to play."],
  ]),
  scene("match", "There’s a friendly match in your area. Which part would you take?", [
    ["teams", "E", "Bring two teams together for the match."],
    ["scores", "C", "Keep track of the scores so everyone can follow."],
    ["court", "R", "Mark out the playing area and set it up."],
  ]),
  scene("farewell", "Your class is putting together a farewell. What pulls you in?", [
    ["sketch", "A", "Turn a funny class memory into a short skit."],
    ["rehearse", "S", "Practise with a friend who is nervous about going on stage."],
    ["backing", "E", "Get the group behind an idea for the programme."],
  ]),
  scene("books", "Some neighbours are setting up a book exchange. What would you like to do?", [
    ["track", "C", "Make a simple list so people can find each book."],
    ["rack", "R", "Put together a rack for the books."],
    ["popular", "I", "Find out why some books get picked more often."],
  ]),
];

export const formats = {
  build: "Make something and try it out", investigate: "Look for an answer in facts or numbers",
  create: "Try out a few ideas and make an original version", guide: "Work directly with someone who needs help",
  organise: "Get the details in order and keep things running", persuade: "Talk through choices and bring people on board",
};
export type Format = keyof typeof formats;
export const work: Question = { id: "work", prompt: "Think of a project you’d happily spend an afternoon on. How would you like to work?", kind: "single", options: options(formats) };

export const priorities = {
  pay: "A good starting salary", sooner: "Finishing my degree sooner so I can look for work",
  service: "Helping people directly", ideas: "Room to try my own ideas",
  enterprise: "Learning how to run something of my own", security: "A steady job",
  time: "Time for family or life outside work", learning: "Going deeper into a subject I like",
};
export type Priority = keyof typeof priorities;
export const goals: Question = { id: "goals", kind: "multiple", maxChoices: 2, options: options(priorities),
  prompt: "When you think about life after college, which two things matter most? You can pick just one." };
export const salary: Question = { id: "salary", kind: "amount", unit: "INR per year",
  prompt: "What yearly pay would you like to aim for in your first job? Enter rupees, for example 600000 for ₹6 lakh. You can skip this." };

const subjectLabels: Record<Topic, string> = {
  machines: "Try getting a small machine to work", software: "Make a simple app do something useful",
  design: "Redesign a room or an everyday object", life: "Test what helps living things grow",
  numbers: "Spot a pattern in a set of numbers", health: "Learn what happens when someone needs medical care",
  behaviour: "Find out why people react differently to the same thing", media: "Turn an idea into a story, film or picture",
  business: "Work out why customers choose one shop over another", finance: "See where a business earns and spends its money",
  law: "Hear two sides of a case and use a rule to decide", agriculture: "Try two ways of growing a crop",
  hospitality: "Plan a meal and a welcome for a group of guests",
};
export const families = {
  making: ["Making things and using tech", ["machines", "software", "design"]],
  nature: ["Nature, experiments and numbers", ["life", "agriculture", "numbers"]],
  people: ["Health and how people think", ["health", "behaviour"]],
  expression: ["Stories, pictures and ideas", ["media", "design"]],
  trade: ["Money and running a business", ["business", "finance", "hospitality"]],
  community: ["Rules and how people live together", ["law", "behaviour", "hospitality"]],
} satisfies Record<string, [string, Topic[]]>;
export type Family = keyof typeof families;
export function includesTopic(group: Family, topic: Topic) {
  return (families[group][1] as Topic[]).includes(topic);
}
export const tasters: Question = { id: "tasters", kind: "multiple", maxChoices: 2,
  prompt: "If you could sit in on a free class, which areas would you try first?",
  options: Object.entries(families).map(([id, [label]]) => ({ id, label })) };
export function samples(groups: string[]): Question {
  const topicIds = new Set(groups.flatMap(id => families[id as keyof typeof families][1]));
  return { id: "samples", kind: "multiple", maxChoices: 2, prompt: "Which of these would you actually like to try?",
    options: [...topicIds].map(id => ({ id, label: subjectLabels[id] })) };
}
export { subjectLabels };

