export type Source = {
  title: string;
  href: string;
  section: string;
  summary: string;
};

export type SearchResponse = {
  sources: Source[];
  answer?: string;
  kind: "matches" | "guide" | "groq" | "unanswered";
};
