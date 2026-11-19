export const compareTopics = [
  { id: "study", label: "What you’ll study" },
  { id: "work", label: "Where it can lead" },
  { id: "pay", label: "Pay & placements" },
  { id: "ai", label: "AI at work" },
  { id: "cost", label: "Fees & costs" },
] as const;
export type Topic = typeof compareTopics[number]["id"];
