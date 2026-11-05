import { Icon } from "./controls";
import type { Programme } from "./types";

export interface RowLabels {
  level: Map<string, string>;
  type: Map<string, string>;
  campus: Map<string, string>;
  department: Map<string, string>;
  campusesOf: Map<number, string[]>;
}

/** "Department of Computing Technologies" → "Computing Technologies" for the compact meta line. */
const shortDept = (s: string) => s.replace(/^Department of\s+/i, "").replace(/\s+\(.*\)$/, "");
/** "Kattankulathur - Chennai" → "Kattankulathur". */
const shortCampus = (s: string) => s.split(/\s+-\s+|,/)[0].trim();

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

export function ProgrammeRow({ programme: p, labels, query }: { programme: Programme; labels: RowLabels; query: string }) {
  const level = p.level.map((l) => labels.level.get(l)).filter(Boolean).join(" · ");
  const type = p.type.length === 1 ? labels.type.get(p.type[0]) : undefined;
  const campus = (labels.campusesOf.get(p.id) ?? []).map((c) => shortCampus(labels.campus.get(c) ?? "")).filter(Boolean);
  const depts = p.department.map((d) => labels.department.get(d)).filter(Boolean) as string[];
  const dept = depts.length ? shortDept(depts[0]) + (depts.length > 1 ? ` +${depts.length - 1}` : "") : undefined;
  return (
    <li className="pf-row">
      <a href={p.url}>
        <span className="pf-row-kicker">
          {level}
          {type && <span> · {type}</span>}
        </span>
        <span className="pf-row-name">
          <Highlight text={p.subject} query={query} />
        </span>
        <dl className="pf-row-meta">
          <div>
            <dt>Degree</dt>
            <dd>{p.certification}</dd>
          </div>
          {p.duration && (
            <div>
              <dt>Duration</dt>
              <dd>{p.duration}</dd>
            </div>
          )}
          {campus.length > 0 && (
            <div>
              <dt>Campus</dt>
              <dd>{campus.join(", ")}</dd>
            </div>
          )}
          {dept && (
            <div>
              <dt>Department</dt>
              <dd>{dept}</dd>
            </div>
          )}
        </dl>
        <span className="pf-row-go" aria-hidden="true">
          <Icon name="arrow" />
        </span>
        <span className="pf-sr"> — opens the official programme page</span>
      </a>
    </li>
  );
}
