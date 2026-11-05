import test from "node:test";
import assert from "node:assert/strict";

const base = process.env.SRM_TEST_URL || "http://127.0.0.1:3000";
const api = new URL("/api/admissions/programme-finder", base);
const get = await fetch(api);
assert.equal(get.status, 200);
const quiz = await get.json();
const answers = Object.fromEntries(quiz.questions.map(q => [q.id, 3]));
const neutral = { version: quiz.version, answers, topics: [] };
const post = (body, type = "application/json") => fetch(api, {
  method: "POST", headers: { "Content-Type": type }, body,
});
async function result(data) {
  const response = await post(JSON.stringify(data));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  return response.json();
}

test("admissions owns the working quiz and publishes the frontend contract", async () => {
  const page = await fetch(new URL("/admissions", base));
  assert.equal(page.status, 200);
  assert.match(await page.text(), /id="programme-finder"/);
  assert.equal(quiz.questions.length, 12);
  assert.equal(Object.keys(answers).length, 12);
  assert.deepEqual(quiz.scale.map(s => s.value), [1, 2, 3, 4, 5]);
});

test("undifferentiated profiles get an exploration route without an arbitrary winner", async () => {
  for (const value of [1, 3, 5]) {
    const r = await result({ ...neutral, answers: Object.fromEntries(quiz.questions.map(q => [q.id, value])) });
    assert.equal(r.status, "explore");
    assert.deepEqual(r.recommendations, []);
    assert.equal(r.browseUrl, "/programmes");
  }
});

test("every subject can lead to an explained, source-linked course with a real detail page", async () => {
  const faculties = new Set();
  const visited = new Set();
  for (const topic of quiz.topics) {
    const r = await result({ ...neutral, topics: [topic.id] });
    assert.equal(r.status, "matches", topic.id);
    assert.ok(r.recommendations.length >= 1 && r.recommendations.length <= 3);
    assert.equal(new Set(r.recommendations.map(c => c.courseId)).size, r.recommendations.length);
    for (const c of r.recommendations) {
      assert.ok(c.reasons.some(s => s.includes(topic.label)));
      assert.equal(new URL(c.officialUrl).hostname, "www.srmist.edu.in");
      assert.equal(c.detailsUrl, "/programmes/" + c.courseId);
      faculties.add(c.faculty);
      if (!visited.has(c.courseId)) {
        const page = await fetch(new URL(c.detailsUrl, base));
        assert.equal(page.status, 200, c.name);
        visited.add(c.courseId);
      }
    }
  }
  assert.equal(faculties.size, 7);
});

test("guest service and clinical care produce different results; three choices get representation", async () => {
  const hospitality = await result({ ...neutral, topics: ["hospitality"] });
  assert.match(hospitality.recommendations[0].name, /Hotel/i);
  const clinical = await result({ ...neutral, topics: ["health"] });
  assert.ok(clinical.recommendations.every(c => c.faculty === "Medicine & Health Sciences"));
  const topics = ["agriculture", "law", "hospitality"];
  const mixed = { ...neutral, topics };
  const r = await result(mixed);
  assert.deepEqual(await result(mixed), r);
  for (const t of topics) {
    const label = quiz.topics.find(x => x.id === t).label;
    assert.ok(r.recommendations.some(c => c.reasons.some(s => s.includes(label))));
  }
  assert.match(r.recommendations.find(c => c.faculty === "Agricultural Sciences").campus, /Baburayanpettai/);
});

test("activity ratings influence the order even for the same subject", async () => {
  const care = await result({ ...neutral, topics: ["health"], answers: { ...answers, teach: 5, support: 5, adjust: 5, assemble: 5 } });
  const lab = await result({ ...neutral, topics: ["health"], answers: { ...answers, investigate: 5, patterns: 5, audit: 5, organise: 5 } });
  assert.notEqual(care.recommendations[0].courseId, lab.recommendations[0].courseId);
  const broad = await result({ ...neutral, answers: { ...answers, create: 5, compose: 5 } });
  assert.equal(broad.status, "matches");
  assert.ok(broad.recommendations.every(c => c.reasons.some(s => s.includes("creative expression"))));
});

test("invalid, stale and oversized requests fail before scoring", async () => {
  const { assemble, ...missing } = answers;
  assert.equal(assemble, 3);
  for (const body of [null, [], {}, { ...neutral, version: "old" }, { ...neutral, answers: missing },
    { ...neutral, email: "extra" }, { ...neutral, answers: { ...answers, extra: 3 } },
    ...[0, 6, 2.5, "3", null, true].map(value => ({ ...neutral, answers: { ...answers, teach: value } })),
    ...[null, "law", ["none"], ["constructor"], ["law", "law"], ["law", "health", "design", "media"]].map(topics => ({ ...neutral, topics }))]) {
    assert.equal((await post(JSON.stringify(body))).status, 422);
  }
  assert.equal((await post("{")).status, 400);
  assert.equal((await post("{}","text/plain")).status, 415);
  assert.equal((await post("x".repeat(9000))).status, 413);
  const chunks = new ReadableStream({ start(c) {
    c.enqueue(new Uint8Array(5000)); c.enqueue(new Uint8Array(5000)); c.close();
  } });
  assert.equal((await fetch(api, { method: "POST", headers: { "Content-Type": "application/json" }, body: chunks, duplex: "half" })).status, 413);
  assert.equal((await fetch(api, { method: "PUT" })).status, 405);
});

