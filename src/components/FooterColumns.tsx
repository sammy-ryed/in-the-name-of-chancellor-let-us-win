"use client";
import Link from "next/link";
import { useState } from "react";

export type FooterLink = { label: string; href: string };
export type FooterGroup = { title: string; links: FooterLink[] };

const isInternal = (href: string) => href.startsWith("/") || href.startsWith("#");

/**
 * The four link columns. On desktop and tablet every list is always visible and the
 * headings are plain text; on phones each heading becomes an accordion toggle.
 */
export function FooterColumns({ groups }: { groups: FooterGroup[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <nav className="ft-cols" aria-label="Footer">
      {groups.map((g, i) => {
        const id = `ft-list-${i}`;
        const expanded = open === i;
        return (
          <section key={g.title} className="ft-col" data-open={expanded || undefined}>
            <h2 className="ft-col-title">
              <span className="ft-col-static">{g.title}</span>
              <button
                type="button"
                className="ft-col-toggle"
                aria-expanded={expanded}
                aria-controls={id}
                onClick={() => setOpen(expanded ? null : i)}
              >
                {g.title}
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 9.5l6 6 6-6" />
                </svg>
              </button>
            </h2>
            <div className="ft-list-wrap" id={id}>
              <ul className="ft-list">
                {g.links.map((l) => (
                  <li key={l.label}>
                    {isInternal(l.href) ? <Link href={l.href}>{l.label}</Link> : <a href={l.href}>{l.label}</a>}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}
    </nav>
  );
}

/** Opens the site's accessibility settings dialog. */
export function AccessibilityButton() {
  return (
    <button type="button" className="ft-util-link" popoverTarget="access-settings" popoverTargetAction="show" aria-haspopup="dialog">
      Accessibility
    </button>
  );
}
