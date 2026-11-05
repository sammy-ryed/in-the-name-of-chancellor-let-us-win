const limit = 8192;
export function fail(error: string, status: number) {
  return Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function readSubmission(request: Request): Promise<{ value: unknown } | Response> {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return fail("Send application/json.", 415);
  }
  if (Number(request.headers.get("content-length")) > limit) return fail("Quiz submission is too large.", 413);
  const reader = request.body?.getReader();
  if (!reader) return fail("A JSON submission is required.", 400);
  let input: unknown;
  try {
    const decoder = new TextDecoder("utf-8", { fatal: true });
    let body = "";
    let bytes = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > limit) {
        await reader.cancel();
        return fail("Quiz submission is too large.", 413);
      }
      body += decoder.decode(value, { stream: true });
    }
    input = JSON.parse(body + decoder.decode());
  } catch {
    return fail("Send a valid UTF-8 JSON submission.", 400);
  } finally {
    reader.releaseLock();
  }
  return { value: input };
}
