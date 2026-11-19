"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { addToShortlist, comparisonHref, parseShortlist, writeShortlist } from "@/features/explore/shortlist";
import { useShortlist } from "@/features/explore/useShortlist";

export function CompareCourseLink({ courseId, className }: { courseId: string; className: string }) {
  const params = useSearchParams();
  const saved = useShortlist();
  const shared = params.get("compare");
  const slots = shared === null ? saved : parseShortlist(shared);
  const selected = slots.includes(courseId);
  const full = !selected && slots.every(Boolean);
  const next = addToShortlist(slots, courseId);
  const href = comparisonHref(next) + (params.get("view") === "table" ? "&view=table" : "");
  return <>
    <Link className={className} href={href} onNavigate={() => writeShortlist(next)}>
      {selected ? "View your comparison" : full ? "Manage your three picks" : "Compare this course"} <span aria-hidden="true">→</span>
    </Link>
    {full && <p>Remove a course from your shortlist to make room for this one.</p>}
  </>;
}
