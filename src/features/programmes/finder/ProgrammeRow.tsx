import Image from "next/image";
import type { Shortlist } from "@/features/explore/shortlist";
import { Icon } from "./controls";
import type { Programme } from "./types";

export interface RowLabels {
  department: Map<string, string>;
  college: Map<string, string>;
  campus: Map<string, string>;
  campusesOf: Map<number, string[]>;
}

export function ProgrammeRow({ programme: p, labels, slots, onChoose }: {
  programme: Programme; labels: RowLabels; slots: Shortlist; onChoose: (programme: Programme) => void;
}) {
  const ids = p.feeCourseId ? [p.feeCourseId] : p.compareCandidates ?? [];
  const picked = slots.flatMap((id, i) => ids.includes(id) ? [String.fromCharCode(65 + i)] : []);
  const action = picked.length ? "Added · " + picked.join(", ") : "Add to compare";
  const namedSchools = p.department.map(id => labels.department.get(id)).filter(name => name && /\b(school|college|institute) of\b/i.test(name));
  const school = namedSchools.join(" / ") || p.college.map((id) => labels.college.get(id)).filter(Boolean).join(" / ");
  const campus = (labels.campusesOf.get(p.id) ?? []).map((id) => labels.campus.get(id)?.split(" - ")[0]).filter(Boolean).join(" / ");
  return (
    <li className="pf-card">
      <div className="pf-photo">
        <Image src={p.photo || "/home/campus.webp"} alt="" fill sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 920px) 92px, (max-width: 1460px) 10vw, 146px" />
      </div>
      <div className="pf-card-content">
        <div className="pf-qualification">{p.certification}{campus && <span>{campus}</span>}</div>
        <h3><a href={p.url}>{p.subject}</a></h3>
        <dl className="pf-facts">
          <div className="pf-school"><dt>School / faculty</dt><dd>{school}</dd></div>
          <div><dt>Duration</dt><dd>{p.duration || <a href={p.url}>Check duration</a>}</dd></div>
          <div>
            <dt>{p.feePeriod || "Tuition fees"}</dt>
            <dd>{p.fee || <a href={p.feeUrl || p.url}>Fee schedule</a>}</dd>
            {p.feeConflict && <dd>{p.feeConflict}</dd>}
          </div>
        </dl>
        <div className="pf-card-actions">
          <button type="button" className="pf-add-course" id={`pf-choose-${p.id}`} data-added={picked.length > 0 || undefined}
            aria-pressed={p.feeCourseId ? picked.length > 0 : undefined} aria-haspopup={p.feeCourseId ? undefined : "dialog"}
            aria-label={`${picked.length && p.feeCourseId ? "Remove from comparison" : action}, ${p.name}`} onClick={() => onChoose(p)}>
            <span aria-hidden="true">{picked.length ? "✓" : "+"}</span>{action}
          </button>
          <a href={p.url} aria-label={`Programme details for ${p.name}`}>View details</a>
          <a className="pf-apply" href={p.applyUrl} aria-label={`Apply now for ${p.name}`}>Apply now <Icon name="arrow" /></a>
        </div>
      </div>
    </li>
  );
}
