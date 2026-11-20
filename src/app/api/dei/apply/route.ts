import { randomBytes } from "node:crypto";
import { allFields, checkFiles, checkValue, isVisible, type Values } from "@/features/dei/apply/schema";

export const runtime = "nodejs";

const maxBody = 32 * 1024 * 1024;

function send(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

/**
 * Validates an incubation application with the same rules as the form.
 * Prototype: nothing is stored or forwarded. Connect this to BRC's intake system (and add rate limiting) before launch.
 */
export async function POST(request: Request) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > maxBody) return send({ error: "Your files are too large to send together. Keep the total under 32 MB." }, 413);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return send({ error: "We couldn't read the application. Please try again." }, 400);
  }

  const values: Values = {};
  for (const f of allFields) {
    if (f.kind === "file") continue;
    const all = form.getAll(f.name).filter((v): v is string => typeof v === "string");
    values[f.name] = f.kind === "checks" ? all : (all[0] ?? "");
  }

  const errors: Record<string, string> = {};
  for (const f of allFields) {
    if (!isVisible(f, values)) continue;
    const problem = f.kind === "file"
      ? checkFiles(f, form.getAll(f.name).filter((v): v is File => typeof v === "object" && v !== null && "size" in v && v.size > 0))
      : checkValue(f, values[f.name]);
    if (problem) errors[f.name] = problem;
  }
  if (Object.keys(errors).length) return send({ error: "Some answers need attention.", errors }, 422);

  const reference = "DEI-" + new Date().getFullYear() + "-" + randomBytes(3).toString("hex").toUpperCase();
  return send({ reference }, 201);
}
