import QRCode from "qrcode";
import { findBooking, VisitError } from "@/features/campus-visit/service";
import { visitConfig } from "@/features/campus-visit/config";
import { createVisitPassPdf } from "@/features/campus-visit/pass-pdf";

export const runtime = "nodejs";
function foldCalendarLine(line: string) {
  let output = "", bytes = 0;
  for (const character of line) {
    const size = Buffer.byteLength(character, "utf8");
    if (bytes + size > 73) { output += "\r\n "; bytes = 1; }
    output += character; bytes += size;
  }
  return output;
}
export async function GET(request: Request) {
  const url = new URL(request.url);
  const headers = { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex, nofollow" };
  try {
    const b = findBooking(url.searchParams.get("token") ?? "");
    if (b.status !== "confirmed") throw new VisitError("This visit has been cancelled.", 410);
    const c = visitConfig.campuses.find(c => c.id === b.slot.campusId)!;
    if (url.searchParams.get("format") === "ics") {
      const stamp = (time: string) => new Date(`${b.slot.date}T${time}:00+05:30`).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z/, "Z");
      const icsEscape = (s: string) => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/[,;]/g, "\\$&");
      const content = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//SRM Redesign//Campus Visit Demo//EN", "BEGIN:VEVENT", `UID:${b.id}@campus-visit.demo`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z/, "Z")}`, `DTSTART:${stamp(b.slot.start)}`, `DTEND:${stamp(b.slot.end)}`, `SUMMARY:${icsEscape(`Demo campus visit · ${c.name}`)}`, `LOCATION:${icsEscape(`${b.slot.venue}, ${c.name}`)}`, `DESCRIPTION:${icsEscape(`Demo only; not an official entry permit. ${b.id}. Guide: ${b.slot.guide}. Re-download after rescheduling.`)}`, "END:VEVENT", "END:VCALENDAR", ""].map(foldCalendarLine).join("\r\n");
      return new Response(content, { headers: { ...headers, "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": 'attachment; filename="srm-campus-visit.ics"' } });
    }
    const verify = new URL(`/admissions/campus-visit/verify?pass=${b.pass}`, url.origin).href;
    const qr = await QRCode.toString(verify, { type: "svg", margin: 4, errorCorrectionLevel: "M", width: 230 });
    if (url.searchParams.get("qr") === "1") return new Response(qr, { headers: { ...headers, "Content-Type": "image/svg+xml" } });
    const pdf = await createVisitPassPdf(b, verify);
    return new Response(new Uint8Array(pdf), { headers: { ...headers, "Content-Type": "application/pdf", "Content-Disposition": 'attachment; filename="srm-campus-visit-pass.pdf"' } });
  } catch (e) { return Response.json({ error: e instanceof VisitError ? e.message : "Unable to generate pass." }, { status: e instanceof VisitError ? e.status : 500, headers }); }
}
