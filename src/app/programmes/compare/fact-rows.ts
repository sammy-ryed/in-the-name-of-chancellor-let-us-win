import type { ComparedCourse, Fact } from "@/features/explore/course-evidence";
import type { Topic } from "@/features/explore/compare-topics";

export type ComparisonRow = { label: string; cells: (Fact | undefined)[]; shared: boolean };
export function sameFact(a: Fact | undefined, b: Fact | undefined) {
  return Boolean(a && b && a.text === b.text && a.link?.href === b.link?.href && a.link?.label === b.link?.label);
}
export function comparisonRow(label: string, cells: (Fact | undefined)[]): ComparisonRow {
  return { label, cells, shared: cells.length > 1 && cells.every(cell => sameFact(cell, cells[0])) };
}
export function rowsFor(courses: readonly ComparedCourse[], topic: Topic): ComparisonRow[] {
  const byCourse = courses.map(course => new Map(course.details[topic].map(fact => [fact.label, fact])));
  const labels = new Set(byCourse.flatMap(facts => [...facts.keys()]));
  return [...labels].map(label => comparisonRow(label, byCourse.map(facts => facts.get(label))));
}
