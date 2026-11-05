export const version = "srm-ug-v1";
export const interests = {
  R: "hands-on work", I: "investigation", A: "creative expression",
  S: "helping people learn or recover", E: "leading and persuading", C: "organising information",
} as const;
export type Interest = keyof typeof interests;

export const items: { id: string; interest: Interest; prompt: string }[] = [
  { id: "assemble", interest: "R", prompt: "Build a working model from parts." },
  { id: "investigate", interest: "I", prompt: "Design an experiment to explain a surprising observation." },
  { id: "compose", interest: "A", prompt: "Tell a story using images, words or sound." },
  { id: "teach", interest: "S", prompt: "Help someone understand an idea they find difficult." },
  { id: "pitch", interest: "E", prompt: "Persuade a group to try a plan you believe in." },
  { id: "audit", interest: "C", prompt: "Trace an error by checking records against each other." },
  { id: "adjust", interest: "R", prompt: "Use tools to adjust a device until it works smoothly." },
  { id: "patterns", interest: "I", prompt: "Study a set of observations to figure out what explains a pattern." },
  { id: "create", interest: "A", prompt: "Experiment with several original designs for the same brief." },
  { id: "support", interest: "S", prompt: "Listen to someone describe a difficulty and help them practise a next step." },
  { id: "coordinate", interest: "E", prompt: "Lead a team through a decision when people disagree." },
  { id: "organise", interest: "C", prompt: "Organise information so another person can reliably follow a process." },
];

export const topics = {
  machines: "Build and test machines or electronic systems",
  software: "Write software and investigate how algorithms work",
  design: "Design spaces, objects or clothing for people to use",
  life: "Investigate living things in a laboratory",
  numbers: "Use mathematics and data to explain patterns",
  health: "Study the human body and practise caring for patients",
  behaviour: "Explore how people think, learn and behave",
  media: "Write, tell stories or communicate through images",
  business: "Explore how businesses attract customers and make decisions",
  finance: "Work through accounts and financial decisions",
  law: "Interpret laws and reason through cases",
  agriculture: "Study how crops grow and how farms use resources",
  hospitality: "Plan how a hotel welcomes, feeds and looks after guests",
} as const;
export type Topic = keyof typeof topics;
export const maxTopics = 3;
export const questionnaire = {
  version, title: "Find your SRM programme", scope: "Undergraduate options after Class 12",
  prompt: "How much would you enjoy trying each activity, even if you have never done it?",
  scale: ["Strongly dislike", "Dislike", "Neutral", "Enjoy", "Strongly enjoy"].map((label, i) => ({ value: i + 1, label })),
  questions: items.map(({ id, prompt }) => ({ id, prompt })),
  topicPrompt: "Which activities would you most like to try in a course? Choose up to three, or leave this open.",
  maxTopics, topics: Object.entries(topics).map(([id, label]) => ({ id, label })),
  interpretation: "Use this shortlist to compare courses. Check subjects, entry requirements and current availability with SRM.",
  research: ["https://doi.org/10.1016/j.edurev.2024.100619", "https://doi.org/10.1080/03075079.2024.2413867"],
};

export type Submission = { version: string; answers: Record<string, number>; topics: Topic[] };
const record = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === "object" && !Array.isArray(v);

export function validate(input: unknown): string | undefined {
  if (!record(input) || Object.keys(input).some(k => !["version", "answers", "topics"].includes(k))) return "Expected version, answers and topics.";
  if (input.version !== version) return "Reload the quiz to get its current version.";
  const answers = input.answers;
  if (!record(answers) || Object.keys(answers).length !== items.length || items.some(({ id }) => {
    const n = answers[id];
    return typeof n !== "number" || !Number.isInteger(n) || n < 1 || n > 5;
  })) return "Rate every listed activity once using a whole number from 1 to 5.";
  if (!Array.isArray(input.topics) || input.topics.length > maxTopics || new Set(input.topics).size !== input.topics.length ||
      input.topics.some(t => typeof t !== "string" || !Object.hasOwn(topics, t))) return "Choose up to three different study activities from the list.";
}

