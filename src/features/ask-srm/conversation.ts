import { chatLimits, type ChatMessage, type SearchResponse, type Source } from "./types";

const instructionAttack = /\b(?:ignore|forget|override|bypass|disregard)\b.{0,45}\b(?:instructions?|guardrails?|system prompt|all rules|safety rules)\b|\b(?:print|leak|reveal|show|repeat|tell me|what is|what's)\b.{0,40}\b(?:system (?:prompt|instructions?)|developer (?:message|prompt)|api keys?|environment variables?)\b/i;
const secret = /\b(?:gsk_|sk-(?:proj-)?|gh[pousr]_)[A-Za-z0-9_-]{12,}|\b(?:password|passcode|otp|one[- ]time (?:code|password)|api[_ -]?key|access token|pin)\s*(?:[:=]\s*|is\s+(?!expired\b|invalid\b|wrong\b|incorrect\b|forgotten\b|locked\b))\S{3,}|\b(?:ra\d{8,}|(?:\d[ -]?){12,19})\b/i;
const suppliedCode = /\b(?:otp|pin|passcode|one[- ]time (?:code|password))\s+(?:is\s+)?\d{4,8}\b|\b(?:my|the)\s+password\s+(?!reset\b|expired\b|is\b|was\b|does\b|doesn.t\b|won.t\b|for\b|from\b|to\b|change\b|recovery\b|again\b)(?=\S*(?:\d|[!?@#$%&_]))\S{4,}/i;
function containsSecret(text: string): boolean {
  return secret.test(text) || suppliedCode.test(text);
}
const personalRecord = /\b(?:what(?:'s| is| are)|tell me|show(?: me)?|fetch|retrieve|look up|read(?: out)?|give me)\s+(?:my|(?:my (?:child|daughter|son)|another student|[a-z]+)['’]s)\s+(?:actual\s+|current\s+|latest\s+)?(?:attendance|marks|grades|cgpa|results|fee balance|application status|password|timetable)\b/i;

export function parseConversation(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const input = body as Record<string, unknown>;
  if (input.mode !== "ask" && input.mode !== "search") return null;
  const query = typeof input.query === "string" ? input.query.trim() : "";
  if (query.length < 2 || query.length > chatLimits.question) return null;
  const previous = input.previous ?? "";
  if (typeof previous !== "string" || previous.length > chatLimits.question) return null;
  const history = input.history ?? (previous.trim() ? [{ role: "user", content: previous }] : []);
  if (!Array.isArray(history) || history.length > chatLimits.history) return null;

  const messages: ChatMessage[] = [];
  for (const message of history) {
    if (!message || (message.role !== "user" && message.role !== "assistant")) return null;
    const max = message.role === "user" ? chatLimits.question : chatLimits.answer;
    if (typeof message.content !== "string" || !message.content.trim() || message.content.length > max) return null;
    // The client owns the history. Never promote its messages to system instructions
    // or pass a previous private form submission along with an innocuous follow-up.
    if (containsSecret(message.content) || instructionAttack.test(message.content)) continue;
    messages.push({ role: message.role, content: redactContact(message.content.trim()) });
  }
  return { query, mode: input.mode, history: messages };
}

export function redactContact(text: string): string {
  return text
    .replace(/\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b/gi, "[email omitted]")
    .replace(/(?:\+91[ -]?)?\b[6-9]\d{4}[ -]?\d{5}\b/g, "[phone omitted]")
    .replace(/\+\d{1,3}(?:[\s()-]*\d){7,13}\b/g, "[phone omitted]");
}

function reply(answer: string, sources: Source[] = []): SearchResponse {
  return { kind: "reply", answer, sources };
}

export function localReply(question: string): SearchResponse | null {
  if (containsSecret(question)) {
    return reply("Please leave out passwords, one-time codes and ID numbers. Tell me what you’re trying to do and I can help you find the right SRM service.");
  }
  if (instructionAttack.test(question)) {
    return reply("I can help with public SRM information. What would you like to know about studying here or using a campus service?");
  }
  if (personalRecord.test(question)) {
    const parent = /\b(?:child|daughter|son)\b/i.test(question);
    return reply("Only the signed-in portal can show individual records. Which intake and programme are you asking about? I can point you to the right login.", [{
      title: parent ? "Choose your parent portal" : "Choose your academic portal",
      section: parent ? "Parents" : "Students",
      href: parent ? "/parents" : "/students#portals",
      summary: "Choose the official portal for the student's intake and programme.",
    }]);
  }
  const short = question.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, "").trim();
  if (/^(?:hi+|hey+|hello+|good (?:morning|evening|afternoon)|namaste|vanakkam)(?:\s+(?:there|ask srm|srm))?$/.test(short)) {
    return reply("Hi! What would you like to know about SRM? I can help you compare programmes, plan a campus visit or find the right student service.");
  }
  if (/^(?:thanks|thank you|thank you so much|thanks a lot|thx|ty)(?:\s+(?:bro|srm))?$/.test(short)) {
    return reply("You’re welcome! Is there anything else you’d like to work through?");
  }
  return null;
}

export function topicContext(history: ChatMessage[]): string {
  return history.filter((turn) => turn.role === "user").slice(-2).map((turn) => turn.content).join(" ").slice(-750);
}

export function sourceGuide(sources: Source[]): SearchResponse {
  if (!sources.length) {
    return { kind: "unanswered", sources: [], answer: "I couldn’t find a matching SRM guide for that. Which campus, programme or service should I look for?" };
  }
  return {
    kind: "guide",
    sources,
    answer: "The AI overview is unavailable. Here’s the closest SRM guide.\n\n" + sources[0].summary.slice(0, 1100),
  };
}
