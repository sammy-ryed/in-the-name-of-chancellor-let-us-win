export const defaultCourseIds = ["a4bf715656e", "110704d00ae", "1f74325795a"] as const;
export const curriculumEdition = "Kattankulathur · B.Tech · Regulations 2026. Check your offer for the regulation assigned to your intake.";
const pdf = "https://webstor.srmist.edu.in/web_assets/downloads/2026/";
export const cseCurricula = {
  a4bf715656e: {
    short: "CSE Core", href: pdf + "srmist-btech-computer-science-and-engineering-curriculum-2026.pdf",
    emphasis: "Build complete software systems, from the interface through to storage and access controls.",
    core: "Full Stack Development and Principles of Security sit in the professional core.",
    elective: "Parallel Programming is a discipline skill elective.",
    lab: "Full Stack Development includes two practical hours a week.",
  },
  "110704d00ae": {
    short: "CSE · AI/ML", href: pdf + "srmist-btech-cse-artificial-intelligence-and-machine-learning-curriculum-2026.pdf",
    emphasis: "Build and evaluate models that learn from examples, including human language.",
    core: "Deep Learning and Natural Language Processing sit in the professional core.",
    elective: "Large Language Models is a discipline skill elective.",
    lab: "Natural Language Processing includes two practical hours a week.",
  },
  "1f74325795a": {
    short: "CSE · Data Science", href: pdf + "srmist-btech-cse-data-science-curriculum-2026.pdf",
    emphasis: "Use programming and statistics to turn messy data into evidence for a decision.",
    core: "Programming for Data Analytics and Deep Learning sit in the professional core.",
    elective: "Big Data Visualization is a discipline skill elective.",
    lab: "Programming for Data Analytics includes two practical hours a week.",
  },
} satisfies Record<string, { short: string; href: string; emphasis: string; core: string; elective: string; lab: string }>;

export function curriculumFor(id: string) {
  return Object.hasOwn(cseCurricula, id) ? cseCurricula[id as keyof typeof cseCurricula] : undefined;
}
