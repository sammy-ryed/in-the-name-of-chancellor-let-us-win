export type ArtsSubject = "writing" | "film" | "science" | "maths" | "people";

type SubjectExamples = { subject: string; ids: readonly string[] };

export const artsExamples: Record<ArtsSubject, SubjectExamples> = {
  writing: { subject: "writing and reporting", ids: ["83388e2d08d", "ecaa6310de3", "cd68b7753d3"] },
  film: { subject: "film and visual storytelling", ids: ["bde09a1015e", "07748407bec"] },
  science: { subject: "investigating physics questions", ids: ["783a8d6aa50", "53c902978d9"] },
  maths: { subject: "mathematical patterns", ids: ["b580150bdd4", "bc820f397b6", "75e7177cd25"] },
  people: { subject: "how people think", ids: ["c6f117f7d14", "8b58fe35f08"] },
};

const broadExamples = [artsExamples.writing.ids[0], artsExamples.maths.ids[0], artsExamples.people.ids[0]];

export function artsSubject(value?: string | null): ArtsSubject | undefined {
  return value && Object.hasOwn(artsExamples, value) ? value as ArtsSubject : undefined;
}

export function artsExampleIds(subject?: string): readonly string[] {
  const key = artsSubject(subject);
  return key ? artsExamples[key].ids : broadExamples;
}
