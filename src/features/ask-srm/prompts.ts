export type Prompt = {
  question: string;
  section: string;
  icon: "study" | "campus" | "service";
};

const wifi: Prompt = {
  question: "How do I sign in to hostel Wi-Fi?",
  section: "Student services",
  icon: "service",
};
const fees: Prompt = {
  question: "What is the DevSecOps fee at KTR?",
  section: "Programmes",
  icon: "study",
};
const clubs: Prompt = {
  question: "How do I join a student club?",
  section: "Campus life",
  icon: "campus",
};
const exam: Prompt = {
  question: "When is the SRMJEEE entrance exam?",
  section: "Admissions",
  icon: "study",
};

const firstPrompt: Record<string, Prompt> = {
  programmes: fees,
  admissions: exam,
  students: wifi,
  campus: clubs,
  parents: {
    question: "Which parent portal should I use?",
    section: "Parents",
    icon: "service",
  },
  news: {
    question: "What did Camber Racing win?",
    section: "Campus news",
    icon: "campus",
  },
  events: {
    question: "Where is the campus events calendar?",
    section: "Events",
    icon: "campus",
  },
  "career-centre": {
    question: "Where can I compare placement figures?",
    section: "Career Centre",
    icon: "study",
  },
};

export function promptsFor(path: string): Prompt[] {
  return [
    ...new Set([firstPrompt[path.split("/")[1]] ?? fees, wifi, clubs, exam]),
  ].slice(0, 3);
}
