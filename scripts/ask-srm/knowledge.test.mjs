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
  assert.equal(results[2].href, "/programmes/compare?compare=a4bf715656e,a30d32f7612");
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
  assert.equal(choices[0].href, "/admissions/course-finder");
  assert.ok(choices.some(item => /Design/.test(item.title)));
  assert.ok(choices.some(item => /Engineering/.test(item.title)));
  const [instrument] = await search("Where can I book research instruments?");
  assert.match(instrument.href, /scif\.srmonline\.net/);
  const [advisor] = await search("How does a parent get their child's FA number?");
  assert.equal(advisor.href, "/parents#records");
});

test("finder aliases and Class 10 stream questions open the guided course finder", async () => {
  for (const query of ["Find your direction", "Which course suits me?", "What stream should I take after 10th?"]) {
    const [first] = await search(query);
    assert.equal(first.title, "SRM Course Finder", query);
    assert.equal(first.href, "/admissions/course-finder", query);
  }
  const directions = await search("Find directions to campus");
  assert.ok(directions.some(s => s.href === "https://www.srmist.edu.in/visitors/"));
  assert.ok(directions.every(s => s.href !== "/admissions/course-finder"));
});

test("general contacts and admissions enquiries reach the right published desk", async () => {
  const [general] = await search("What is the SRM general enquiries email and phone number?");
  assert.equal(general.href, "/contact");
  assert.ok(general.summary.includes("infodesk@srmist.edu.in"));
  const [law] = await search("Admissions contact for law");
  assert.equal(law.href, "/contact#other-admissions");
  const international = await search("International admissions email");
  assert.equal(international[0].href, "/contact#international-admissions");
  assert.ok(international.every(item => item.section !== "Course details"));
});

test("physical visits, virtual tours and peer introductions have distinct destinations", async () => {
  const first = async (query, previous) => (await search(query, previous))[0];
  assert.equal((await first("can I bring my parents for a camus vist?")).href, "/admissions/campus-visit");
  assert.equal((await first("is Ramapuram available?", "book a campus visit")).href, "/admissions/campus-visit");
  assert.match((await first("what should I bring?", "book a campus visit")).summary, /demo passes do not authorise entry/i);
  assert.match((await first("can I tour the campus from home?")).href, /virtual-tour/);
  assert.equal((await first("how can I meet a senior before classes start?")).href, "/campus/buddy");
  assert.match((await first("where do we meet?", "campus buddy")).summary, /Arch Gate/);
  assert.equal((await first("What about hostel booking?", "book a campus visit")).href, "/campus/accommodation#booking");
  assert.equal((await first("What documents do I need?", "Can I book a campus visit?")).href, "/admissions/campus-visit#before-arrival");
});

test("student spelling, award names and application follow-ups reach specific guides", async () => {
  assert.equal((await search("how do I apply for a scholorship?"))[0].href, "/admissions/scholarships#apply");
  assert.equal((await search("Is there a Founder's scholarship?"))[0].href, "/admissions/scholarships#founder");
  const [uploads] = await search("Where do I upload my signature?", "How do I apply for SRMJEEE?");
  assert.equal(uploads.href, "/admissions/apply#prepare");
  assert.match(uploads.summary, /official application form/);
  assert.doesNotMatch(uploads.summary, /\d\s*MB/i);
  assert.equal((await search("What courses should I take after 12th?"))[0].href, "/admissions/course-finder");
  const equipment = await search("book an XRD slot");
  assert.ok(equipment.some(source => /diffraction|instrument/i.test(source.summary)));
  assert.ok(equipment.every(source => !source.href.includes("campus-visit") && !source.href.includes("accommodation")));
});

test("incidental words alone do not supply evidence for unrelated subjects", async () => {
  for (const query of ["what is the weather on Mars?", "how much is the fee for the moon mission?", "what happens if aliens steal my sandwich?"]) {
    assert.deepEqual(await search(query), [], query);
  }
});

test("explicit applicant and service switches use the new topic", async () => {
  const [domestic] = await search("What are the domestic B.Tech CSE fees at Ramapuram?", "What are international admissions fees?");
  assert.equal(domestic.href, "/programmes/a30d32f7612");
  assert.match((await search("How much does the hostel cost?", "When is scholarship renewal?"))[0].href, /^\/campus\/accommodation/);
  assert.equal((await search("Which courses does SRM offer?", "How do I apply for international admissions?"))[0].href, "/programmes");
});
