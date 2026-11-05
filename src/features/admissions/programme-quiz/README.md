# Admissions programme finder

For the one-question-at-a-time backend, see the [guided v2 API contract and evidence notes](./guided/README.md). The rest of this file documents the original form.

The original v1 endpoint provides an anonymous, stateless quiz for students exploring first degrees after Class 12. The admissions page now uses guided v2. The initial pool has 30 selected campus-specific course records across seven SRM faculty listings. Each record resolves to an existing programme detail page and an official faculty admissions link. Campus is the location of the linked offering. The main programme directory covers additional options.

## Research and editorial choices

- De Vries, Meeter & Huizinga (2024) synthesised 23 studies. Interest congruence had small positive associations with academic outcomes, and full-profile approaches showed stronger associations. This informed the use of all six activity-interest dimensions and the decision to present a shortlist for exploration. [Educational Research Review](https://doi.org/10.1016/j.edurev.2024.100619)
- Messerer et al. (2025 issue, online 2024) followed 455 German university students. Interest in major-specific content was more closely associated with later satisfaction and performance than occupational interest fit. This informed the separate question about activities students want to study. [Studies in Higher Education](https://doi.org/10.1080/03075079.2024.2413867)

The English prompts, programme-to-interest assignments, weights and cutoffs are local editorial decisions. Their validity for SRM applicants has yet to be measured. The output describes expressed interests. The official faculty pages determine eligibility, fees, entrances and admission.

## Ranking

Each of the six RIASEC areas (Realistic, Investigative, Artistic, Social, Enterprising and Conventional) has two equally weighted ratings on a 1–5 scale. A course’s three mapped areas get weights of 3, 2 and 1 in its weighted mean. A student can optionally choose up to three study activities.

Explicit subject matches rank first by the number matched and then by weighted mean. A suggestion based solely on general interests requires a mean above neutral, at least a one-point spread across the six area means and a mapped area rated at least 4 and above the student's overall mean. Equal scores use the programme name and stable ID. A first pass represents each selected topic before filling the remaining slots. Flat or weak signals with no subject choice return an exploration prompt. Result reasons cite the actual endorsed topic or interest.

## API

`GET /api/admissions/programme-finder` returns the contract, prompts, scale, topic IDs, scope, version and sources. `POST` to the same URL with JSON. Submit all 12 question IDs exactly once in the answers object and zero to three distinct topic IDs. For example, in a browser console on this site:

```js
const url = "/api/admissions/programme-finder";
const quiz = await (await fetch(url)).json();
const answers = Object.fromEntries(quiz.questions.map(q => [q.id, 3]));
const response = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ version: quiz.version, answers, topics: ["hospitality"] }),
});
console.log(await response.json());
```

Success returns `status` (`matches` or `explore`), `version`, `message`, `browseUrl` and up to three `recommendations`. Each includes the course ID, degree, name, campus, faculty, reasons, details URL and official URL. Errors return `{ error }` with HTTP 400 for malformed JSON, 413 for more than 8 KiB, 415 for other media types and 422 for an invalid quiz submission. The handler neither persists nor logs answers. Submitting the same answers is repeatable.

## Maintenance and verification

The crosswalk in `profiles.ts` uses IDs from the site's admissions catalogue. Check the linked official listings when editing course profiles and bump the quiz version for changes to prompts, mappings or ranking. Agriculture and Horticulture use the teaching campus given in [SRM's agricultural sciences admissions form](https://applications.srmist.edu.in/agricultural-sciences-form).

With the site running, use `node --test scripts/admissions/programme-finder.test.mjs`. Set `SRM_TEST_URL` if the local server uses a port other than 3000. The suite exercises the actual HTTP handlers, admissions entry point and linked course pages.

