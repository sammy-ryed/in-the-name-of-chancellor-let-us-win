import assert from "node:assert/strict";
import test from "node:test";
import { core, closer, orderedChoices, questionPath } from "../../src/features/admissions/course-finder/v5/questions.ts";
import { workSignals, frictions } from "../../src/features/admissions/course-finder/v5/signals.ts";

const api = new URL("/api/admissions/programme-finder/v5", process.env.SRM_TEST_URL || "http://127.0.0.1:3000");
const version = "srm-course-families-v5";
const taskQuestions = core.filter(q => q.signal === "task");
const persona = {
  computing: { corner: "lend", "another-go": "orders", notice: "line" },
  engineering: { corner: "brace", visit: "handoff", "another-go": "wobble" },
  "architecture-design": { corner: "welcome", visit: "directions", notice: "carry" },
  business: { corner: "costs", visit: "fares", notice: "takings" },
  "arts-sciences": { corner: "stories", "another-go": "draft", notice: "cup" },
  law: { corner: "photos", visit: "promise", "another-go": "accounts" },
  health: { visit: "pauses", "another-go": "buttons", notice: "ill" },
  agriculture: { corner: "pots", "another-go": "ripeness", notice: "greens" },
  hospitality: { visit: "serve", "another-go": "hosting", notice: "servings" },
};
function answers(choices) {
  return Object.fromEntries(Object.entries(choices).map(([q, c]) => [q, Array.isArray(c) ? c : [c]]));
}
function post(body) {
  return fetch(api, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
}
async function score(choices) {
  const r = await post({ version, answers: answers(choices) });
  assert.equal(r.status, 200);
  assert.match(r.headers.get("cache-control"), /no-store/);
  return (await r.json()).result;
}
function open(result) {
  assert.equal(result.state, "explore");
  assert.deepEqual(result.matches, []);
  assert.equal(result.activities.length, 2);
  assert.notEqual(result.activities[0].id, result.activities[1].id);
  assert.notEqual(result.activities[0].tryThis, result.activities[1].tryThis);
  assert.ok(result.exploreReason);
}
test("public bank contains everyday choices without outcome tags, with evidence coverage across all families", async () => {
  const metadata = await (await fetch(api)).json();
  assert.equal(metadata.version, version);
  assert.equal(metadata.coreQuestions, 8);
  assert.equal(metadata.maxFollowups, 2);
  assert.equal(metadata.firstQuestion.id, "stage");
  assert.equal(core.filter(q => q.signal === "aversion").length, 2);
  const opportunities = new Map();
  for (const q of [...core, ...Object.values(closer)]) {
    for (const c of q.choices) {
      assert.ok(!("families" in c) && !("family" in c) && !("observation" in c));
      const key = q.id + "/" + c.id;
      if (q.signal === "aversion") assert.ok(frictions[key], key);
      else if (q.signal) {
        assert.ok(workSignals[key], key);
        if (q.signal === "task") {
          const [family] = workSignals[key][0];
          const contexts = opportunities.get(family) ?? new Set();
          contexts.add(q.id);
          opportunities.set(family, contexts);
        }
      }
    }
  }
  assert.equal(opportunities.size, 9);
  assert.ok([...opportunities.values()].every(contexts => contexts.size === 3));
});
for (const [family, choices] of Object.entries(persona)) {
  test(family + " is reachable from three everyday scenes with two grounded reasons", async () => {
    const result = await score(choices);
    const match = result.matches[0];
    assert.equal(match?.id, family);
    assert.equal(match.friction, null);
    assert.equal(match.reasons.length, 2);
    const scenes = match.reasons.map(reason => taskQuestions.find(q => q.choices.some(c => choices[q.id] === c.id && reason.includes(c.label)))?.id);
    assert.ok(scenes.every(Boolean));
    assert.equal(new Set(scenes).size, 2);
    assert.ok(match.tryThis && match.tradeOff && match.subjects);
    assert.equal(match.url, "/programmes/compare?family=" + family);
  });
}

test("adaptive questions refine one situation and cannot create independent corroboration", async () => {
  for (const c of [
    { corner: "lend", "closer-lend": "clash" },
    { corner: "lend", "closer-lend": "clash", visit: "handoff", "closer-handoff": "repeat", "one-hour": "till" },
    { corner: "lend", "closer-lend": "clash", visit: "pauses", notice: "takings" },
  ]) open(await score(c));
  const changed = await score({ corner: "brace", "closer-brace": "spend", visit: "fares", "another-go": "buttons", notice: "takings" });
  assert.equal(changed.matches[0].id, "business");
  const label = closer.brace.choices.find(c => c.id === "spend").label;
  assert.ok(changed.matches[0].reasons.some(reason => reason.includes(label)));
});

test("giving only dislikes leads to clearly labelled examples and avoids those particular tasks", async () => {
  const blank = await score({});
  const negative = await score({ "one-hour": "refit", "leave-out": ["rounds", "rewrite"], priorities: "earning" });
  open(blank);
  open(negative);
  assert.match(negative.exploreReason, /examples/i);
  assert.ok(negative.activities.every(c => !c.friction));
  assert.ok(negative.activities.every(c => c.id !== "engineering" && c.id !== "agriculture"));
  const single = await score({ corner: "costs", "one-hour": "refit" });
  open(single);
  assert.equal(single.activities[0].id, "business");
  assert.notEqual(single.activities[1].id, "engineering");
});

test("a strong direction can coexist with a specific dislike and the effect is capped", async () => {
  const plain = await score(persona.computing);
  const first = await score({ ...persona.computing, "one-hour": "retries" });
  const more = await score({ ...persona.computing, "one-hour": "retries", "leave-out": ["accuracy", "redraw"] });
  assert.equal(first.matches[0].id, "computing");
  assert.deepEqual(first.matches, more.matches);
  assert.deepEqual(first.matches[0].reasons, plain.matches[0].reasons);
  assert.notEqual(first.matches[0].tryThis, plain.matches[0].tryThis);
  const disliked = core.find(q => q.id === "one-hour").choices.find(c => c.id === "retries").label;
  assert.ok(first.matches[0].friction.includes(disliked.replace(/\.$/, "")));
  assert.ok(!first.matches[0].reasons.some(reason => reason.includes(disliked)));
  const forward = await score({ ...persona.computing, "leave-out": ["accuracy", "redraw"] });
  const reverse = await score({ ...persona.computing, "leave-out": ["redraw", "accuracy"] });
  assert.deepEqual(forward, reverse);
  const removed = await score({ ...persona.computing, "one-hour": [], "leave-out": "none-fit" });
  assert.deepEqual(plain, removed);
});

test("a real positive tie cannot be settled by picking or skipping a disliked task", async () => {
  const tie = { corner: "lend", visit: "promise", "another-go": "accounts", notice: "line" };
  for (const extras of [{}, { "one-hour": "retries" }, { "one-hour": "versions" }, { "leave-out": ["accuracy", "rewrite"] }]) {
    const result = await score({ ...tie, ...extras });
    open(result);
    assert.deepEqual(new Set(result.activities.map(c => c.id)), new Set(["computing", "law"]));
  }
});

test("a specific disliked condition can turn a close lead into an open choice without nominating another degree", async () => {
  const base = { corner: "lend", visit: "serve", "another-go": "wobble", notice: "servings", "closer-lend": "return" };
  const supported = await score(base);
  assert.equal(supported.matches[0].id, "hospitality");
  const tension = await score({ ...base, "one-hour": "waiting" });
  open(tension);
  assert.match(tension.exploreReason, /overlaps/);
  assert.deepEqual(tension.activities.map(c => c.id), ["hospitality", "architecture-design"]);
  assert.match(tension.activities[0].friction, /guest-facing/i);
});

test("arts subject hints require two independent choices, and writing friction stays out of science", async () => {
  const writing = await score(persona["arts-sciences"]);
  assert.equal(writing.subjectChoice, "writing");
  assert.match(writing.matches[0].tryThis, /opening/i);
  const single = await score({ corner: "stories", "closer-stories": "voices" });
  open(single);
  assert.equal(single.subjectChoice, undefined);
  const science = await score({ corner: "pots", "closer-pots": "test", visit: "promise", notice: "cup", "leave-out": "rewrite" });
  assert.equal(science.matches[0].id, "arts-sciences");
  assert.equal(science.subjectChoice, "science");
  assert.equal(science.matches[0].friction, null);
  const both = await score({ corner: "pots", "closer-pots": "test", visit: "promise", "closer-promise": "piece", "another-go": "draft", notice: "cup" });
  assert.equal(both.matches[0].id, "arts-sciences");
  assert.equal(both.subjectChoice, undefined);
});

test("stage, priorities, skip and either neutral option leave the interest ranking alone", async () => {
  const base = await score(persona.law);
  for (const id of ["not-tried", "none-fit"]) {
    const altered = await score({ ...persona.law, notice: id, "one-hour": id, "leave-out": id, stage: "class-10", priorities: ["cost", "duration"] });
    assert.deepEqual(base.matches, altered.matches);
    assert.notEqual(base.stageGuide, altered.stageGuide);
    assert.equal(altered.priorities.length, 2);
  }
});

test("repeatedly choosing the first answer can produce different outcomes after rotating the display", async () => {
  const outcomes = new Set();
  for (const seed of [0, 1, 2, 3, 4, 5, 7, 9, 11, 16]) {
    const choices = Object.fromEntries(taskQuestions.map(q => [q.id, orderedChoices(q, seed)[0].id]));
    const result = await score(choices);
    outcomes.add(result.matches[0]?.id ?? "explore");
  }
  assert.ok(outcomes.size >= 3, [...outcomes].join(", "));
});

test("submitting stale, unknown, malformed or nonexclusive answers fails validation", async () => {
  for (const malformed of [
    null, [], { stage: "class-10" }, { stage: ["none-fit"] }, { priorities: ["not-tried"] },
    { core: ["test"] }, { "one-hour": ["waiting", "till"] }, { "leave-out": ["rounds", "rounds"] },
    { "leave-out": ["none-fit", "listening"] }, { "leave-out": ["rounds", "rewrite", "handover"] },
    { corner: ["pots"], "closer-lend": ["clash"] }, { "closer-serve": [] },
    { corner: ["none-fit"], "closer-pots": ["test"] }, { "one-hour": [42] }, { interests: ["computing"] },
  ]) assert.equal((await post({ version, answers: malformed })).status, 422);
  for (const extra of [{ name: "extra field" }, { version: "srm-course-families-v4" }, { prompt: "unreviewed" }]) {
    assert.equal((await post({ version, answers: {}, ...extra })).status, 422);
  }
  const clean = answers({ corner: "pots", "closer-pots": "test", visit: "serve", "closer-serve": "batch" });
  assert.equal((await post({ version, answers: clean })).status, 200);
  assert.ok(questionPath(clean).some(q => q.id === "closer-pots"));
});

test("placements use reviewed sources, and v4 remains separately callable", async () => {
  const coached = await (await post({ version, answers: {}, prompt: "placements" })).json();
  assert.equal(coached.provider, "local");
  assert.ok(coached.sources.some(s => s.href.includes("deloitte.com")));
  const legacy = await fetch(new URL("../v4", api + "/"), { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ version: "srm-course-families-v4", answers: { interests: ["law"], "closer-law": ["wording"] } }) });
  assert.equal(legacy.status, 200);
});

test("the provider-off coach keeps the reason for a match distinct from a disliked task", { skip: !process.env.SRM_TEST_GROQ_OFF }, async () => {
  const choices = answers({ ...persona.law, "one-hour": "versions" });
  const { provider, answer } = await (await post({ version, answers: choices, prompt: "why" })).json();
  assert.equal(provider, "local");
  assert.match(answer, /law/i);
  assert.match(answer, /rather avoid/i);
});
