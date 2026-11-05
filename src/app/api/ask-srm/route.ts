import { findSources } from "@/features/ask-srm/search";
import { answerFromSources } from "@/features/ask-srm/answer";

export const runtime = "nodejs";
export const maxDuration = 30;

function send(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
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
  const maxBytes = 4096;
  const reader = request.body?.getReader();
  if (!reader) return send({ error: "Enter a search" }, 400);
  let body;
  try {
    const bytes = new Uint8Array(maxBytes);
    let size = 0;
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      if (size + value.length > maxBytes) {
        await reader.cancel();
        return send({ error: "Search is too long" }, 413);
      }
      bytes.set(value, size);
      size += value.length;
    }
    body = JSON.parse(new TextDecoder().decode(bytes.subarray(0, size)));
  } catch {
    return send({ error: "Invalid search" }, 400);
  } finally {
    reader.releaseLock();
  }
  const query = typeof body?.query === "string" ? body.query.trim() : "";
  const previous = body?.previous ?? "";
  if (
    query.length < 2 ||
    query.length > 300 ||
    typeof previous !== "string" ||
    previous.length > 300 ||
    !["search", "ask"].includes(body?.mode)
  ) {
    return send({ error: "Use a question between 2 and 300 characters." }, 400);
  }
  const sources = findSources(query, previous);
  if (body.mode === "search") return send({ kind: "matches", sources });
  return send(
    await answerFromSources(query, previous, sources, request.signal),
  );
}
