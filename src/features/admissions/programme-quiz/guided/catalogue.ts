import { courses } from "@/features/explore/academic";
import { profiles } from "../profiles";
import type { Interest, Topic } from "../quiz";
import type { Format } from "./questions";

type Entry = (typeof profiles)[number];
function extra(id: string, topics: Topic[], interests: [Interest, Interest, Interest]): Entry {
  return { id, topics, interests };
}
const entries = [...profiles,
  extra("9538a8885eb", ["life", "health"], ["I", "C", "R"]),
  extra("bde09a1015e", ["media", "design"], ["A", "R", "E"]),
  extra("abf2f704b1e", ["machines", "health"], ["R", "I", "C"]),
  extra("4a24e398417", ["machines", "design"], ["R", "I", "C"]),
  extra("36dcaa18b67", ["law", "behaviour"], ["I", "C", "S"]),
  extra("2005d82754a", ["health", "life"], ["S", "I", "C"]),
];

// Illustrative course tasters, not timetable or employer claims. A method
// describes this particular taster; a degree includes many different tasks.
type Method = "steps" | "open";
const tasks: Record<string, [Format, Method, string]> = {
  "5fd6bbfe589": ["build", "steps", "Test how a small change affects a moving part."],
  "751752c633b": ["build", "open", "Try different ways to make a robot follow a line."],
  "fa1097caa18": ["investigate", "steps", "Work out where a circuit stops working."],
  "6328db32f8e": ["build", "open", "Write a small program and try two ways to solve the same problem."],
  "9ae2f70c586": ["investigate", "steps", "Clean up a set of numbers and look for a pattern."],
  "afccd862f02": ["create", "open", "Sketch different ways to make a small room work better."],
  "fb8b19a15c1": ["create", "open", "Try different shapes and fabrics for one piece of clothing."],
  "61a167bc8cd": ["build", "open", "Make two versions of an everyday object and try them out."],
  "c5f8c674c83": ["investigate", "steps", "Compare how samples grow under different conditions."],
  "c8e542cac70": ["investigate", "steps", "Follow the steps for testing a sample and check the result."],
  "bc820f397b6": ["investigate", "steps", "Check whether a pattern in numbers could be due to chance."],
  "174c8205ea4": ["investigate", "open", "Explore why the price of the same item changes."],
  "61b981b9c53": ["guide", "steps", "Work through a patient case and decide what to check next."],
  "a2bf7304bc2": ["guide", "steps", "Practise explaining a care routine to a patient."],
  "45f7b939ca2": ["guide", "steps", "Work through exercises that help someone move again."],
  "c6f117f7d14": ["investigate", "open", "Compare explanations for a change in someone’s behaviour."],
  "e7c29c55a2e": ["guide", "open", "Adapt an everyday task for someone recovering from an injury."],
  "ecaa6310de3": ["create", "open", "Try telling the same story from another person’s point of view."],
  "83388e2d08d": ["persuade", "open", "Interview two people and decide how to tell their story."],
  "07748407bec": ["create", "open", "Use pictures to explain an idea without a long paragraph."],
  "789e8c7db98": ["organise", "open", "Decide how a small business could spend a limited budget."],
  "6fc71c3768c": ["persuade", "open", "Try two ways of telling customers about a new product."],
  "af28832158a": ["organise", "steps", "Check a set of accounts and find where the money went."],
  "4e96cc4a5bd": ["investigate", "steps", "Trace what happens when a digital payment goes through."],
  "20fe4cd82ef": ["persuade", "open", "Build an argument using the facts of a case."],
  "7b3e277334f": ["investigate", "steps", "Read a business agreement and trace what each side owes."],
  "896e5ba57df": ["persuade", "open", "Compare the legal and business sides of a decision."],
  "cb26a1d8d87": ["investigate", "steps", "Compare what happens to a crop under two watering plans."],
  "457c32ab100": ["build", "steps", "Try a method for growing healthier fruit or nursery plants."],
  "003d7484800": ["organise", "steps", "Plan how a team will look after a group of guests."],
  "9538a8885eb": ["investigate", "steps", "Compare how different forms of a medicine release it."],
  "bde09a1015e": ["create", "open", "Film the same scene two ways and compare the effect."],
  "abf2f704b1e": ["build", "steps", "Test how a sensor used for health checks responds."],
  "4a24e398417": ["build", "steps", "Test how much load a model structure can take."],
  "36dcaa18b67": ["investigate", "open", "Compare different explanations for what happened in a case."],
  "2005d82754a": ["guide", "open", "Work out a meal plan that fits someone’s everyday life."],
};

const byId = new Map(courses.map(c => [c.id, c]));
export const candidates = entries.map(entry => {
  const course = byId.get(entry.id);
  if (!course || course.level !== "Undergraduate" || !tasks[entry.id]) throw new Error("Check guided quiz mapping: " + entry.id);
  const [format, method, example] = tasks[entry.id];
  // Catalogue duration is the regular-entry duration first, including the
  // separately listed MBBS internship. Unknown formats stay unavailable.
  const years = /^(\d+(?:\.\d+)?) years?\b/i.exec(course.duration);
  const internship = /\+\s*(\d+(?:\.\d+)?) years? internship/i.exec(course.duration);
  const yearsToDegree = years ? Number(years[1]) + Number(internship?.[1] || 0) : null;
  return { ...entry, course, format, method, example, yearsToDegree };
});

