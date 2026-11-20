import Image from "next/image";
import Link from "next/link";
import type { Shortlist } from "@/features/explore/shortlist";
import { Icon } from "./controls";
import type { Programme } from "./types";

export interface RowLabels {
  department: Map<string, string>;
  college: Map<string, string>;
  campus: Map<string, string>;
  campusesOf: Map<number, string[]>;
}

export function ProgrammeRow({ programme: p, labels, slots, onChoose, onOpen, applications, lead }: {
  programme: Programme;
  labels: RowLabels;
  slots: Shortlist;
  onChoose: (programme: Programme) => void;
  onOpen: (focusId: string) => void;
  applications?: number;
  lead?: boolean;
}) {
  const detailHref = p.feeCourseId ? `/programmes/${p.feeCourseId}` : p.url;
  const ids = p.feeCourseId ? [p.feeCourseId] : p.compareCandidates ?? [];
  const picked = slots.flatMap((id, i) => ids.includes(id) ? [String.fromCharCode(65 + i)] : []);
  const action = picked.length ? "Added · " + picked.join(", ") : "Add to compare";
  const namedSchools = p.department.map(id => labels.department.get(id)).filter(name => name && /\b(school|college|institute) of\b/i.test(name));
  const school = namedSchools.join(" / ") || p.college.map((id) => labels.college.get(id)).filter(Boolean).join(" / ");
  const campus = (labels.campusesOf.get(p.id) ?? []).map((id) => labels.campus.get(id)?.split(" - ")[0]).filter(Boolean).join(" / ");
  const [subject, specialisation] = p.subject.split(/ with speciali[sz]ation in /i);
  return (
    <li className="pf-card" data-lead={lead || undefined}>
      <div className="pf-photo">
        <Image src={p.photo || "/home/campus.webp"} alt="" fill loading={lead ? "eager" : "lazy"}
          sizes="(max-width: 600px) 65px, (max-width: 960px) 110px, 220px" />
      </div>
      <div className="pf-card-content">
        <div className="pf-card-heading">
          <p className="pf-qualification">{p.certification}{applications !== undefined
            ? <span className="pf-applications"><strong>{applications.toLocaleString("en-IN")}</strong> applications</span>
            : campus && <span>{campus}</span>}</p>
          <h3><Link href={detailHref} prefetch={false} id={`pf-title-${p.id}`} onNavigate={() => onOpen(`pf-title-${p.id}`)}>{subject}{specialisation && <span className="pf-specialisation"><span className="pf-sr"> with specialisation in </span>{specialisation}</span>}</Link></h3>
        </div>
        <div className="pf-card-actions">
          <Link className="pf-course-link" href={detailHref} prefetch={false} id={`pf-detail-${p.id}`}
            onNavigate={() => onOpen(`pf-detail-${p.id}`)} aria-label={`Programme details for ${p.name}`}>View course <Icon name="arrow" /></Link>
          <button type="button" className="pf-add-course" id={`pf-choose-${p.id}`} data-added={picked.length > 0 || undefined}
            aria-pressed={p.feeCourseId ? picked.length > 0 : undefined} aria-haspopup={p.feeCourseId ? undefined : "dialog"}
            aria-label={`${picked.length && p.feeCourseId ? "Remove from comparison" : action}, ${p.name}`} onClick={() => onChoose(p)}>
            <span aria-hidden="true">{picked.length ? "✓" : "+"}</span>{action}
          </button>
        </div>
        <details className="pf-course-facts">
          <summary>Fees and course information</summary>
          <dl className="pf-facts">
            <div className="pf-school"><dt>School / faculty</dt><dd>{school}</dd></div>
            <div><dt>Duration</dt><dd>{p.duration || <a href={p.url}>Check duration</a>}</dd></div>
            <div>
              <dt>{p.feePeriod || "Tuition fees"}</dt>
              <dd>{p.fee || <a href={p.feeUrl || p.url}>Fee schedule</a>}</dd>
              {p.feeConflict && <dd>{p.feeConflict}</dd>}
            </div>
          </dl>
          {p.feeCourseId && <a className="pf-official" href={p.url}>Official programme page <Icon name="arrow" /></a>}
          <a className="pf-apply" href={p.applyUrl} aria-label={`Apply now for ${p.name}`}>Apply now <Icon name="arrow" /></a>
        </details>
      </div>
    </li>
  );
}
