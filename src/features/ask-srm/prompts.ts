export type Prompt = {
  question: string;
  section: string;
};

const wifi: Prompt = {
  question: "How do I sign in to hostel Wi-Fi?",
  section: "Student services",
};
const fees: Prompt = {
  question: "What is the DevSecOps fee at KTR?",
  section: "Programmes",
};
const clubs: Prompt = {
  question: "How do I join a student club?",
  section: "Campus life",
};
const exam: Prompt = {
  question: "When is the SRMJEEE entrance exam?",
  section: "Admissions",
};

const firstPrompt: Record<string, Prompt> = {
  programmes: fees,
  admissions: exam,
  students: wifi,
  campus: clubs,
  parents: {
    question: "Which parent portal should I use?",
    section: "Parents",
  },
  news: {
    question: "What did Camber Racing win?",
    section: "Campus news",
  },
  events: {
    question: "Where is the campus events calendar?",
    section: "Events",
  },
  "career-centre": {
    question: "Where can I compare placement figures?",
    section: "Career Centre",
  },
};

export function promptsFor(path: string): Prompt[] {
  return [
    ...new Set([
      firstPrompt[path.split("/")[1]] ?? {
        section: "Visit SRM",
        question: "Where is SRM’s main campus?",
      },
      wifi,
      clubs,
      exam,
    ]),
  ].slice(0, 3);
}
