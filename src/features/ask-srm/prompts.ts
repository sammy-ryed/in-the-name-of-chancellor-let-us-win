export type Prompt = { section: string; question: string };

const fees: Prompt = { section: "Programmes", question: "What does B.Tech CSE cost at KTR?" };
const clubs: Prompt = { section: "Campus life", question: "How can I join a student club?" };
const apply: Prompt = { section: "Admissions", question: "How do international students apply?" };
const placement: Prompt = { section: "Careers", question: "What are the placement figures?" };
const first: Record<string, Prompt> = {
  programmes: fees, admissions: apply, campus: clubs, "career-centre": placement,
  parents: { section: "Parents", question: "How can a parent check attendance?" },
  students: { section: "Students", question: "How do I sign in to hostel Wi-Fi?" },
  news: { section: "News", question: "What did Camber Racing win?" },
  events: { section: "Events", question: "Where is the campus events calendar?" },
  research: { section: "Research", question: "Which research labs can I use?" },
  alumni: { section: "Alumni", question: "How can I reconnect with SRM alumni?" },
};

export function promptsFor(path: string): Prompt[] {
  return [...new Set([first[path.split("/")[1]] ?? fees, apply, clubs, placement])].slice(0, 3);
}
