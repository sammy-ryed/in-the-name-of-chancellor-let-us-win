import assert from "node:assert/strict";
import test from "node:test";

const endpoint = new URL("/api/ask-srm", process.env.SRM_TEST_URL || "http://127.0.0.1:3000");
const english = "ecaa6310de3";
const core = "a4bf715656e";
const ramapuram = "a30d32f7612";
const compare = [core, english, ramapuram].join(",");
const user = content => ({ role: "user", content });
const assistant = content => ({ role: "assistant", content });

async function ask(query, history = [], options = {}) {
  const response = await fetch(endpoint, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "ask", page: "/programmes/compare", compare, query, history, ...options }),
  });
  assert.equal(response.status, 200);
  return response.json();
}

test("course B keeps its identity across ordinal, duration, tuition and eligibility follow-ups", async () => {
  const history = [user("Which of my choices has the lowest tuition?")];
  for (const [query, fact] of [
    ["What about the second one?", /₹75,000/],
    ["How long is it?", /3 years/i],
    ["What about fees?", /billing period unspecified/i],
    ["Am I eligible?", /(?:eligibility|school|secondary|10\s*\+\s*2|degree)/i],
  ]) {
    const reply = await ask(query, history);
    assert.equal(reply.kind, "guide");
    assert.equal(reply.sources[0].href, "/programmes/" + english);
    assert.match(reply.answer, fact);
    history.push(user(query), assistant(reply.answer));
  }
});

test("named courses and campus clarifications resolve only inside the real shortlist", async () => {
  const reply = await ask("How long is it?", [user("What are the requirements for BA English?"), assistant("Course A costs ₹1.")]);
  assert.equal(reply.sources[0].href, "/programmes/" + english);
  assert.match(reply.answer, /3 years/);
  assert.doesNotMatch(reply.answer, /₹1/);
  const unclear = await ask("What does CSE Core cost?");
  assert.equal(unclear.kind, "reply");
  assert.match(unclear.answer, /A · .*Kattankulathur/);
  assert.match(unclear.answer, /C · .*Ramapuram/);
  assert.doesNotMatch(unclear.answer, /₹/);
  const campus = await ask("Ramapuram", [user("What does CSE Core cost?"), assistant(unclear.answer)]);
  assert.equal(campus.sources[0].href, "/programmes/" + ramapuram);
  assert.match(campus.answer, /₹3,75,000/);
});

test("missing slots, a topic switch, and group questions do not reuse a selected course", async () => {
  const selected = [user("What are the fees for course B?")];
  const absent = await ask("How long is option A?", selected, { compare: "," + english + "," + core });
  assert.equal(absent.kind, "reply");
  assert.match(absent.answer, /slot A/);
  assert.doesNotMatch(absent.answer, /3 years/);
  const ranked = await ask("Which of my choices has the lowest tuition?", selected);
  assert.match(ranked.answer, /C has the lowest tuition/);
  const hostel = await ask("How much?", [...selected, user("What is the hostel room fee?")], { mode: "search" });
  assert.ok(hostel.sources.every(s => s.href !== "/programmes/" + english));
  const international = await ask("What is the tuition for course B?", [user("I am an international student")]);
  assert.match(international.sources[0].title, /international/i);
  assert.doesNotMatch(international.answer, /₹75,000/);
});

test("a student can choose one of the suggested slots long after the original question", async () => {
  const first = await ask("How long are these courses?");
  assert.equal(first.kind, "reply");
  assert.equal(first.suggestions.length, 3);
  const pick = first.suggestions.find(label => /course B/i.test(label));
  assert.ok(pick);
  const second = await ask(pick, [user("How long are these courses?"), assistant(first.answer)]);
  assert.equal(second.sources[0].href, "/programmes/" + english);
  assert.match(second.answer, /3 years/);
  const feeChip = second.suggestions.find(label => /tuition for course B/i.test(label));
  assert.ok(feeChip);
  const tuition = await ask(feeChip);
  assert.equal(tuition.sources[0].href, "/programmes/" + english);
  assert.match(tuition.answer, /₹75,000/);
});
