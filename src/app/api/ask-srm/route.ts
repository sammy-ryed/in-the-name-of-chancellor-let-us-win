import { isIP } from "node:net";
import { readJson } from "@/lib/read-json";
import { retrieveQuestion } from "@/features/ask-srm/search";
import { contextualReply } from "@/features/ask-srm/question-context";
import { publishedAnswer } from "@/features/ask-srm/published-answer";
import { answerFromSources } from "@/features/ask-srm/answer";
import { localReply, parseConversation, redactContact } from "@/features/ask-srm/conversation";
import type { SearchResponse } from "@/features/ask-srm/types";

export const runtime = "nodejs";
export const maxDuration = 30;

function send(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

function localResult(mode: "ask" | "search", result: SearchResponse) {
  if (mode === "ask") return send(result);
  const { kind, answer, suggestions, sources } = result;
  const resolved = answer && (kind === "guide" || kind === "reply" || kind === "unanswered")
    ? { kind, answer, suggestions } : undefined;
  return send({ kind: "matches", sources, resolved } satisfies SearchResponse);
}

export async function POST(request: Request) {
  const parsed = await readJson(request, 64 * 1024);
  if (parsed instanceof Response) return parsed;
  const conversation = parseConversation(parsed.value);
  if (!conversation) return send({ error: "Enter a valid question and a short conversation history." }, 400);
  const { query, mode, history, page, compare } = conversation;
  const question = redactContact(query);
  const handled = localReply(query) ?? contextualReply(question, history, page, compare);
  if (handled) return localResult(mode, handled);
  const result = retrieveQuestion(question, history);
  const overview = result.overview ?? (!history.length ? publishedAnswer(question, result.sources) : undefined);
  if (overview) return localResult(mode, { kind: "guide", answer: overview, sources: result.sources });
  if (mode === "search") return send({ kind: "matches", sources: result.sources });
  // Vercel stamps this header. On other hosts only the per-instance budget is trusted.
  const address = process.env.VERCEL === "1" ? request.headers.get("x-vercel-forwarded-for") : null;
  const client = address && isIP(address) ? address : undefined;
  return send(await answerFromSources(result.query, history, result.sources, request.signal, client));
}
