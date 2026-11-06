import { readJson } from "@/lib/read-json";
export { jsonError as fail } from "@/lib/read-json";

export function readSubmission(request: Request) {
  return readJson(request, 8192);
}
