import { courses, faculties, source } from "@/features/explore/academic";
import { profiles } from "./profiles";
import { interests, items, topics, version, type Interest, type Submission } from "./quiz";

const catalogue = new Map(courses.map(course => [course.id, course]));
const candidates = profiles.map(profile => {
  const course = catalogue.get(profile.id);
  if (!course || course.level !== "Undergraduate") throw new Error("Review quiz course mapping: " + profile.id);
  return { profile, course };
});

export function recommend(submission: Submission) {
  const means = {} as Record<Interest, number>;
  for (const axis of Object.keys(interests) as Interest[]) {
    const pair = items.filter(item => item.interest === axis);
    means[axis] = pair.reduce((sum, item) => sum + submission.answers[item.id], 0) / pair.length;
  }
  const all = Object.values(means);
  const average = all.reduce((sum, x) => sum + x, 0) / all.length;
  const distinct = Math.max(...all) - Math.min(...all) >= 1;
  const ranked = candidates.map(({ course, profile }) => {
    const [a, b, c] = profile.interests;
    const affinity = (3 * means[a] + 2 * means[b] + means[c]) / 6;
    const matched = submission.topics.filter(t => profile.topics.includes(t));
    const reasons = matched.map(t => "You chose: " + topics[t] + ".");
    const strongest = profile.interests.filter(axis => distinct && means[axis] >= 4 && means[axis] > average)
      .sort((x, y) => means[y] - means[x])[0];
    if (strongest) reasons.push("You enjoyed activities involving " + interests[strongest] + ".");
    return { course, affinity, matched, reasons };
  }).filter(row => row.matched.length > 0 || (row.affinity > 3 && row.reasons.length > 0))
    .sort((a, b) => b.matched.length - a.matched.length || b.affinity - a.affinity ||
      a.course.name.localeCompare(b.course.name, "en") || a.course.id.localeCompare(b.course.id));

  // Represent distinct explicit choices before filling remaining slots by fit.
  const selected: typeof ranked = [];
  const uncovered = new Set(submission.topics);
  for (const row of ranked) {
    if (!row.matched.some(t => uncovered.has(t))) continue;
    selected.push(row);
    row.matched.forEach(t => uncovered.delete(t));
  }
  for (const row of ranked) {
    if (selected.length >= 3) break;
    if (!selected.includes(row)) selected.push(row);
  }

  return {
    version, status: selected.length ? "matches" as const : "explore" as const,
    message: selected.length
      ? "Compare these options and check the study content and entry requirements with SRM."
      : "Your answers do not single out a course yet. Pick a study activity to narrow the list, or browse SRM programmes.",
    browseUrl: "/programmes",
    recommendations: selected.map(({ course, reasons }) => ({
      courseId: course.id, name: course.name, degree: course.degree, campus: course.campus,
      faculty: faculties[course.faculty], detailsUrl: "/programmes/" + course.id,
      officialUrl: source(course), reasons,
    })),
  };
}
export type QuizResult = ReturnType<typeof recommend>;

