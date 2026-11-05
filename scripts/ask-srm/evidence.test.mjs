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
});
