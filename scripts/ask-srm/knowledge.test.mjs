import assert from "node:assert/strict";
import test from "node:test";

const endpoint = new URL("/api/ask-srm", process.env.SRM_TEST_URL || "http://127.0.0.1:3000");
async function search(query, previous) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "search", query, previous }),
  });
  assert.equal(response.status, 200);
  return (await response.json()).sources;
}

test("the campus comparison uses the same B.Tech subject on both campuses", async () => {
  const results = await search("Compare B.Tech CSE tuition at KTR and Ramapuram");
  assert.match(results[0].summary, /Kattankulathur.*Annual tuition: ₹4,75,000/);
  assert.match(results[1].summary, /Ramapuram.*Annual tuition: ₹3,75,000/);
  assert.equal(results[2].href, "/programmes/fees?compare=a4bf715656e,a30d32f7612");
  const changedCampus = await search("What about Ramapuram?", "B.Tech CSE tuition at KTR");
  assert.equal(changedCampus[0].href, results[1].href);
});

test("campus-name lookups give a campus overview even after an unrelated question", async () => {
  for (const [query, previous, expected] of [
    ["ktr", "groq api", /KTR is short for Kattankulathur/],
    ["Trichy", "", /Tiruchirappalli campus/],
    ["what is KTR?", "What are the CSE fees?", /KTR is short for Kattankulathur/],
  ]) {
    const response = await fetch(endpoint, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "ask", query, previous }),
    });
    assert.equal(response.status, 200);
    const result = await response.json();
    assert.equal(result.kind, "guide");
    assert.match(result.answer, expected);
    assert.ok(result.sources.every(source => source.section !== "Course details"));
    assert.equal(result.sources[0].section, "Visit SRM");
  }
  const [course] = await search("KTR", "How much is B.Tech CSE tuition?");
  assert.match(course.summary, /Kattankulathur.*Annual tuition: ₹4,75,000/);
});

test("course matches preserve full-programme, first-semester and unspecified periods", async () => {
  const [full] = await search("M.Tech Big Data Analytics flexible timings fees");
  assert.match(full.summary, /Full programme fee: ₹5,00,000/);
  const [phd] = await search("PhD engineering full time first semester tuition");
  assert.match(phd.summary, /First semester: ₹30,000.*Subsequent semester: INR 15000/);
  const [commerce] = await search("B.Com Accounting & Finance fees at KTR");
  assert.match(commerce.summary, /Listed fee: ₹1,30,000.*billing period is unspecified/);
});

test("international applicants receive their own admissions and fee source", async () => {
  const results = await search("As an international student, how much is B.Tech CSE at KTR?");
  assert.equal(results[0].href, "/admissions#international");
  assert.ok(results.every(result => result.section !== "Course details"));
});

test("parent portal searches list both official logins and explain the intake split", async () => {
  const pages = await search("Parent portal");
  const guide = pages.find(source => source.href === "/parents#parent-portals");
  assert.match(guide.summary, /ParentConnect.*2025/);
  assert.ok(pages.some(source => source.href === "https://parentconnect.srmist.edu.in/"));
  assert.ok(pages.some(source => source.href.endsWith("/parentLogin.jsp")));
  const [earlier] = await search("Parent portal 2024");
  assert.match(earlier.href, /parentLogin\.jsp$/);
});

test("interest guidance, research facilities and family help link to usable destinations", async () => {
  const choices = await search("I am torn between engineering and design. How do I think through my interests?");
  assert.equal(choices[0].href, "/admissions#programme-finder");
  assert.ok(choices.some(item => /Design/.test(item.title)));
  assert.ok(choices.some(item => /Engineering/.test(item.title)));
  const [instrument] = await search("Where can I book research instruments?");
  assert.match(instrument.href, /scif\.srmonline\.net/);
  const [advisor] = await search("How does a parent get their child's FA number?");
  assert.equal(advisor.href, "/parents#records");
});
