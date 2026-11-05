# Guided admissions quiz (v2)

The admissions page renders the first question and submits answers to `/api/admissions/programme-finder/step`. The original v1 API remains available for existing clients. Both handlers are anonymous and stateless. Answers stay in the client between calls. No account, database, model call or third-party request is involved in scoring.

## One-question contract

1. GET the step URL. The response contains `version`, `state: "question"` and one `question`. Display its prompt, options and skip label. Single-choice values are option IDs. Multiple-choice values are arrays of distinct IDs up to `maxChoices`. The amount question takes a positive whole number of rupees per year. Send JSON null to skip any question.
2. Append `{ questionId: question.id, value }` to a local answers array. POST `{ version, answers }` as JSON to the same URL. Render the next question.
3. When `state` is `"complete"`, display `result`. Keep the shortlist, the example tasks and the stated reasons together. Show the earnings note, year, cohort, denominator and source alongside any salary. Show the admissions requirements and official URL when the student considers a course.
4. For Back, drop the answer to the question being edited and all later answers, then POST the retained prefix. Retrying the same request returns the same response. Two tabs have independent histories. A stale version returns HTTP 409. An invalid choice, extra answer field, duplicate item or out-of-order step returns 422. The shared reader rejects malformed JSON (400), bodies over 8 KiB (413) and other media types (415).

First exchange example:

```js
const url = "/api/admissions/programme-finder/step";
const first = await (await fetch(url)).json();
const answers = [{ questionId: first.question.id, value: first.question.options[0].id }];
const next = await (await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ version: first.version, answers }),
})).json();
```

## What shapes an answer

Six everyday situations each offer three plausible roles. The six broad interest dimensions have equal exposure in each option position across the bank. Two further prompts ask about preferred tasks and the freedom to choose a method. Subject tasters narrow to a maximum of six sample activities. The goals question allows two priorities. Only students who select starting pay see the optional annual salary target. Every path takes 10–12 steps.

The 36 options use existing SRM undergraduate admissions IDs across seven faculty listings. The task attached to each course illustrates one possible activity. Original prompts, mappings and weights are editorial and have yet to be validated with Indian Class 12 students.

- Explicit sample choices come first. A broad area can stand in when a student skips its follow-up. The shortlist covers both explicit directions before filling up to three places.
- An interest contributes only after at least two related choices. The three mapped interests of a programme receive weights of 3, 2 and 1 times their repeated counts. Preferred task contributes 5 points, preferred method 1, and matching values 2. These are preference comparisons within this quiz. They are unsuitable for personality diagnoses, aptitude scores or admission decisions.
- A preference to finish sooner favours the listed regular three-year routes (+4). Training and internship details are passed through. Salary is a separate priority. A verified cohort median at or above the target, or a reported median when the student gives no target, adds 2 points. A missing figure or one below target adds zero. Personal matches retain priority over purely practical comparisons.
- With practical goals alone, the response identifies its basis and represents different reporting groups or faculties. If pay and a shorter degree are both important, it includes examples of both. For working hours and job security, it gives concrete questions to ask graduates and placement staff. The college catalogue cannot establish employment conditions for individuals.
- When pay is selected, four reviewed group medians are available for comparison, including when a preferred programme has no verified figure. Medians apply to placed graduates in the specified group, with distinct reporting years and breadth. A faculty-wide number must not be displayed as a course or campus salary, a job guarantee, placement probability or ten-year forecast. The `earnings.ts` records link to the UG rows in the original SRM/NIRF submissions.

## Evidence behind the design

- Local familiarity and language matter. Baikenov et al. adapted a secondary-school instrument after an initial model failed to reproduce in their pilot. They reviewed items for familiarity, age and need for prior knowledge. This guided the choice of school and neighbourhood situations. Their findings concern their own instrument and population. [2026 study](https://doi.org/10.3389/feduc.2026.1816150)
- Adolescents can care about multiple aspects of work. Puonti et al. studied intrinsic, extrinsic, social and other work values in Finnish ninth graders. This informed separate choices about pay, flexibility, helping, learning and enterprise, with no penalty for prioritising money. [2025 study](https://doi.org/10.1002/cdq.12374)
- Research on college major choice found that non-pay information, including flexibility and employment prospects, can matter. This informed the separate comparison of pay, course length and personal priorities. [2024 information intervention](https://www.sciencedirect.com/science/article/pii/S0167268124004141)
- The original design drew on research on full interest profiles and major-specific content. The guided flow retains interest dimensions and adds samples of study activities. [2024 meta-analysis](https://doi.org/10.1016/j.edurev.2024.100619) · [2025 major-fit study](https://doi.org/10.1080/03075079.2024.2413867)

The API tests check deterministic behaviour and factual boundaries. Measuring accuracy requires a local pilot: ask Class 12 students from different streams to explain each choice in their own words, check skipped items and stability on a repeat visit, and compare shortlisted courses with informed choices after a course taster. Bump the version when changing the meaning of an answer, response branches or ranking.

With a local server running, execute `node --test scripts/admissions/*.test.mjs` (or pass both filenames explicitly). Set `SRM_TEST_URL` to change the host and port.

