import assert from "node:assert/strict";
import test from "node:test";

const base = process.env.SRM_TEST_URL || "http://127.0.0.1:3000";
const endpoint = new URL("/api/admissions/programme-finder/step", base);
const start = await (await fetch(endpoint)).json();
const version = start.version;
const post = data => fetch(endpoint, {
  method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
});
async function step(answers) {
  const r = await post({ version, answers });
  assert.equal(r.status, 200);
  assert.equal(r.headers.get("cache-control"), "no-store");
  return r.json();
}
async function complete(values = {}) {
  let state = start;
  const answers = [];
  while (state.state === "question") {
    const q = state.question;
    assert.ok(q.canSkip);
    assert.equal(state.questions, undefined);
    assert.ok(answers.length < 12);
    assert.ok(!answers.some(a => a.questionId === q.id));
    answers.push({ questionId: q.id, value: values[q.id] ?? null });
    state = await step(answers);
  }
  assert.equal(state.state, "complete");
  assert.equal(state.result.recommendations.length <= 3, true);
  return { answers, result: state.result };
}

test("one question at a time, skipped answers, no invented personality", async () => {
  assert.deepEqual(await step([]), start);
  const { answers, result } = await complete();
  assert.equal(answers.length, 10);
  assert.equal(result.status, "explore");
  assert.equal(result.recommendations.length, 0);
  assert.deepEqual(result.earningsComparison, []);
  const single = await complete({ stall: "queue" });
  assert.equal(single.result.status, "explore");
  const repeated = await complete({ stall: "queue", game: "pattern" });
  assert.ok(repeated.result.recommendations.some(c => c.reasons.some(s => s.includes("queue") && s.includes("winning"))));
});

test("replay, go back, and change a branch without leaking a previous result", async () => {
  const x = await complete({ tasters: ["trade"], samples: ["hospitality"], goals: ["pay"], salary: 700000 });
  assert.equal(x.answers.length, 12);
  assert.deepEqual((await step(x.answers)).result, x.result);
  const index = x.answers.findIndex(a => a.questionId === "tasters");
  assert.equal((await step(x.answers.slice(0, index))).question.id, "tasters");
  const changed = x.answers.map(a => a.questionId === "tasters" ? { ...a, value: ["expression"] } : a);
  assert.equal((await post({ version, answers: changed })).status, 422);
  const next = await step(changed.slice(0, index + 1));
  assert.ok(next.question.options.some(o => o.id === "media"));
  assert.ok(!next.question.options.some(o => o.id === "hospitality"));
  const hotel = x.result.recommendations[0];
  assert.match(hotel.name, /Hotel/);
  assert.deepEqual(hotel.earnings, { cohort: null, status: "unavailable" });
  assert.equal((await fetch(new URL(hotel.detailsUrl, base))).status, 200);
  const broad = await complete({ tasters: ["people"] });
  assert.ok(broad.result.recommendations.every(c => c.reasons.some(s => s.includes("health and how people think"))));
  assert.equal(broad.result.status, "matches");
});

test("pay-only guidance compares distinct cohorts and target boundaries in rupees", async () => {
  const { result } = await complete({ goals: ["pay"], salary: 632000 });
  assert.equal(result.basis, "practical-options");
  const rows = result.recommendations;
  assert.equal(new Set(rows.map(c => c.earnings.cohort.label)).size, rows.length);
  const groups = result.earningsComparison;
  assert.equal(groups.length, 4);
  assert.ok(groups.every(c => c.placed > 0 && c.placed <= c.graduatedInTime && c.source.startsWith("https://")));
  const engineering = groups.find(c => c.label.includes("Engineering"));
  assert.deepEqual([engineering.medianINR, engineering.placed, engineering.graduatedInTime, engineering.targetComparison],
    [632000, 4144, 4408, "at-or-above"]);
  const higher = await complete({ goals: ["pay"], salary: 2000000 });
  assert.ok(higher.result.recommendations.every(c => c.earnings.status === "median-below-target"));
  assert.ok(higher.result.earningsComparison.every(c => c.targetComparison === "below"));
  assert.equal(higher.result.earningsComparison[0].medianINR, 900000);
  const noAmount = await complete({ goals: ["pay"] });
  assert.equal(noAmount.result.targetAnnualINR, null);
  assert.ok(noAmount.result.earningsComparison.every(c => c.targetComparison === null));
});

test("working style separates options within healthcare, and priorities carry through", async () => {
  const domain = { tasters: ["people"], samples: ["health"] };
  const lab = await complete({ ...domain, work: "investigate", method: "steps" });
  const care = await complete({ ...domain, work: "guide", method: "open" });
  assert.notEqual(lab.result.recommendations[0].courseId, care.result.recommendations[0].courseId);
  assert.ok(care.result.recommendations[0].reasons.some(s => s.includes("own approach")));
  const early = await complete({ goals: ["sooner", "pay"] });
  assert.ok(early.result.recommendations.some(c => /^3 years/i.test(c.duration)));
  assert.ok(early.result.recommendations.some(c => c.earnings.cohort));
  const stable = await complete({ goals: ["security", "time"] });
  assert.equal(stable.result.status, "explore");
  assert.ok(stable.result.priorities.every(p => p.questionToAsk.length > 0));
});

test("changing the salary target can change the order within the same subject", async () => {
  const preferences = { tasters: ["people"], samples: ["health"], goals: ["pay"], work: "create" };
  const lower = await complete({ ...preferences, salary: 400000 });
  const higher = await complete({ ...preferences, salary: 700000 });
  assert.match(lower.result.recommendations[0].name, /Pharmacy/);
  const medicine = higher.result.recommendations[0];
  assert.equal(medicine.degree, "MBBS");
  assert.match(medicine.admissionRequirements, /NEET/i);
  assert.match(medicine.duration, /Internship/i);
  assert.equal(medicine.earnings.cohort.year, "2023–24");
});

test("both chosen study directions survive in the shortlist", async () => {
  const { result } = await complete({ tasters: ["nature", "trade"], samples: ["agriculture", "hospitality"] });
  assert.ok(result.recommendations.some(c => c.faculty === "Agricultural Sciences"));
  assert.ok(result.recommendations.some(c => c.faculty === "Hotel & Catering Management"));
  assert.equal(new Set(result.recommendations.map(c => c.courseId)).size, result.recommendations.length);
});

test("tampered, stale, duplicate, out-of-order or malformed transcripts fail", async () => {
  const { answers } = await complete({ goals: ["pay"], salary: 600000 });
  const rejects = [
    [...answers, answers[0]], [answers[1]], [answers[0], answers[0]], [{ ...answers[0], score: 10 }],
    ...[false, [], "constructor", "R", 4].map(value => [{ ...answers[0], value }]),
    ...[0, -1, 1.5, "600000", 1e20].map(value => [...answers.slice(0, -1), { questionId: "salary", value }]),
    ...[["pay", "pay"], ["pay", "sooner", "ideas"], ["unknown"], []].map(value => [
      ...answers.slice(0, -2), { questionId: "goals", value }]),
  ];
  for (const invalid of rejects) assert.equal((await post({ version, answers: invalid })).status, 422);
  assert.equal((await post({ version: "old", answers: [] })).status, 409);
  assert.equal((await post({ version, answers: [], email: "extra" })).status, 422);
  const raw = (body, type) => fetch(endpoint, { method: "POST", headers: { "Content-Type": type }, body });
  assert.equal((await raw("{", "application/json")).status, 400);
  assert.equal((await raw("{}", "text/plain")).status, 415);
  assert.equal((await raw(" ".repeat(8500), "application/json")).status, 413);
});

