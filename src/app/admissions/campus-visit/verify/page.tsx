import Link from "next/link";
import { connection } from "next/server";
import { SiteFooter } from "@/components/SiteFooter";
import { prettyDate, prettyTime, visitConfig } from "@/features/campus-visit/config";
import { verifiedPass } from "@/features/campus-visit/service";
import "../visit.css";

export const metadata = { title: "Verify a campus visit pass", robots: { index: false, follow: false } };
export default async function Verify({ searchParams }: { searchParams: Promise<{ pass?: string }> }) {
  await connection();
  const { pass } = await searchParams;
  let result;
  try { result = verifiedPass(pass ?? ""); } catch { /* Unknown and expired tokens reveal no personal details. */ }
  const upcoming = result && new Date(`${result.slot.date}T${result.slot.start}:00+05:30`) > new Date();
  return <><div className="cv-page"><section className="cv-section cv-verification"><p className="cv-eyebrow">SRM / Pass verification</p><h1>{!result ? "Pass unavailable" : result.status === "cancelled" ? "Visit cancelled" : !upcoming ? "Visit has started" : "Pass verified"}</h1><p className="cv-demo">Demonstration only. This is not an official university entry permit.</p>{result ? <dl className="cv-summary"><div><dt>Booking ID</dt><dd>{result.id}</dd></div><div><dt>Campus</dt><dd>{visitConfig.campuses.find(c => c.id === result.slot.campusId)?.name}</dd></div><div><dt>Visit</dt><dd>{prettyDate(result.slot.date)}<br/>{prettyTime(result.slot.start)} – {prettyTime(result.slot.end)} IST</dd></div><div><dt>Venue / visitors</dt><dd>{result.slot.venue} / {result.visitors}</dd></div><div><dt>Status</dt><dd>{result.status}{!upcoming && result.status === "confirmed" ? " · Tour has started; not valid for new entry" : ""}</dd></div></dl> : <p>This temporary demo may have restarted, or the pass has expired. Return to the booking page to check availability.</p>}<Link className="cv-button" href="/admissions/campus-visit">Campus visits →</Link></section></div><SiteFooter/></>;
}
