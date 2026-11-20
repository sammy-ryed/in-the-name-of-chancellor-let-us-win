import { isIP } from "node:net";
import { groqJson } from "@/lib/groq";
import { jsonError, readJson } from "@/lib/read-json";
import { courses } from "@/features/explore/academic";
import { familyFor } from "@/features/explore/course-families";

const headers = { "Cache-Control": "no-store" };

type Answers = Record<string, string[]>;
type CoachFamily = {
  id: string; name: string; description: string; tryThis: string; tradeOff: string; subjects: string; reasons?: string[]; friction?: string | null;
};
type CourseResult = {
  matches: CoachFamily[]; activities: CoachFamily[]; state: "matches" | "explore"; exploreReason?: string | null; stageGuide: string; priorities: string[];
};

export function createFinderRoute<Result extends CourseResult, Prompt extends string>(finder: {
  version: string; core: readonly { id: string }[];
  validAnswers: (value: unknown) => value is Answers;
  recommend: (answers: Answers) => Result;
  coachPrompts: Record<Prompt, string>;
  reviewedSources?: Partial<Record<Prompt, { label: string; href: string }[]>>;
  localCoach: (result: Result, prompt: Prompt) => string;
}) {
  const { version, core, validAnswers, recommend, coachPrompts, localCoach } = finder;
  function GET() {
    return Response.json({ version, firstQuestion: core[0], coreQuestions: core.length, maxFollowups: 2 }, { headers });
  }
  async function POST(request: Request) {
    const parsed = await readJson(request, 8192);
    if (parsed instanceof Response) return parsed;
    const body = parsed.value;
    if (!body || typeof body !== "object" || Array.isArray(body) || !("version" in body) || body.version !== version ||
        !("answers" in body) || !validAnswers(body.answers) || Object.keys(body).some(key => !["version", "answers", "prompt"].includes(key))) {
      return jsonError("Send the current finder version and valid answer IDs.", 422);
    }
    const result = recommend(body.answers);
    if (!("prompt" in body)) return Response.json({ version, result }, { headers });
    if (typeof body.prompt !== "string" || !Object.hasOwn(coachPrompts, body.prompt)) return jsonError("Choose a question for the coach.", 422);
    const prompt = body.prompt as Prompt;
    const sources = finder.reviewedSources?.[prompt];
    if (sources) return Response.json({ version, provider: "local", answer: localCoach(result, prompt), sources }, { headers });
    const fallback = () => Response.json({ version, provider: "local", answer: localCoach(result, prompt) }, { headers });
    const key = process.env.GROQ_API_KEY?.trim();
    if (!key) return fallback();
    const families = (result.matches.length ? result.matches : result.activities).map(family => ({
      name: family.name, description: family.description, tryThis: family.tryThis, tradeOff: family.tradeOff, subjectCheck: family.subjects,
      evidence: family.reasons ?? [], friction: family.friction ?? undefined,
      listedUndergraduateCourseAndCampusRecords: courses.filter(c => c.level === "Undergraduate" && familyFor(c) === family.id).length,
    }));
    const instruction = [
      "You are the guided coach in the SRM course finder. Help a school student reflect on their own choices in two or three short, plain sentences.",
      "Explain only the supplied families using the supplied choice evidence, approved activity notes and catalogue facts. The engine has already selected and ordered the families.",
      "If mode is explore, keep the choice open and suggest the contrasting activities. Never nominate a winner or a named degree, infer personal traits, promise outcomes, or invent admission requirements or pay.",
      "When a student would hand off part of an activity, name it only as a trade-off. Never use it as proof they enjoy a field or lack the ability to do it.",
      "Answer the selected prompt directly. Return a JSON object with the string field answer. No links, markdown, headings or emojis.",
    ].join(" ");
    const address = process.env.VERCEL === "1" ? request.headers.get("x-vercel-forwarded-for") : null;
    const explanation = await groqJson<{ answer?: unknown }>(key, [
      { role: "system", content: instruction },
      { role: "user", content: JSON.stringify({
        prompt: coachPrompts[prompt], mode: result.state, exploreReason: result.exploreReason,
        chosenIds: Object.entries(body.answers).flatMap(([q, ids]) => ids.map(id => q + "/" + id)),
        families, stageGuidance: result.stageGuide, priorities: result.priorities,
      }) },
    ], AbortSignal.any([request.signal, AbortSignal.timeout(7000)]), address && isIP(address) ? address : undefined);
    const answer = typeof explanation?.answer === "string" ? explanation.answer.trim() : "";
    if (!answer || answer.length > 800 || /https?:|www\.|[<>₹]|\b(?:CTC|LPA|guaranteed|B\.?Tech|MBBS)\b/i.test(answer)) return fallback();
    return Response.json({ version, provider: "groq", answer }, { headers });
  }
  return { GET, POST };
}
