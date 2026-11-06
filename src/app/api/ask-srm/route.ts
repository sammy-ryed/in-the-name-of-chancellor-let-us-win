import { isIP } from "node:net";
import { readJson } from "@/lib/read-json";
import { retrieveQuestion } from "@/features/ask-srm/search";
import { answerFromSources } from "@/features/ask-srm/answer";
import { localReply, parseConversation, redactContact } from "@/features/ask-srm/conversation";

export const runtime = "nodejs";
export const maxDuration = 30;

function send(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const parsed = await readJson(request, 64 * 1024);
  if (parsed instanceof Response) return parsed;
  const conversation = parseConversation(parsed.value);
  if (!conversation) return send({ error: "Enter a valid question and a short conversation history." }, 400);
  const { query, mode, history } = conversation;
  const handled = localReply(query);
  if (handled) return send(mode === "ask" ? handled : { kind: "matches", sources: handled.sources });
  const question = redactContact(query);
  const result = retrieveQuestion(question, history);
  if (mode === "search") return send({ kind: "matches", sources: result.sources });
  if (result.overview) return send({ kind: "guide", answer: result.overview, sources: result.sources });
  // Vercel stamps this header. On other hosts only the per-instance budget is trusted.
  const address = process.env.VERCEL === "1" ? request.headers.get("x-vercel-forwarded-for") : null;
  const client = address && isIP(address) ? address : undefined;
  return send(await answerFromSources(result.query, history, result.sources, request.signal, client));
}
