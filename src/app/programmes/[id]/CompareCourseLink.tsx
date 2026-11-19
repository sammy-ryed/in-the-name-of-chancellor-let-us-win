"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { artsSubject } from "@/features/admissions/course-finder/arts-examples";
import { addToShortlist, comparisonHref, parseShortlist, shortlistScope, writeShortlist } from "@/features/explore/shortlist";
import { useShortlist } from "@/features/explore/useShortlist";

export function CompareCourseLink({ courseId, className }: { courseId: string; className: string }) {
  const params = useSearchParams();
  const scope = shortlistScope(params.get("from"));
  const saved = useShortlist(scope);
  const shared = params.get("compare");
  const slots = shared === null ? saved : parseShortlist(shared);
  const selected = slots.includes(courseId);
  const full = !selected && slots.every(Boolean);
  const next = addToShortlist(slots, courseId);
  const family = scope === "finder" ? params.get("family") : null;
  const subject = scope === "finder" && (!family || family === "arts-sciences") ? artsSubject(params.get("subject")) : undefined;
  const href = comparisonHref(next, scope)
    + (family ? "&family=" + encodeURIComponent(family) : "")
    + (subject ? "&subject=" + subject : "")
    + (params.get("view") === "table" ? "&view=table" : "");
  return <>
    <Link className={className} href={href} onNavigate={() => writeShortlist(next, scope)}>
      {selected ? "View your comparison" : full ? "Manage your three picks" : "Compare this course"} <span aria-hidden="true">→</span>
    </Link>
    {full && <p>Remove a course from your shortlist to make room for this one.</p>}
  </>;
}
