import "server-only";

// Each running instance bounds outbound calls, including a second lookup on complex questions.
let windowStart = 0;
let used = 0;
let active = 0;
const callsByClient = new Map<string, number>();
function reserve(client?: string): boolean {
  const now = Date.now();
  if (now - windowStart >= 60_000) {
    windowStart = now;
    used = 0;
    callsByClient.clear();
  }
  if (active >= 3 || used >= 15) return false;
  if (client) {
    const calls = callsByClient.get(client) ?? 0;
    if (calls >= 8) return false;
    callsByClient.set(client, calls + 1);
  }
  used++;
  active++;
  return true;
}

export async function groqJson<T>(
  key: string, messages: { role: "system" | "user"; content: string }[], signal: AbortSignal, client?: string,
): Promise<T | null> {
  if (signal.aborted || !reserve(client)) return null;
  try {
    const model = process.env.GROQ_MODEL?.trim() || "openai/gpt-oss-20b";
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      cache: "no-store",
      headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
      signal,
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_completion_tokens: 1400,
        ...(model.startsWith("openai/gpt-oss-") ? { reasoning_effort: "low" } : {}),
        response_format: { type: "json_object" },
        messages,
      }),
    });
    if (!response.ok) {
      // Keep provider diagnostics independent of visitor text and credentials.
      console.warn("[SRM] Groq returned HTTP", response.status);
      return null;
    }
    const data = await response.json();
    const completion = data?.choices?.[0];
    if (completion?.finish_reason !== "stop" || typeof completion.message?.content !== "string") return null;
    return JSON.parse(completion.message.content) as T | null;
  } catch {
    return null;
  } finally {
    active--;
  }
}
