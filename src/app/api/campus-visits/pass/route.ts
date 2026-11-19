import QRCode from "qrcode";
import { findBooking, VisitError } from "@/features/campus-visit/service";
import { prettyDate, prettyTime, visitConfig } from "@/features/campus-visit/config";

export const runtime = "nodejs";
const escape = (s: string) => s.replace(/[<>&"']/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[c]!);
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
    const lines = [b.visitor.name, c.name + " · " + c.location, prettyDate(b.slot.date), `${prettyTime(b.slot.start)} – ${prettyTime(b.slot.end)} · IST`, `Reporting: ${b.slot.venue}`, `Guide: ${b.slot.guide}`, `Coordinator: ${b.slot.coordinator}`, `Visitors: ${b.visitor.accompanying + 1}`, "Please arrive 15 minutes before your batch."];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="760" viewBox="0 0 900 760"><rect width="900" height="760" fill="#faf8f2"/><rect width="900" height="120" fill="#0b2d52"/><text x="40" y="58" fill="white" font-family="sans-serif" font-size="28">SRM / CAMPUS VISIT</text><text x="40" y="91" fill="#f7d987" font-family="sans-serif" font-size="15">DEMONSTRATION PASS · NOT AN OFFICIAL ENTRY PERMIT</text><text x="40" y="158" fill="#123f78" font-family="monospace" font-size="14">${escape(b.id)}</text>${lines.map((line, i) => `<text x="40" y="${210 + i * 37}" fill="#0b2d52" font-family="sans-serif" font-size="${i === 0 ? 25 : 17}" ${line.length > (i === 0 ? 35 : 58) ? 'textLength="530" lengthAdjust="spacingAndGlyphs"' : ""}>${escape(line)}</text>`).join("")}<g transform="translate(625 180)">${qr}</g><text x="640" y="435" fill="#123f78" font-family="sans-serif" font-size="15">Scan to verify live status</text><path d="M40 580H860" stroke="#c9d3de"/><text x="40" y="620" fill="#536170" font-family="sans-serif" font-size="16">Temporary demo reservation. Valid only while the demo server retains this booking.</text><text x="40" y="652" fill="#536170" font-family="sans-serif" font-size="16">Schedules, staffing, venues and visitor policies require university confirmation.</text><text x="40" y="700" fill="#123f78" font-family="sans-serif" font-size="16">Your future begins with a visit.</text></svg>`;
    return new Response(svg, { headers: { ...headers, "Content-Type": "image/svg+xml", "Content-Disposition": 'attachment; filename="srm-visit-pass.svg"' } });
  } catch (e) { return Response.json({ error: e instanceof VisitError ? e.message : "Unable to generate pass." }, { status: e instanceof VisitError ? e.status : 500, headers }); }
}
