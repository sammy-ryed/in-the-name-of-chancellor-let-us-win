import { retrieveQuestion } from "@/features/ask-srm/search";
import { answerFromSources } from "@/features/ask-srm/answer";
import { localReply, parseConversation, redactContact } from "@/features/ask-srm/conversation";

export const runtime = "nodejs";
export const maxDuration = 30;

function send(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  // Next may canonicalise a loopback or proxy host in request.url. Browsers
  // supply Fetch Metadata independently of application JavaScript.
  const publicHost = request.headers.get("host");
  const sameBrowserOrigin =
    request.headers.get("sec-fetch-site") === "same-origin" &&
    (origin === "https://" + publicHost || origin === "http://" + publicHost);
  if (origin && origin !== new URL(request.url).origin && !sameBrowserOrigin)
    return send({ error: "Invalid origin" }, 403);
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return send({ error: "Expected JSON" }, 415);

  const maxBytes = 64 * 1024;
  const reader = request.body?.getReader();
  if (!reader) return send({ error: "Enter a question" }, 400);
  let body: unknown;
  try {
    const chunks: Uint8Array[] = [];
    let size = 0;
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        return send({ error: "Conversation is too long" }, 413);
      }
      chunks.push(value);
    }
    body = JSON.parse(Buffer.concat(chunks, size).toString("utf8"));
  } catch {
    return send({ error: "Invalid conversation" }, 400);
  } finally {
    reader.releaseLock();
  }

  const conversation = parseConversation(body);
  if (!conversation) return send({ error: "Enter a valid question and a short conversation history." }, 400);
  const { query, mode, history } = conversation;
  const handled = localReply(query);
  if (handled) return send(mode === "ask" ? handled : { kind: "matches", sources: handled.sources });
  const question = redactContact(query);
  const result = retrieveQuestion(question, history);
  if (mode === "search") return send({ kind: "matches", sources: result.sources });
  if (result.overview) return send({ kind: "guide", answer: result.overview, sources: result.sources });
  return send(await answerFromSources(result.query, history, result.sources, request.signal));
}
