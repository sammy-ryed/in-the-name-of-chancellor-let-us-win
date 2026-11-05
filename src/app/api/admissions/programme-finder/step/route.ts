import { start, advance } from "@/features/admissions/programme-quiz/guided/flow";
import { readSubmission, fail } from "@/features/admissions/programme-quiz/read-submission";

const headers = { "Cache-Control": "no-store" };
export function GET() {
  return Response.json(start(), { headers });
}
export async function POST(request: Request) {
  const parsed = await readSubmission(request);
  if (parsed instanceof Response) return parsed;
  const response = advance(parsed.value);
  if (response.error !== undefined) return fail(response.error, response.status);
  return Response.json(response.body, { headers });
}

