import { criteria, faculties, source } from "@/features/explore/academic";
import { candidates } from "./catalogue";
import { cohortFor, cohorts, earningsNote } from "./earnings";
import { families, formats, includesTopic, priorities, scenes, subjectLabels, type Family, type Priority } from "./questions";
import type { Interest, Topic } from "../quiz";

export type Answers = Map<string, string | string[] | number | null>;
export function choices(answers: Answers, id: string): string[] {
  const value = answers.get(id);
  return Array.isArray(value) ? value : [];
}
const checks: Record<Priority, string> = {
  pay: "Ask for recent starting pay for this course at the campus you are considering.",
  sooner: "Check the full study period, internships and any registration needed before paid work.",
  service: "Ask how much time students spend working directly with people.",
  ideas: "Ask to see projects where students chose their own approach.",
  enterprise: "Ask which projects let students plan and run a small venture.",
  security: "Ask which employers hired from successive batches and what contracts they offered.",
  time: "Ask recent graduates about shifts, travel and working hours in their first roles.",
  learning: "Compare the later-year subjects and ask about further study.",
};

export function shortlist(answers: Answers) {
  const topics = choices(answers, "samples") as Topic[];
  const groups = topics.length ? [] : choices(answers, "tasters") as Family[];
  const goals = choices(answers, "goals") as Priority[];
  const pay = goals.includes("pay");
  const target = answers.get("salary");
  const targetINR = typeof target === "number" ? target : null;
  const votes = new Map<Interest, number>();
  const evidence: Partial<Record<Interest, string[]>> = {};
  for (const { question, roles } of scenes) {
    const role = roles.find(([id]) => id === answers.get(question.id));
    if (!role) continue;
    const [, axis, label] = role;
    votes.set(axis, (votes.get(axis) || 0) + 1);
    (evidence[axis] ??= []).push(label);
  }
  // Only repeated choices count as a pattern. A skipped scene has no effect.
  function count(axis: Interest) {
    const n = votes.get(axis) ?? 0;
    return n >= 2 ? n : 0;
  }
  const rows = candidates.map(c => {
    const matches = topics.filter(t => c.topics.includes(t));
    const groupMatches = groups.filter(group => c.topics.some(topic => includesTopic(group, topic)));
    const [a, b, d] = c.interests;
    const roleScore = 3 * count(a) + 2 * count(b) + count(d);
    const work = answers.get("work") === c.format;
    const method = answers.get("method") === c.method;
    const values = (goals.includes("service") && c.format === "guide") ||
      (goals.includes("ideas") && c.method === "open") ||
      (goals.includes("enterprise") && c.topics.includes("business"));
    const cohort = cohortFor(c.course);
    const threshold = cohort && targetINR !== null ? cohort.medianINR >= targetINR : null;
    const sooner = goals.includes("sooner") && c.yearsToDegree !== null && c.yearsToDegree <= 3;
    const reasons = matches.map(t => "You picked “" + subjectLabels[t] + "”.");
    reasons.push(...groupMatches.map(g => "You wanted to try a class about " + families[g][0].toLowerCase() + "."));
    const axis = c.interests.find(k => count(k) > 0);
    if (axis) reasons.push("Across two situations you chose “" + evidence[axis]![0] + "” and “" + evidence[axis]![1] + "”");
    if (work) reasons.push("You liked this way of working: " + formats[c.format] + ".");
    if (method) reasons.push(c.method === "steps" ? "The sample task has steps you can check as you go." : "The sample task leaves room to try your own approach.");
    if (values) reasons.push("The sample task connects with a priority you chose: " +
      (goals.includes("service") && c.format === "guide" ? priorities.service :
        goals.includes("ideas") && c.method === "open" ? priorities.ideas : priorities.enterprise) + ".");
    if (sooner) reasons.push("SRM lists a three-year regular route for this option.");
    if (pay && cohort) reasons.push("The " + cohort.year + " reporting group had a median of ₹" + cohort.medianINR.toLocaleString("en-IN") + " among placed graduates.");
    // Unreported salaries have no effect on an interest score. A verified
    // historical benchmark can add a modest bonus when pay was requested.
    const incomeBonus = pay && cohort ? (threshold === false ? 0 : 2) : 0;
    const score = roleScore + (work ? 5 : 0) + (method ? 1 : 0) + (values ? 2 : 0) + (sooner ? 4 : 0) + incomeBonus;
    const personal = matches.length > 0 || groupMatches.length > 0 || roleScore > 0 || work || values;
    return { c, matches: [...matches, ...groupMatches], cohort, threshold, score, personal, sooner, reasons };
  });
  const hasPersonal = rows.some(r => r.personal);
  const ordered = rows.filter(r => hasPersonal ? r.personal : r.sooner || (pay && r.cohort))
    .sort((x, y) => y.matches.length - x.matches.length || y.score - x.score ||
      (pay && !hasPersonal ? (y.cohort?.medianINR || 0) - (x.cohort?.medianINR || 0) : 0) ||
      x.c.course.name.localeCompare(y.c.course.name, "en") || x.c.id.localeCompare(y.c.id));

  const selected: typeof rows = [];
  const coveredTopics = new Set<string>();
  const coveredGroups = new Set<string>();
  function take(row: typeof rows[number]) {
    selected.push(row);
    row.matches.forEach(t => coveredTopics.add(t));
    coveredGroups.add(row.cohort?.label ?? row.c.course.faculty);
  }
  for (const row of ordered) {
    if (row.matches.some(t => !coveredTopics.has(t))) take(row);
  }
  if (!hasPersonal && pay && goals.includes("sooner")) {
    const short = ordered.find(r => r.sooner);
    const reported = ordered.filter(r => r.cohort).sort((a, b) => b.cohort!.medianINR - a.cohort!.medianINR)[0];
    if (short) take(short);
    if (reported && reported !== short) take(reported);
  }
  for (const row of ordered) {
    if (selected.length >= 3) break;
    if (selected.includes(row)) continue;
    if (!hasPersonal && coveredGroups.has(row.cohort?.label ?? row.c.course.faculty)) continue;
    take(row);
  }
  return {
    status: selected.length ? "matches" : "explore",
    basis: hasPersonal ? "preferences" : selected.length ? "practical-options" : "explore",
    message: hasPersonal ? "These options connect with things you picked. Try the sample task for each one." :
      selected.length ? "These are options to compare on the practical goals you chose. Try a sample task to see which you enjoy." :
      "Your answers leave several paths open. Browse the courses or go back and try a sample class.",
    priorities: goals.map(id => ({ id, label: priorities[id], questionToAsk: checks[id] })),
    // Keep the salary comparison available even when a student's preferred
    // subject has no reviewed placement figure.
    earningsComparison: pay ? Object.values(cohorts).map(cohort => ({
      ...cohort, targetComparison: targetINR === null ? null : cohort.medianINR >= targetINR ? "at-or-above" : "below",
    })).sort((a, b) => b.medianINR - a.medianINR) : [],
    earningsNote: pay ? earningsNote : null, targetAnnualINR: targetINR, browseUrl: "/programmes",
    recommendations: selected.map(({ c, cohort, threshold, reasons }) => ({
      courseId: c.id, name: c.course.name, degree: c.course.degree, campus: c.course.campus,
      faculty: faculties[c.course.faculty], example: c.example, reasons,
      detailsUrl: "/programmes/" + c.id, officialUrl: source(c.course), admissionRequirements: criteria(c.course),
      duration: c.course.duration, listedFee: { amount: c.course.fee, basis: c.course.period },
      earnings: pay ? { cohort, status: !cohort ? "unavailable" : threshold === null ? "reported" :
        threshold ? "median-at-or-above-target" : "median-below-target" } : null,
    })),
  };
}

