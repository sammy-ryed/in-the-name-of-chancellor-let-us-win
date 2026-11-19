import { readJson } from "@/lib/read-json";
import { availability, findBooking, mutateBooking, VisitError } from "@/features/campus-visit/service";
import { indiaDate } from "@/features/campus-visit/config";

export const runtime = "nodejs";
const send = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" } });
export async function GET(request: Request) {
  try {
    const query = new URL(request.url).searchParams;
    const token = request.headers.get("authorization")?.replace(/^Bearer /, "");
    if (token) return send({ booking: findBooking(token) });
    return send(availability(query.get("campus") ?? "78", query.get("date") ?? indiaDate()));
  } catch (error) { return send({ error: error instanceof VisitError ? error.message : "Unable to load visits." }, error instanceof VisitError ? error.status : 500); }
}
export async function POST(request: Request) {
  const body = await readJson(request, 8192);
  if (body instanceof Response) return body;
  try { return send({ booking: mutateBooking(body.value) }); }
  catch (error) { return send({ error: error instanceof VisitError ? error.message : "Unable to save your visit. Please retry." }, error instanceof VisitError ? error.status : 500); }
}
