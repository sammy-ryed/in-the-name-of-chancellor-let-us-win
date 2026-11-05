import { goals, salary, samples, scenes, tasters, version, work, type Question } from "./questions";
import { choices, shortlist, type Answers } from "./score";

const method: Question = { id: "method", kind: "single",
  prompt: "You’re trying something new. Which start sounds more like you?",
  options: [{ id: "steps", label: "Give me a few clear steps. I like checking how I’m doing." },
    { id: "open", label: "Give me the goal. I like trying my own way first." }] };
function* questions(answers: Answers): Generator<Question> {
  for (const scene of scenes) yield scene.question;
  yield work;
  yield method;
  yield tasters;
  const groups = choices(answers, "tasters");
  if (groups.length) yield samples(groups);
  yield goals;
  if (choices(answers, "goals").includes("pay")) yield salary;
}

function nextQuestion(q: Question) {
  return { version, state: "question" as const,
    question: { ...q, canSkip: true, skipLabel: "Not sure / skip", ...(q.kind === "amount" ? { min: 1, max: Number.MAX_SAFE_INTEGER } : {}) } };
}
export function start() {
  return nextQuestion(scenes[0].question);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function valid(q: Question, value: unknown): value is string | string[] | number | null {
  if (value === null) return true;
  if (q.kind === "amount") return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
  const allowed = new Set(q.options?.map(o => o.id));
  if (q.kind === "single") return typeof value === "string" && allowed.has(value);
  return Array.isArray(value) && value.length >= 1 && value.length <= (q.maxChoices ?? 1) &&
    new Set(value).size === value.length && value.every(v => typeof v === "string" && allowed.has(v));
}

export function advance(input: unknown) {
  if (!isRecord(input) || Object.keys(input).some(k => k !== "version" && k !== "answers") ||
      !Array.isArray(input.answers)) return { error: "Send a version and an ordered list of answers.", status: 422 } as const;
  if (input.version !== version) return { error: "Start again to load the current questions.", status: 409 } as const;
  const answers: Answers = new Map();
  const steps = questions(answers);
  let next = steps.next();
  for (const entry of input.answers) {
    if (next.done || !isRecord(entry) || Object.keys(entry).length !== 2 || entry.questionId !== next.value.id ||
        !valid(next.value, entry.value)) return { error: "Check the last answer and send the questions in order.", status: 422 } as const;
    answers.set(next.value.id, entry.value);
    next = steps.next();
  }
  return { body: next.done ? { version, state: "complete" as const, result: shortlist(answers) } : nextQuestion(next.value) };
}

