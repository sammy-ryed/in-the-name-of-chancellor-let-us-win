"use client";

import { useEffect, useRef, useState } from "react";
import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { HomeLogo } from "./HomeLogo";
import { navigation, services, srm, tourUrl, type NavLink } from "@/lib/navigation";

const moreLinks = [
  ...services,
  { href: tourUrl, label: "Virtual tour" },
  { href: srm + "/contact-us/", label: "Contact SRM" },
];

const groups = [...navigation, { label: "More", href: "", children: moreLinks }];
const menuId = (href: string) => "nav-" + (href.slice(1) || "more");
const hoverEnabled = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

function LinkLabel({ label }: { label: string }) {
  const { pending } = useLinkStatus();
  return <span aria-busy={pending}>{label}</span>;
}

function Destination({ link, close, current }: { link: NavLink; close: () => void; current: string }) {
  return (
    <Link href={link.href} aria-current={link.href === current ? "page" : undefined}
      onNavigate={() => { if (new URL(link.href, location.href).pathname === current) close(); }}>
      <LinkLabel label={link.label} />
    </Link>
  );
}

export function SiteNavigation() {
  const pathname = usePathname();
  const nav = useRef<HTMLElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const [menu, setMenu] = useState<{ label: string; path: string } | null>(null);
  if (menu && menu.path !== pathname) setMenu(null);

  function close() {
    window.clearTimeout(timer.current);
    setMenu(null);
  }
  function hover(label: string | null, delay: number) {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMenu(label ? { label, path: pathname } : null), delay);
  }
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (!nav.current?.contains(event.target as Node)) close();
    };
    document.addEventListener("pointerdown", outside);
    return () => {
      window.clearTimeout(timer.current);
      document.removeEventListener("pointerdown", outside);
    };
  }, []);

  return (
    <nav className="site-nav" aria-label="Main navigation" ref={nav}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) close(); }}
      onPointerLeave={(event) => { if (event.pointerType === "mouse" && hoverEnabled()) hover(null, 150); }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && menu) {
          nav.current?.querySelector<HTMLButtonElement>('button[aria-expanded="true"]')?.focus();
          close();
        }
      }}>
      <HomeLogo crest />
      <ul className="site-nav-list">
        {groups.map((item) => {
          const expanded = menu?.label === item.label;
          const id = menuId(item.href);
          return (
            <li key={id} className="site-nav-item"
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse" && hoverEnabled()) hover(item.children ? item.label : null, 45);
              }}>
              {item.href && <Destination link={item} current={pathname} close={close} />}
              {item.children && (
                <button className="site-nav-toggle" type="button" aria-expanded={expanded}
                  id={id + "-toggle"} aria-controls={id} aria-label={item.label + " links"}
                  onClick={(event) => {
                    window.clearTimeout(timer.current);
                    setMenu(expanded ? null : { label: item.label, path: pathname });
                    if (!expanded && event.detail === 0) {
                      requestAnimationFrame(() => document.getElementById(id)?.querySelector("a")?.focus());
                    }
                  }}>
                  {!item.href && item.label}<span aria-hidden="true" />
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {groups.map(({ href, label, children }) => children && (
        <ul key={label} id={menuId(href)} aria-labelledby={menuId(href) + "-toggle"}
          className="site-nav-dropdown" inert={menu?.label !== label} data-open={menu?.label === label || undefined}
          onPointerEnter={() => window.clearTimeout(timer.current)}>
          {children.map((link) => (
            <li key={link.href}><Destination link={link} current={pathname} close={close} /></li>
          ))}
        </ul>
      ))}
    </nav>
  );
}
