import type { Source } from "./types";

// Only complete, standalone questions whose top guide already answers them.
// Qualifiers, multiple questions and follow-ups still go through the conversation.
const questionsByGuide: Record<string, readonly string[]> = {
  "Hostel Wi-Fi": [
    "how do i sign in to hostel wifi", "how do i connect to hostel wifi", "how do i log in to hostel wifi",
    "where can i find hostel wifi login instructions", "where is the hostel wifi login", "hostel wifi login",
  ],
  "IAC Connect": ["how do i connect to academic block wifi", "how do i sign in to academic block wifi", "iac connect login"],
  "Reset NetID password": ["how do i reset my netid password", "how can i reset my netid password", "reset my netid password"],
  "International and NRI admissions": ["how do international students apply", "how do i apply as an international student", "how can nri students apply"],
  "Join a student club": ["how can i join a student club", "how do i join a student club", "how do i join a club"],
  "Book a guided campus visit": ["how can i book a campus visit", "how do i book a campus visit"],
  "Scholarships and financial aid": ["where can i check scholarship eligibility"],
  "Book a hostel room": ["how do i book a hostel room", "how can i book a hostel room"],
  "Campus Buddy": ["where do campus buddies meet"],
  "Campus events": ["where is the campus events calendar"],
};

export function publishedAnswer(question: string, sources: Source[]): string | undefined {
  const source = sources[0];
  if (!source) return;
  const normalized = question.toLowerCase().replace(/wi[\s‐‑–-]?fi/g, "wifi")
    .replace(/[?!.]+\s*$/, "").trim().replace(/\s+/g, " ");
  if (questionsByGuide[source.title]?.includes(normalized)) return source.summary;
}
