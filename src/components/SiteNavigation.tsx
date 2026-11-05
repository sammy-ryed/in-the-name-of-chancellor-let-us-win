"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeLogo } from "./HomeLogo";
import { navigation, services, srm, tourUrl } from "@/lib/navigation";

// Preserve each page’s existing “Scroll for more” destination.
const scrollTargets: Record<string, string> = {
  "/": "#explore",
  "/students": "#explore",
  "/programmes": "#pf-results-title",
  "/campus": "#life",
  "/campus/accommodation": "#booking",
  "/alumni": "#spots",
};

export function SiteNavigation() {
  const pathname = usePathname();
  return <NavigationMenu key={pathname} pathname={pathname} />;
}

function NavigationMenu({ pathname }: { pathname: string }) {
  const scrollHref = scrollTargets[pathname] ?? "#guide-content";
  const panel = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  // Which top-level item has its sub-pages showing, and whether the panel has widened.
  // Once wide it stays wide while the menu is open, so hovering between items doesn't jump.
  const [section, setSection] = useState<string | null>(null);
  const [wide, setWide] = useState(false);
  const hoverTimer = useRef<number | undefined>(undefined);
  const close = () => panel.current?.close();
  const canHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const show = (label: string | null) => {
    setSection(label);
    if (label) setWide(true);
  };
  // Hover opens an item after a short pause, so a pointer passing over doesn't flicker it.
  const hoverIn = (label: string | null) => {
    if (!canHover()) return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => show(label), 90);
  };
  const hoverOut = () => window.clearTimeout(hoverTimer.current);
  useEffect(() => {
    if (!open) return;
    const before = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = before;
    };
  }, [open]);
  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);
  return (
    <>
      <aside className="s-rail" aria-label="Site controls">
        <HomeLogo />
        <button
          ref={trigger}
          aria-label="Open menu"
          aria-controls="srm-menu"
          aria-expanded={open}
          onClick={() => {
            panel.current?.showModal();
            setOpen(true);
          }}
        >
          <i />
          <i />
          <i />
        </button>
        <a className="s-rail-caption" href={scrollHref}>
          Scroll for more
        </a>
        <span className="s-progress" aria-hidden="true" />
      </aside>
      <dialog
        id="srm-menu"
        ref={panel}
        aria-label="Main navigation"
        className="s-menu"
        onClose={() => {
          setOpen(false);
          window.clearTimeout(hoverTimer.current);
          setSection(null);
          setWide(false);
          trigger.current?.focus({ preventScroll: true });
        }}
        onClick={(e) => {
          if (e.target === panel.current) close();
        }}
      >
        <div className="s-menu-rail">
          <button aria-label="Close menu" onClick={close}>
            ×
          </button>
        </div>
        <div className="s-menu-sheet" data-expanded={wide ? "" : undefined}>
          <nav className="s-menu-nav" aria-label="Main destinations">
            <ul className="s-menu-main">
              {navigation.map((item) => {
                const id = "sub-" + item.href.slice(1);
                const isOpen = section === item.label;
                return (
                  <li
                    key={item.href}
                    data-open={isOpen ? "" : undefined}
                    onMouseEnter={() => hoverIn(item.children ? item.label : null)}
                    onMouseLeave={hoverOut}
                  >
                    {/* The title always opens its page. Hover (or keyboard focus) reveals the
                        sub-pages; on touch screens the first tap reveals them, the second opens the page. */}
                    <Link
                      className="s-menu-item"
                      href={item.href}
                      aria-current={item.href === pathname ? "page" : undefined}
                      onFocus={(e) => item.children && e.currentTarget.matches(":focus-visible") && show(item.label)}
                      onClick={(e) => {
                        if (item.children && !isOpen && !canHover()) {
                          e.preventDefault();
                          show(item.label);
                          return;
                        }
                        close();
                      }}
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <div className="s-menu-sub" id={id} inert={!isOpen}>
                        <div>
                          <p className="s-menu-sub-title">{item.label}</p>
                          <ul>
                            {item.children.map((child) => (
                              <li key={child.href}>
                                <Link href={child.href} aria-current={child.href === pathname ? "page" : undefined} onClick={close}>
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="s-menu-foot">
            <button type="button" className="s-menu-close" onClick={close}>
              Close <span aria-hidden="true">×</span>
            </button>
            <nav className="s-menu-quick" aria-label="Quick links">
              <span aria-hidden="true">Quick links ›</span>
              <a href={tourUrl}>Virtual tour ↗</a>
              {services.map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  aria-current={a.href === pathname ? "page" : undefined}
                  onClick={close}
                >
                  {a.label}
                </Link>
              ))}
              <a href={srm + "/contact-us/"}>Contact SRM ↗</a>
            </nav>
          </div>
        </div>
      </dialog>
    </>
  );
}
