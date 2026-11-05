import type { Turn } from "./useConversation";

// Only offer a comparison for actual programme pages cited in consecutive fee answers.
export function feeAction(turns: Turn[]): string | undefined {
  const newest = turns.at(-1);
  if (!newest?.result || newest.result.kind !== "groq") return;
  const ids = new Set<string>();
  for (const turn of turns.slice(-2).reverse()) {
    const reply = turn.result;
    if (!reply || reply.kind !== "groq" || !/\b(?:fees?|tuition|costs?)\b|₹/i.test(turn.question + " " + reply.answer)) break;
    const courses = reply.sources.flatMap(source => {
      const match = source.section === "Course details" && /^\/programmes\/([a-f0-9]+)$/i.exec(source.href);
      return match ? [match[1]] : [];
    });
    if (!courses.length) break;
    courses.forEach(id => ids.add(id));
  }
  if (ids.size >= 2 && ids.size <= 3) return "/programmes/fees?compare=" + [...ids].join(",");
}
