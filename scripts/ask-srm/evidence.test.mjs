import assert from "node:assert/strict";
import test from "node:test";
import { figuresAreSupported } from "../../src/features/ask-srm/evidence.ts";

const course = (campus, feePeriod) => ({
  title: "B.Tech CSE · " + campus, section: "Course details", href: "/programmes",
  summary: "Domestic fees — " + feePeriod + ". Duration: 4 years.",
});
const annual = [course("Kattankulathur", "Annual tuition: ₹4,75,000"), course("Ramapuram", "Annual tuition: ₹3,75,000")];

test("matches figures from the cited records despite Indian currency and list formatting", () => {
  assert.equal(figuresAreSupported("1) Kattankulathur costs ₹4.75 lakh a year. 2) Ramapuram costs ₹375,000 a year.", annual), true);
  assert.equal(figuresAreSupported("Tuition is ₹5 lakh.", annual), false);
  assert.equal(figuresAreSupported("A guarantee of 100% placement.", annual), false);
});

test("allows a calculated difference only between two fees with matching periods", () => {
  assert.equal(figuresAreSupported("The difference is ₹1,00,000 per year.", annual), true);
  assert.equal(figuresAreSupported("The difference is ₹1 lakh.", [annual[0], course("Ramapuram", "Semester tuition: ₹3,75,000")]), false);
  assert.equal(figuresAreSupported("The difference is ₹2 lakh.", annual), false);
  const disputed = { ...annual[0], summary: annual[0].summary + " Fee sources differ." };
  assert.equal(figuresAreSupported("The difference is ₹1 lakh.", [disputed, annual[1]]), false);
});

test("a fee, rank and percentage remain distinct even when the number matches", () => {
  const sources = [{ title: "Example award", section: "Admissions", href: "/admissions/scholarships",
    summary: "Ranks 1 to 100 can apply for a 50% tuition concession. A sample fee is INR 2,000." }];
  assert.equal(figuresAreSupported("Ranks up to 100, with a 50 per cent concession.", sources), true);
  assert.equal(figuresAreSupported("The fee is Rs. 2,000.", sources), true);
  assert.equal(figuresAreSupported("100% of applicants receive an award.", sources), false);
  assert.equal(figuresAreSupported("The fee is ₹100.", sources), false);
});

test("percentages at both ends of a published concession range keep their unit", () => {
  const source = { title: "Award", section: "Scholarships", href: "/admissions/scholarships", summary: "Support ranges from 25–100% of tuition." };
  assert.equal(figuresAreSupported("The range starts at 25 per cent, up to 100%.", [source]), true);
});
