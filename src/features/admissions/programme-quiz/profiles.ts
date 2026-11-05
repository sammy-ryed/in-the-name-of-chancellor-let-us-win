import type { Interest, Topic } from "./quiz";

// One existing admissions course ID per option. The order of the interest codes
// assigns primary, secondary and supporting roles in the editorial profile.
type Profile = { id: string; topics: Topic[]; interests: [Interest, Interest, Interest] };
function profile(id: string, topics: Topic[], ...interests: Profile["interests"]): Profile {
  return { id, topics, interests };
}
export const profiles = [
  profile("5fd6bbfe589", ["machines"], "R", "I", "C"), // Mechanical engineering
  profile("751752c633b", ["machines", "software"], "R", "I", "C"), // Robotics
  profile("fa1097caa18", ["machines"], "I", "R", "C"), // Electrical engineering
  profile("6328db32f8e", ["software"], "I", "C", "R"), // Computer science engineering
  profile("9ae2f70c586", ["software", "numbers"], "I", "C", "E"), // BCA Data Science
  profile("afccd862f02", ["design"], "A", "R", "I"), // Architecture
  profile("fb8b19a15c1", ["design"], "A", "R", "E"), // Fashion
  profile("61a167bc8cd", ["design", "machines"], "R", "A", "I"), // Industrial design
  profile("c5f8c674c83", ["life"], "I", "R", "C"), // Biotechnology
  profile("c8e542cac70", ["life", "health"], "I", "C", "R"), // Medical laboratory science
  profile("bc820f397b6", ["numbers"], "I", "C", "R"), // Statistics
  profile("174c8205ea4", ["numbers", "business"], "I", "E", "C"), // Economics
  profile("61b981b9c53", ["health"], "I", "S", "R"), // MBBS
  profile("a2bf7304bc2", ["health"], "S", "R", "C"), // Nursing
  profile("45f7b939ca2", ["health"], "S", "R", "I"), // Physiotherapy
  profile("c6f117f7d14", ["behaviour"], "I", "S", "C"), // Psychology
  profile("e7c29c55a2e", ["health", "behaviour"], "S", "R", "I"), // Occupational therapy
  profile("ecaa6310de3", ["media"], "A", "I", "S"), // English
  profile("83388e2d08d", ["media"], "A", "E", "I"), // Journalism
  profile("07748407bec", ["media", "design"], "A", "R", "E"), // Visual communication
  profile("789e8c7db98", ["business"], "E", "S", "C"), // BBA
  profile("6fc71c3768c", ["business", "media"], "E", "A", "I"), // Digital marketing
  profile("af28832158a", ["finance"], "C", "I", "E"), // Accounting & Finance
  profile("4e96cc4a5bd", ["finance", "software"], "C", "I", "E"), // Fintech
  profile("20fe4cd82ef", ["law"], "E", "I", "S"), // BA LLB
  profile("7b3e277334f", ["law", "finance"], "E", "C", "I"), // BCom LLB
  profile("896e5ba57df", ["law", "business"], "E", "I", "C"), // BBA LLB
  profile("cb26a1d8d87", ["agriculture", "life"], "R", "I", "E"), // Agriculture
  profile("457c32ab100", ["agriculture"], "R", "I", "A"), // Horticulture
  profile("003d7484800", ["hospitality"], "E", "S", "R"), // Hotel administration
];

