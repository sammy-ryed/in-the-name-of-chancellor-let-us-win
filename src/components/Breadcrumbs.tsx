import { Fragment } from "react";
import Link from "next/link";
import type { NavLink } from "@/lib/navigation";

export function Breadcrumbs({ className, parents, current }: {
  className: string;
  parents: NavLink[];
  current: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      {parents.map(({ href, label }) => (
        <Fragment key={href}>
          <Link href={href}>{label}</Link>
          <span aria-hidden="true">/</span>
        </Fragment>
      ))}
      <span aria-current="page">{current}</span>
    </nav>
  );
}
