import type { ReactNode } from "react";

export function Disclosure({
  summary,
  open,
  children,
}: {
  summary: string;
  open?: boolean;
  children: ReactNode;
}) {
  return (
    <details open={open}>
      <summary>{summary}</summary>
      {children}
    </details>
  );
}
