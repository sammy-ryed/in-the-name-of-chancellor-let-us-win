import { questionnaire, validate, type Submission } from "@/features/admissions/programme-quiz/quiz";
import { recommend } from "@/features/admissions/programme-quiz/recommend";
import { readSubmission, fail } from "@/features/admissions/programme-quiz/read-submission";

export function GET() {
  return Response.json(questionnaire);
}

export async function POST(request: Request) {
  const parsed = await readSubmission(request);
  if (parsed instanceof Response) return parsed;
  const error = validate(parsed.value);
  if (error) return fail(error, 422);
  return Response.json(recommend(parsed.value as Submission), { headers: { "Cache-Control": "no-store" } });
}
