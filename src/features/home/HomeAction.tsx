import Link from "next/link";
import type { ReactNode } from "react";

export function HomeArrow() {
  return <span className="s-arrow" aria-hidden="true" />;
}

export function HomeAction({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className="yellow-action s-button" href={href}>
      {children} <HomeArrow />
    </Link>
  );
}
