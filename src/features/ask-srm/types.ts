export type Source = {
  title: string;
  href: string;
  section: string;
  summary: string;
};

export type ChatMessage = { role: "user" | "assistant"; content: string };

export const chatLimits = {
  question: 600,
  answer: 1800,
  history: 8,
} as const;

export type SearchResponse = {
  sources: Source[];
  answer?: string;
  kind: "matches" | "guide" | "groq" | "reply" | "unanswered";
};
