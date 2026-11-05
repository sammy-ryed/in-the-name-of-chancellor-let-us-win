"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link, { useLinkStatus } from "next/link";
import type { ComponentProps } from "react";
import { usePathname } from "next/navigation";
import Accessibility from "./Accessibility";
import { HomeLogo } from "./HomeLogo";
import { navigation, services, srm, tourUrl } from "@/lib/navigation";

function MenuLabel({ children }: { children: React.ReactNode }) {
  const { pending } = useLinkStatus();
  return <span className="s-menu-label" aria-busy={pending}>{children}</span>;
}

type MenuLinkProps = Omit<ComponentProps<typeof Link>, "href" | "onNavigate"> & {
  href: string;
  close: () => void;
};

function MenuLink({ href, close, children, ...props }: MenuLinkProps) {
  return (
    <Link
      {...props}
      href={href}
      onNavigate={() => {
        // Hash and query links can stay on this pathname. Other links keep the
        // menu visible until the next page is ready underneath it.
        if (new URL(href, location.href).pathname === location.pathname) close();
      }}
    >
      <MenuLabel>{children}</MenuLabel>
    </Link>
  );
}

export function SiteNavigation() {
  const pathname = usePathname();
  const panel = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  // Which top-level item has its sub-pages showing, and whether the panel has widened.
  // Once wide it stays wide while the menu is open, so hovering between items doesn't jump.
  const [section, setSection] = useState<string | null>(null);
  const [wide, setWide] = useState(false);
  const hoverTimer = useRef<number | undefined>(undefined);
  const close = () => panel.current?.close();
  useLayoutEffect(() => {
    if (panel.current?.open) panel.current.close();
  }, [pathname]);
  const canHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const show = (label: string | null) => {
    setSection(label);
    if (label) setWide(true);
  };
  // Hover opens an item after a short pause, so a pointer passing over doesn't flicker it.
  const hoverIn = (label: string | null) => {
    if (!canHover()) return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => show(label), wide ? 65 : 30);
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
        <HomeLogo crest />
        <button
          className="rail-menu-toggle"
          aria-label="Open menu"
          aria-controls="srm-menu"
          aria-expanded={open}
          onClick={() => {
            setSection(null);
            setWide(false);
            panel.current?.showModal();
            setOpen(true);
          }}
        >
          <i />
          <i />
          <i />
        </button>
        <Accessibility />
        <span className="s-progress" aria-hidden="true" />
      </aside>
      <dialog
        id="srm-menu"
        ref={panel}
        aria-label="Main navigation"
        className="s-menu"
        onClose={() => {
          if (panel.current?.open) return;
          setOpen(false);
          window.clearTimeout(hoverTimer.current);
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
                    <MenuLink
                      close={close}
                      className="s-menu-item"
                      href={item.href}
                      aria-current={item.href === pathname ? "page" : undefined}
                      onFocus={(e) => item.children && e.currentTarget.matches(":focus-visible") && show(item.label)}
                      onClick={(e) => {
                        if (item.children && !isOpen && !canHover() && e.detail > 0 &&
                            !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                          e.preventDefault();
                          show(item.label);
                        }
                      }}
                    >
                      {item.label}
                    </MenuLink>
                    {item.children && (
                      <div className="s-menu-sub" id={id} inert={!isOpen}>
                        <div>
                          <ul aria-label={item.label}>
                            {item.children.map((child) => (
                              <li key={child.href}>
                                <MenuLink close={close} href={child.href} aria-current={child.href === pathname ? "page" : undefined}>
                                  {child.label}
                                </MenuLink>
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
                <MenuLink
                  close={close}
                  key={a.href}
                  href={a.href}
                  aria-current={a.href === pathname ? "page" : undefined}
                >
                  {a.label}
                </MenuLink>
              ))}
              <a href={srm + "/contact-us/"}>Contact SRM ↗</a>
            </nav>
          </div>
        </div>
      </dialog>
    </>
  );
}
