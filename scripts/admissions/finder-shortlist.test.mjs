import assert from "node:assert/strict";
import test from "node:test";
import courses from "../../src/features/explore/courses.json" with { type: "json" };
import { familyFor } from "../../src/features/explore/course-families.ts";
import { comparisonHref, readShortlist, writeShortlist } from "../../src/features/explore/shortlist.ts";
import { eligibleFinderSlots } from "../../src/features/admissions/course-finder/finder-shortlist.ts";

const electronics = "a0bcde7404f";
const biotechnology = "f036ea1ea59";
const journalism = "83388e2d08d";
const english = "ecaa6310de3";
const empty = ["", "", ""];
const base = process.env.SRM_TEST_URL || "http://127.0.0.1:3000";
const directory = [electronics, biotechnology, ""];
const humanities = new Set(courses
  .filter(course => course.level === "Undergraduate" && familyFor(course) === "arts-sciences")
  .map(course => course.id));

test("a Humanities result starts empty beside an existing directory shortlist, even when storage becomes unavailable", t => {
  const entries = new Map([["srm-course-shortlist-v1", directory.join(",")]]);
  let unavailable = false;
  const tab = new EventTarget();
  tab.sessionStorage = {
    getItem(key) {
      if (unavailable) throw new Error("Storage is unavailable");
      return entries.get(key) ?? null;
    },
    setItem(key, value) {
      if (unavailable) throw new Error("Storage is unavailable");
      entries.set(key, value);
    },
  };
  globalThis.window = tab;
  t.after(() => { delete globalThis.window; });

  assert.deepEqual(readShortlist(), directory);
  assert.deepEqual(readShortlist("finder"), empty);
  writeShortlist(["", english, ""], "finder");
  assert.deepEqual(readShortlist(), directory);
  assert.deepEqual(readShortlist("finder"), ["", english, ""]);

  unavailable = true;
  writeShortlist(directory);
  assert.deepEqual(readShortlist("finder"), ["", english, ""]);
  writeShortlist(empty, "finder");
  assert.deepEqual(readShortlist(), directory);
  assert.deepEqual(readShortlist("finder"), empty);
});

test("changing to a Humanities result drops unrelated courses and keeps the slot of each eligible pick", () => {
  assert.deepEqual(eligibleFinderSlots(directory, humanities), empty);
  assert.deepEqual(eligibleFinderSlots([electronics, english, journalism], humanities), ["", english, journalism]);
  assert.deepEqual(eligibleFinderSlots(["", english, journalism], new Set()), empty);
  const link = new URL(comparisonHref(empty, "finder"), "http://localhost");
  assert.equal(link.searchParams.get("from"), "finder");
  assert.equal(link.searchParams.get("compare"), "", "an explicitly empty choice must not restore past courses");
});

async function comparisonMain(url) {
  const response = await fetch(url);
  assert.equal(response.status, 200);
  const html = (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  assert.ok(main, "the comparison must render in the first response");
  return main;
}

test("the finder handoff compares the selected Humanities courses and preserves their A/B/C positions", async () => {
  const slots = eligibleFinderSlots([electronics, english, journalism], humanities);
  const url = new URL(comparisonHref(slots, "finder"), base);
  assert.equal(url.searchParams.get("from"), "finder");
  const main = await comparisonMain(url);
  assert.match(main, /aria-label="Change course B"/);
  assert.match(main, /aria-label="Change course C"/);
  assert.doesNotMatch(main, /aria-label="Change course A"/);
  const selected = [...main.matchAll(/<h3[^>]*>\s*<a\b[^>]*href="\/programmes\/([a-f0-9]{11})[?"]/g)].map(m => m[1]);
  assert.deepEqual([...new Set(selected)], [english, journalism]);
});

async function artsPicker(subject, scope = "finder", query = "") {
  const url = new URL(comparisonHref(empty, scope), base);
  url.searchParams.set("family", "arts-sciences");
  url.searchParams.set("pick", "1");
  if (subject) url.searchParams.set("subject", subject);
  if (query) url.searchParams.set("q", query);
  const main = await comparisonMain(url);
  assert.doesNotMatch(main, /aria-label="Change course [ABC]"/, "examples must not automatically fill a slot");
  const picker = main.match(/<section\b[^>]*aria-label="Choose course A"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(picker, "the first response must contain the course picker");
  const titles = [...picker.matchAll(/<li><button\b[^>]*>\s*<span><strong>([^<]+)<\/strong>/g)].map(match => match[1]);
  const canBrowseFamily = /<button\b[^>]*>\s*Browse all \d+ courses in this family\s*<\/button>/.test(picker);
  return { titles, canBrowseFamily };
}

const broadExamples = ["Journalism and Mass Communication", "Mathematics", "Psychology"];
for (const [subject, expected] of [
  ["writing", ["Journalism and Mass Communication", "English", "Liberal Arts"]],
  ["science", ["Physics with Emerging technologies", "Physics with Quantum Computing"]],
  ["", broadExamples],
  ["unknown-subject", broadExamples],
]) {
  test("the finder arts picker opens with the reviewed examples for " + (subject || "no identified subject"), async () => {
    const { titles, canBrowseFamily } = await artsPicker(subject);
    assert.deepEqual(titles, expected);
    assert.ok(canBrowseFamily, "the full family must be accessible from the example list");
  });
}

test("a writing result can search the full family before opening the full list", async () => {
  const { titles } = await artsPicker("writing", "finder", "Visual Communication");
  assert.ok(titles.includes("Visual Communication"), "the picker should find courses outside the three examples");
});

test("a finder subject hint does not reorder the general arts comparison picker", async () => {
  const ordinary = await artsPicker("", "directory");
  assert.ok(ordinary.titles.length > 0);
  assert.deepEqual(await artsPicker("writing", "directory"), ordinary);
});
