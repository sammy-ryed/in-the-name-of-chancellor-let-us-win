import assert from "node:assert/strict";
import test from "node:test";

const api = new URL("/api/admissions/programme-finder/v4", process.env.SRM_TEST_URL || "http://127.0.0.1:3000");
const version = "srm-course-families-v4";

function post(answers, extra = {}) {
  return fetch(api, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ version, answers, ...extra }),
  });
}
async function score(answers) {
  const response = await post(answers);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("cache-control"), /no-store/);
  return (await response.json()).result;
}

function assertExplore(result) {
  assert.equal(result.state, "explore");
  assert.deepEqual(result.matches, []);
  assert.ok(result.exploreReason);
  assert.equal(result.activities.length, 2);
  assert.equal(new Set(result.activities.map(family => family.id)).size, 2);
  assert.equal(new Set(result.activities.map(family => family.tryThis)).size, 2);
}

test("v4 starts with school stage and offers up to two follow-ups", async () => {
  const response = await fetch(api);
  assert.equal(response.status, 200);
  const metadata = await response.json();
  assert.equal(metadata.version, version);
  assert.equal(metadata.coreQuestions, 8);
  assert.equal(metadata.maxFollowups, 2);
  assert.equal(metadata.firstQuestion.id, "stage");
  assert.deepEqual(metadata.firstQuestion.choices.map(choice => choice.id), ["class-10", "class-11", "class-12", "finished"]);
});

// Each row describes a student's three choices in separate, everyday situations.
// No student needs to name a field or gain access to a follow-up to discover it.
const paths = {
  computing: { "sports-day": ["fixtures"], "at-home": ["sort-names"], "stick-with": ["debug-score"] },
  engineering: { afternoon: ["bridge"], "at-home": ["hinge"], shadow: ["repair"] },
  "architecture-design": { "sports-day": ["layout"], "stick-with": ["redraw"], shadow: ["floor-plan"] },
  business: { afternoon: ["price"], "sports-day": ["budget"], "stick-with": ["sales"] },
  "arts-sciences": { afternoon: ["skit"], "sports-day": ["match-report"], "at-home": ["spoon"] },
  law: { afternoon: ["fair-rule"], "stick-with": ["accounts"], shadow: ["case-file"] },
  health: { "sports-day": ["first-aid"], "at-home": ["pulse"], "stick-with": ["recovery"] },
  agriculture: { afternoon: ["seedlings"], "at-home": ["coriander"], shadow: ["harvest"] },
  hospitality: { afternoon: ["snack-service"], "sports-day": ["drinks"], shadow: ["kitchen"] },
};

for (const [family, answers] of Object.entries(paths)) {
  test(family + " is discoverable from work choices without naming the field", async () => {
    const result = await score(answers);
    assert.equal(result.state, "matches");
    assert.deepEqual(result.matches.map(match => match.id), [family]);
    const [match] = result.matches;
    assert.equal(match.reasons.length, 2);
    assert.notEqual(match.reasons[0], match.reasons[1]);
    assert.ok(match.reasons.every(reason => reason.includes("“")));
    assert.ok(match.tryThis && match.tradeOff && match.subjects);
    assert.equal(match.url, "/programmes/compare?family=" + family);
    assert.deepEqual(result.activities, []);
  });
}

test("age and practical priorities change guidance without changing the evidence", async () => {
  const younger = await score({ ...paths.agriculture, stage: ["class-10"], priorities: ["cost"] });
  const older = await score({ ...paths.agriculture, stage: ["finished"], priorities: ["earning", "location"] });
  assert.deepEqual(younger.matches, older.matches);
  assert.match(younger.stageGuide, /Class 11 subjects/);
  assert.notEqual(younger.stageGuide, older.stageGuide);
  assert.equal(older.priorities.length, 2);
  assert.match(younger.priorities[0], /tuition/i);
  assert.match(older.priorities.join(" "), /campus/i);
});

test("one concrete choice or two interests on the same screen cannot imply a match", async () => {
  for (const answers of [
    {}, { stage: ["class-12"], priorities: ["options"] },
    { interests: ["computing", "engineering"], "sports-day": ["fixtures"] },
    { interests: ["engineering", "computing"], "sports-day": ["fixtures"], "at-home": ["hinge"] },
    { afternoon: ["bridge"], "at-home": ["hinge"] },
  ]) assertExplore(await score(answers));
  assert.match((await score({})).exploreReason, /examples|starting points/i);
});

test("two evenly supported kinds of work stay open even if one was a named interest", async () => {
  const answers = { interests: ["business"], afternoon: ["price"], "sports-day": ["budget"], "stick-with": ["accounts"], shadow: ["case-file"] };
  const result = await score(answers);
  assertExplore(result);
  assert.deepEqual(new Set(result.activities.map(family => family.id)), new Set(["business", "law"]));
  assert.match(result.exploreReason, /equally/i);
});

test("recurring work can lead outside a named interest and support two different directions", async () => {
  const answers = {
    interests: ["hospitality"], ...paths.computing, afternoon: ["seedlings"], shadow: ["harvest"],
  };
  const result = await score(answers);
  assert.deepEqual(result.matches.map(family => family.id), ["computing", "agriculture"]);
  assert.match(result.matches[0].reasons.join(" "), /fixture|match|team|name|sort|list/i);
  assert.match(result.matches[1].reasons.join(" "), /seed|grow|plant|field|crop|soil|harvest/i);
});

test("three independently supported families can share a shortlist when one has a clear lead", async () => {
  const result = await score({
    interests: ["computing", "architecture-design"], afternoon: ["fair-rule"], "sports-day": ["fixtures"],
    "at-home": ["sort-names"], "stick-with": ["redraw"], shadow: ["case-file"],
    "closer-computing": ["instructions"], "closer-architecture-design": ["plan"],
  });
  assert.equal(result.matches[0].id, "computing");
  assert.deepEqual(new Set(result.matches.map(match => match.id)), new Set(["computing", "architecture-design", "law"]));
  assert.ok(result.matches.every(match => new Set(match.reasons).size === 2));
});

test("neutral choices give no support and never replace or accompany actual interests", async () => {
  const mixed = await score({ interests: ["none-fit"], afternoon: ["not-tried"], "at-home": [], priorities: ["earning"] });
  assertExplore(mixed);
  assert.match(mixed.exploreReason, /examples/i);
  assert.deepEqual(mixed.activities, (await score({})).activities);
  for (const answers of [
    { stage: ["none-fit"] }, { priorities: ["not-tried"] }, { interests: ["none-fit", "business"] },
    { interests: ["not-tried", "none-fit"] }, { interests: ["none-fit"], "closer-business": ["margin"] },
  ]) assert.equal((await post(answers)).status, 422);
});

test("a named interest and its follow-up need independent support, and the follow-up can point elsewhere", async () => {
  assertExplore(await score({ interests: ["health"], "closer-health": ["movement"], priorities: ["location"] }));
  const result = await score({ interests: ["engineering"], "closer-engineering": ["grip"], "sports-day": ["layout"] });
  assert.deepEqual(result.matches.map(match => match.id), ["architecture-design"]);
  const reasons = result.matches[0].reasons;
  assert.match(reasons[0], /stalls and paths/i);
  assert.match(reasons[1], /handle/i);
  assert.doesNotMatch(reasons.join(" "), /mechanic|circuit/i);

  // Going back and changing the field removes the old follow-up from the valid path.
  assert.equal((await post({ interests: ["health"], "closer-engineering": ["grip"], "sports-day": ["layout"] })).status, 422);
  const revised = await score({ interests: ["health"], "closer-health": ["progress"], "sports-day": ["first-aid"] });
  assert.deepEqual(revised.matches.map(match => match.id), ["health"]);
  assert.match(revised.matches[0].reasons.join(" "), /first-aid/i);
});

test("two self-selected follow-ups cannot corroborate each other in the absence of a core task", async () => {
  const result = await score({
    interests: ["computing", "hospitality"], "closer-computing": ["cost"], "closer-hospitality": ["cost"],
  });
  assertExplore(result);
  assert.equal(result.activities[0].id, "business");
});

test("a small lead in a scattered set of work choices invites more exploration", async () => {
  const result = await score({ afternoon: ["price"], "sports-day": ["budget"], "at-home": ["pulse"],
    "stick-with": ["redraw"], shadow: ["repair"] });
  assertExplore(result);
  assert.equal(result.activities[0].id, "business");
  assert.match(result.exploreReason, /several different families/);
});

test("a broad arts and sciences match offers the specific kind of work the student chose", async () => {
  const trials = [
    ["writing", /interview/i], ["film", /six frames/i], ["science", /shadow/i],
    ["maths", /odd numbers/i], ["people", /picture/i],
  ];
  for (const [interest, expectedActivity] of trials) {
    const result = await score({ interests: ["arts-sciences"], "closer-arts-sciences": [interest], "at-home": ["spoon"] });
    assert.equal(result.matches[0].id, "arts-sciences");
    assert.match(result.matches[0].tryThis, expectedActivity);
  }
});

test("v4 validates IDs, selection limits and question scope", async () => {
  for (const answers of [
    null, [], { stage: ["class-9"] }, { interests: ["computing", "law", "health"] },
    { interests: ["law", "law"] }, { shadow: [42] }, { priorities: ["salary"] },
    { interests: ["business"], "closer-law": [] }, { "closer-computing": [] },
    { email: ["student@example.test"] },
  ]) assert.equal((await post(answers)).status, 422);
  for (const extra of [{ version: "srm-course-families-v3" }, { prompt: "unreviewed" }, { school: "extra" }]) {
    assert.equal((await post({}, extra)).status, 422);
  }
  assert.equal((await post({ stage: [], priorities: [], interests: ["law"], "closer-law": [] })).status, 200);
});

test("the placements coach returns dated hiring and task evidence without forecasting a course outcome", async () => {
  for (const answers of [{}, paths.computing]) {
    const res = await post(answers, { prompt: "placements" });
    assert.equal(res.status, 200);
    const { provider, answer, sources } = await res.json();
    assert.equal(provider, "local");
    assert.match(answer, /August 2026.*257 employers.*35%/);
    assert.match(answer, /ILO.*2025/);
    assert.match(answer, /particular SRM course or campus/);
    assert.deepEqual(sources.map(source => new URL(source.href).hostname), ["www.deloitte.com", "www.ilo.org"]);
  }
});

test("the previous v3 API still accepts its original bank", async () => {
  const old = new URL("/api/admissions/programme-finder/v3", api);
  const response = await fetch(old, { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ version: "srm-course-families-v3", answers: { lunch: ["time-queue"] } }) });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).version, "srm-course-families-v3");
});

test("the local coach explains actual match and exploration outcomes with the provider off", {
  skip: !process.env.SRM_TEST_GROQ_OFF,
}, async () => {
  for (const [answers, prompt, pattern] of [
    [paths.computing, "why", /computing.+two separate choices/is],
    [{}, "why", /starting points|examples/i],
    [paths.agriculture, "next", /pots/i],
  ]) {
    const response = await post(answers, { prompt });
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.provider, "local");
    assert.match(body.answer, pattern);
  }
});
