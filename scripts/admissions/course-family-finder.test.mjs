import assert from "node:assert/strict";
import test from "node:test";

const base = process.env.SRM_TEST_URL || "http://127.0.0.1:3000";
const api = new URL("/api/admissions/programme-finder/v3", base);
const { version, coreQuestions, maxFollowups } = await (await fetch(api)).json();
const answers = { stage: ["class-10"], lunch: ["time-queue"], afternoon: ["seedlings"], "closer-seedlings": ["light"],
  notice: ["light"], practice: ["results"], show: ["plot"], read: ["garden"], priorities: ["cost"] };

function post(answers, more = {}) {
  return fetch(api, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({version, answers, ...more}) });
}
async function score(answers) {
  const response = await post(answers);
  assert.equal(response.status, 200);
  return (await response.json()).result;
}

test("v3 reasons, actions and family picker links follow confirmed activities", async () => {
  assert.equal(coreQuestions, 8);
  assert.equal(maxFollowups, 2);
  const result = await score(answers);
  assert.equal(result.state, "matches");
  assert.equal(result.matches[0].id, "agriculture");
  for (const family of result.matches) {
    assert.equal(family.reasons.length, 2);
    assert.equal(new Set(family.reasons).size, 2);
    assert.ok(family.tryThis && family.tradeOff && family.description);
    assert.equal(family.url, "/programmes/compare?family=" + family.id);
  }
  assert.match(result.stageGuide, /Class 11 subjects/);
  assert.match(result.priorities[0], /tuition/);
  const older = await score({ ...answers, stage: ["class-12"], priorities: ["location", "earning"] });
  assert.deepEqual(result.matches, older.matches);
  assert.notEqual(result.stageGuide, older.stageGuide);
  assert.notDeepEqual(result.priorities, older.priorities);
});

test("students can reach every family through ordinary school activities", async () => {
  const paths = {
    computing: ["time-queue", "film", "edit", "booking", "results", "game", "bus"],
    engineering: ["move-counter", "bridge", "load", "sound", "revise", "prototype", "bus"],
    "architecture-design": ["sketch-signs", "bridge", "access", "access", "revise", "prototype", "garden"],
    business: ["fair-turn", "cafe", "price", "cost", "arrange", "stall", "market"],
    "arts-sciences": ["sketch-signs", "film", "story", "light", "results", "guide", "court"],
    law: ["fair-turn", "case", "rule", "access", "questions", "game", "court"],
    health: ["ask-servers", "teach", "listen", "access", "practise", "guide", "recover"],
    agriculture: ["food-waste", "seedlings", "light", "light", "results", "plot", "garden"],
    hospitality: ["ask-servers", "cafe", "taste", "cost", "arrange", "stall", "market"],
  };
  for (const [family, [lunch, afternoon, followup, notice, practice, show, read]] of Object.entries(paths)) {
    const result = await score({ lunch: [lunch], afternoon: [afternoon], ["closer-" + afternoon]: [followup],
      notice: [notice], practice: [practice], show: [show], read: [read] });
    assert.equal(result.matches[0].id, family);
  }
});

test("skipped and evenly divided answers offer two contrasting activities", async () => {
  for (const answers of [{}, { stage: ["class-10"], lunch: ["not-tried"] },
    { lunch:["move-counter"], notice:["sound"], show:["prototype"] }]) {
    const result = await score(answers);
    assert.equal(result.state, "explore");
    assert.deepEqual(result.matches, []);
    assert.equal(result.activities.length, 2);
    assert.notEqual(result.activities[0].id, result.activities[1].id);
    assert.notEqual(result.activities[0].tile, result.activities[1].tile);
  }
});
test("unselected follow-ups and unexpected input are rejected", async () => {
  for (const bad of [{ ...answers, "closer-case":["rule"] }, { afternoon:["film","bridge","teach"] },
    { notice:["not-tried","access"] }, { priorities:["salary"] }, { stage:["not-tried"] },
    { lunch:["time-queue","time-queue"] }, { email:["personal@example.com"] }]) {
    assert.equal((await post(bad)).status, 422);
  }
  assert.equal((await post(answers, {prompt:"Unreviewed question"})).status, 422);
  assert.equal((await post(answers, {version:"srm-old"})).status, 422);
});
test("older API routes and the admissions anchor remain available", async () => {
  for (const apiPath of ["/api/admissions/programme-finder", "/api/admissions/programme-finder/step"]) {
    assert.equal((await fetch(new URL(apiPath,base))).status, 200);
  }
  const existingPage = await (await fetch(new URL("/admissions",base))).text();
  assert.match(existingPage, /id="programme-finder"/);
  assert.match(existingPage, /href="\/admissions\/course-finder"/);
});
test("provider-off coach responds with an immediate grounded explanation", { skip: !process.env.SRM_TEST_GROQ_OFF }, async () => {
  const response = await post(answers, {prompt:"why"});
  assert.equal(response.headers.get("cache-control"), "no-store");
  const {provider, answer} = await response.json();
  assert.equal(provider,"local");
  assert.match(answer, /Agriculture|horticulture/);
});
