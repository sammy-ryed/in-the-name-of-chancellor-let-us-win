"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { routes } from "@/lib/navigation";

/** Keep the comparison that led to this course, including any empty lettered slots. */
export function CompareCourseLink({ courseId, className }: { courseId: string; className: string }) {
  const params = useSearchParams();
  const slots = (params.get("compare") ?? "").split(",").slice(0, 3);
  const existing = slots.some(Boolean);
  const hasCourse = slots.includes(courseId);
  const free = slots.indexOf("");
  const canAdd = free !== -1 || slots.length < 3;
  if (!hasCourse && canAdd) {
    if (free !== -1) slots[free] = courseId;
    else slots.push(courseId);
  }
  const label = existing && (hasCourse || !canAdd) ? "Back to your comparison" : "Compare this fee";
  return (
    <Link className={className} href={{ pathname: routes.fees.href, query: { compare: slots.join(",") } }}>
      {label} <span aria-hidden="true">→</span>
    </Link>
  );
}
