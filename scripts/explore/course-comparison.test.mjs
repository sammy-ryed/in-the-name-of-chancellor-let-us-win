import assert from "node:assert/strict";
import test from "node:test";
import courses from "../../src/features/explore/courses.json" with { type: "json" };
import { familyFor, familyNames } from "../../src/features/explore/course-families.ts";
import { marketFor } from "../../src/features/explore/role-market.ts";
import { cseCurricula, defaultCourseIds } from "../../src/features/explore/cse-curricula.ts";
import { studyReferenceFor } from "../../src/features/explore/study-references.ts";
import { rankTuition } from "../../src/features/explore/tuition-ranking.ts";

const undergraduate = courses.filter(course => course.level === "Undergraduate");
const faculties = Map.groupBy(undergraduate, course => course.faculty);

test("all undergraduate listings have a discoverable family and all faculties have study and market evidence", () => {
  assert.equal(faculties.size, 7);
  assert.ok(undergraduate.length >= 309);
  for (const course of undergraduate) {
    assert.ok(Object.hasOwn(familyNames, familyFor(course)), course.id + " " + course.name);
  }
  for (const [faculty, entries] of faculties) {
    assert.ok(entries.some(course => studyReferenceFor(course.id) || cseCurricula[course.id]), faculty + " study sources");
    assert.ok(entries.some(course => marketFor(course).pay), faculty + " pay sources");
    assert.ok(entries.some(course => marketFor(course).hiring), faculty + " hiring sources");
  }
});

test("the CSE example compares the KTR records at one regulation with source-labelled electives", () => {
  const selections = defaultCourseIds.map(id => courses.find(course => course.id === id));
  assert.deepEqual(selections.map(c => c.campus), Array(3).fill("Kattankulathur"));
  assert.deepEqual(selections.map(c => c.degree), Array(3).fill("B.Tech"));
  assert.equal(new Set(selections.map(c => cseCurricula[c.id].href)).size, 3);
  for (const c of selections) {
    assert.match(cseCurricula[c.id].href, /curriculum-2026\.pdf$/);
    assert.match(cseCurricula[c.id].elective, /elective/i);
    const { pay } = marketFor(c);
    assert.match(pay.text, /India.*experience.*total compensation.*salary reports/);
    assert.match(pay.url, /payscale\.com\/research\/IN/);
  }
});

const quoted = (amount, period = "Annual tuition", conflict) => ({
  short: "Course", campus: "Kattankulathur", fee: { fee: String(amount), amount, period, conflict },
});

test("ranking uses the original letters and handles three prices, equal tuition and ties", () => {
  let [group] = rankTuition([quoted(450000), quoted(275000), quoted(375000)]).groups;
  assert.deepEqual(group.rows.map(r => [r.slot, r.rank, r.aboveLowest]), [[0,"Highest",175000],[2,"Middle",100000],[1,"Lowest",0]]);
  assert.equal(group.difference,175000);
  [group] = rankTuition([quoted(300), null, quoted(300)]).groups;
  assert.deepEqual(group.rows.map(r => [r.slot,r.rank]), [[0,"Same tuition"],[2,"Same tuition"]]);
  [group] = rankTuition([quoted(200),quoted(300),quoted(300)]).groups;
  assert.deepEqual(group.rows.map(r => r.rank), ["Joint highest","Joint highest","Lowest"]);
});

test("unverified figures and different fee periods produce no misleading rank", () => {
  const selection = [quoted(100,"Annual tuition","Sources disagree"), quoted(120,"First semester"), quoted(210)];
  const { groups,excluded } = rankTuition(selection);
  assert.equal(excluded[0].slot,0);
  assert.match(excluded[0].explanation,/disagree/);
  assert.ok(groups.every(g => g.rows.length === 1 && !g.rows[0].rank));
  const unresolved = rankTuition([quoted(null), quoted(50,"Listed fee"), null]);
  assert.equal(unresolved.groups.length,0);
  assert.equal(unresolved.excluded.length,2);
});

async function comparisonPage(query) {
  const base = process.env.SRM_TEST_URL || "http://127.0.0.1:3000";
  const response = await fetch(new URL("/programmes/compare?" + query, base));
  assert.equal(response.status, 200);
  const html = (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  return html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)[1];
}

test("a family handoff opens an empty undergraduate picker and a shared empty A slot stays empty", async () => {
  const fresh = await comparisonPage("");
  assert.match(fresh, /Choose your first course/);
  assert.doesNotMatch(fresh, /aria-label="Change course [ABC]"/);
  const cleared = await comparisonPage("compare=,,");
  assert.match(cleared, /Choose your first course/);
  const empty = await comparisonPage("family=agriculture");
  assert.match(empty, /Choose your first course/);
  assert.doesNotMatch(empty, /aria-label="Change course A"/);
  const selected = await comparisonPage("compare=," + defaultCourseIds[0] + "," + defaultCourseIds[2]);
  assert.match(selected, /aria-label="Change course B"/);
  assert.match(selected, /aria-label="Change course C"/);
  assert.doesNotMatch(selected, /aria-label="Change course A"/);
});

test("the picker leads with published applications and keeps campus filters independent", async () => {
  const picker = (await comparisonPage("")).match(/<section[^>]*aria-label="Choose course A"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(picker, "empty comparison opens the first picker");
  const choices = Array.from(picker.matchAll(/<li><button[^>]*>([\s\S]*?)<\/button><\/li>/g), m => m[1].replaceAll("<!-- -->", ""));
  assert.equal(choices.length, 5);
  assert.match(choices[0], /Artificial Intelligence and Machine Learning[\s\S]*Kattankulathur[\s\S]*20,877 applications/);
  assert.match(choices[1], /Computer Science and Engineering<\/strong>[\s\S]*16,648 applications/);
  const otherCampus = await comparisonPage("q=Ramapuram");
  assert.match(otherCampus, /Matching courses/);
  assert.doesNotMatch(otherCampus, /[\d,]+(?:<!-- -->)? applications<\/small>/);
});

test("a shared table keeps the selected slots, every topic and one copy of cohort evidence", async () => {
  const selection = "compare=," + defaultCourseIds[0] + "," + defaultCourseIds[2];
  const page = await comparisonPage(selection + "&view=table");
  const table = page.match(/<table\b[^>]*>([\s\S]*?)<\/table>/i)?.[1];
  assert.ok(table, "shared table links should render a semantic table in the first response");
  const header = table.match(/<thead\b[^>]*>([\s\S]*?)<\/thead>/i)[1];
  assert.match(header, />B<\/span>/);
  assert.match(header, />C<\/span>/);
  assert.doesNotMatch(header, />A<\/span>/);
  assert.equal((table.match(/scope="rowgroup"/g) || []).length, 5);
  assert.equal((table.match(/₹6\.32 lakh/g) || []).length, 1);
  assert.match(table, /Tuition rank/);
  assert.match(table, /SRM’s NIRF submission/);
  assert.match(table, /Will AI affect campus placements\?/);
  assert.equal((table.match(/35%/g) || []).length, 1);
  assert.match(table, /Deloitte India campus survey/);
  assert.match(table, /ILO task-level study/);
  assert.match(table, /breakdown of AI’s effect on offers/);
  assert.doesNotMatch(await comparisonPage(selection), /<table\b/);
});