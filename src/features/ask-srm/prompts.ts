import { routes } from "@/lib/navigation";

export type Prompt = { section: string; question: string };

const fees: Prompt = { section: "Programmes", question: "What does B.Tech CSE cost at KTR?" };
const clubs: Prompt = { section: "Campus life", question: "How can I join a student club?" };
const apply: Prompt = { section: "Admissions", question: "How do international students apply?" };
const placement: Prompt = { section: "Careers", question: "What are the placement figures?" };
const first: Record<string, Prompt> = {
  [routes.finder.href]: { section: routes.finder.label, question: "How does the SRM Course Finder suggest courses?" },
  [routes.compare.href]: { section: "Your comparison", question: "Which of my choices has the lowest tuition?" },
  [routes.fees.href]: { section: "Fees", question: "How do I check tuition for my course?" },
  [routes.campusVisit.href]: { section: "Campus visits", question: "How can I book a campus visit?" },
  [routes.scholarships.href]: { section: "Scholarships", question: "Where can I check scholarship eligibility?" },
  [routes.housing.href]: { section: "Accommodation", question: "How do I book a hostel room?" },
  [routes.apply.href]: { section: "SRMJEEE", question: "What is the SRMJEEE application fee?" },
  "/campus/buddy": { section: "Campus Buddy", question: "Where do campus buddies meet?" },
  programmes: fees, admissions: apply, campus: clubs, "career-centre": placement,
  contact: { section: "Contact us", question: "How do I contact SRM admissions?" },
  parents: { section: "Parents", question: "How can a parent check attendance?" },
  students: { section: "Students", question: "How do I sign in to hostel Wi-Fi?" },
  news: { section: "News", question: "What did Camber Racing win?" },
  events: { section: "Events", question: "Where is the campus events calendar?" },
  research: { section: "Research", question: "Which research labs can I use?" },
  alumni: { section: "Alumni", question: "How can I reconnect with SRM alumni?" },
};

export function promptsFor(path: string): Prompt[] {
  if (/^\/programmes\/[a-f0-9]{11}$/.test(path)) {
    return ["What is the tuition for this course?", "What subjects do I need for this course?", "How long is this course?"]
      .map(question => ({ section: "This course", question }));
  }
  return [...new Set([first[path] ?? first[path.split("/")[1]] ?? fees, apply, clubs, placement])].slice(0, 3);
}
