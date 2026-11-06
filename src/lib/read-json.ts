export function jsonError(error: string, status: number) {
  return Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

function allowedOrigin(request: Request) {
  const site = request.headers.get("sec-fetch-site");
  if (site === "cross-site") return false;
  const origin = request.headers.get("origin");
  if (!origin || origin === new URL(request.url).origin) return true;

  // Next can normalise the URL's host behind a proxy. Browsers set both Host and Fetch Metadata.
  const host = request.headers.get("host");
  return site === "same-origin" && (origin === "https://" + host || origin === "http://" + host);
}

export async function readJson(request: Request, maxBytes: number): Promise<{ value: unknown } | Response> {
  if (!allowedOrigin(request)) return jsonError("Invalid origin.", 403);
  const type = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if (type !== "application/json") return jsonError("Send application/json.", 415);

  const length = request.headers.get("content-length");
  if (length && Number(length) > maxBytes) return jsonError("Request body is too large.", 413);
  const reader = request.body?.getReader();
  if (!reader) return jsonError("A JSON request body is required.", 400);
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let received = 0;
  let text = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.byteLength;
      if (received > maxBytes) {
        await reader.cancel();
        return jsonError("Request body is too large.", 413);
      }
      text += decoder.decode(value, { stream: true });
    }
    return { value: JSON.parse(text + decoder.decode()) };
  } catch {
    return jsonError("Send a valid UTF-8 JSON request.", 400);
  } finally {
    reader.releaseLock();
  }
}
