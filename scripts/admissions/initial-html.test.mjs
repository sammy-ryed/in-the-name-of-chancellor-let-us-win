import assert from "node:assert/strict";
import test from "node:test";

const base = process.env.SRM_TEST_URL || "http://127.0.0.1:3000";

async function initialMain(path) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200);
  const markup = (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  // The regression put the actual page in a hidden sibling. Only the compass was in main.
  const main = markup.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  assert.ok(main, path);
  assert.match(main, /<h1\b/, path);
  return main;
}

test("the normal programme enquiry entry point is present in the first document", async () => {
  const programmePage = await initialMain("/programmes/a4bf715656e");
  assert.match(programmePage, /href="\/admissions\?course=a4bf715656e#enquiry"/);
});

test("Admissions includes a contextual email link before any scripts run", async () => {
  const cases = [
    ["/admissions", "General admissions"],
    ["/admissions?course=a4bf715656e", "B.Tech · Computer Science and Engineering / Kattankulathur"],
    ["/admissions?course=a30d32f7612&view=classic", "B.Tech · Computer Science and Engineering / Ramapuram"],
    ["/admissions?course=unknown", "General admissions"],
  ];

  for (const [path, context] of cases) {
    const main = await initialMain(path);
    assert.match(main, /id="enquiry"/);
    const email = main.match(/<a\b[^>]*href="(mailto:admissions\.india@srmist\.edu\.in\?[^"]+)"/i)?.[1];
    assert.ok(email, path);
    const url = new URL(email.replaceAll("&amp;", "&"));
    assert.equal(url.searchParams.get("subject"), "Programme enquiry: " + context);
    assert.equal(url.searchParams.get("body").trim(), context);
  }
});
