"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ComponentProps } from "react";
import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import Accessibility from "./Accessibility";
import { HomeLogo } from "./HomeLogo";
import { navigation, services, tourUrl, type NavItem } from "@/lib/navigation";

const touchMenuQuery = "(max-width: 760px), (hover: none) and (pointer: coarse)";

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
      prefetch={false}
      onNavigate={() => {
        if (new URL(href, location.href).pathname === location.pathname) close();
      }}
    >
      <MenuLabel>{children}</MenuLabel>
    </Link>
  );
}

type MenuProps = { pathname: string; currentSection?: NavItem; close: () => void };

function QuickLinks({ pathname, close }: Pick<MenuProps, "pathname" | "close">) {
  return (
    <nav className="s-menu-quick" aria-label="Quick links">
      <span aria-hidden="true">Quick links ›</span>
      <a href={tourUrl}>Virtual tour ↗</a>
      {services.map(link => (
        <MenuLink key={link.href} href={link.href} close={close} aria-current={link.href === pathname ? "page" : undefined}>
          {link.label}
        </MenuLink>
      ))}
    </nav>
  );
}

function currentState(item: NavItem, pathname: string, section?: NavItem) {
  if (item.href === pathname) return "page" as const;
  if (item === section) return "location" as const;
}

function PhoneMenu({ pathname, currentSection, close }: MenuProps) {
  const [section, setSection] = useState<NavItem | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const sectionTrigger = useRef<string | null>(null);

  useLayoutEffect(() => {
    if (section) heading.current?.focus({ preventScroll: true });
    else if (sectionTrigger.current) document.getElementById(sectionTrigger.current)?.focus({ preventScroll: true });
  }, [section]);

  return (
    <div className="s-phone-sheet">
      <header className="s-phone-head">
        {section ? <button className="s-phone-back" type="button" onClick={() => setSection(null)}>
          <span aria-hidden="true">←</span> All pages
        </button> : <h2>Site menu</h2>}
        <button type="button" className="s-phone-close" onClick={close} aria-label="Close menu">×</button>
      </header>
      {section ? (
        <nav key={section.href} className="s-phone-pages" aria-label={section.label + " pages"}>
          <h2 ref={heading} tabIndex={-1}>{section.label}</h2>
          <ul>
            {[section, ...(section.children ?? [])].map((link, index) => (
              <li key={link.href}>
                <MenuLink href={link.href} close={close} aria-current={link.href === pathname ? "page" : undefined}>
                  {index === 0 ? section.label + " overview" : link.label}
                  <span className="s-phone-link-arrow" aria-hidden="true">{link.href.startsWith("/") ? "→" : "↗"}</span>
                </MenuLink>
              </li>
            ))}
          </ul>
        </nav>
      ) : (
        <nav className="s-phone-index" aria-label="Main destinations">
          <ul>
            {navigation.map(item => {
              const triggerId = "more" + item.href.replaceAll("/", "-");
              return <li key={item.href}>
                <MenuLink href={item.href} close={close} aria-current={currentState(item, pathname, currentSection)}>{item.label}</MenuLink>
                {item.children && <button id={triggerId} type="button" aria-label={`More ${item.label} pages`} onClick={() => {
                  sectionTrigger.current = triggerId;
                  setSection(item);
                }}><span>More</span><span aria-hidden="true">›</span></button>}
              </li>;
            })}
          </ul>
        </nav>
      )}
      <footer className="s-phone-foot"><QuickLinks pathname={pathname} close={close} /></footer>
    </div>
  );
}

function DesktopMenu({ pathname, currentSection, close }: MenuProps) {
  const nested = currentSection?.children?.some(link => link.href === pathname) ? currentSection.label : null;
  const [section, setSection] = useState<string | null>(nested);
  const [wide, setWide] = useState(Boolean(nested));
  const hoverTimer = useRef<number | undefined>(undefined);
  const show = (label: string | null) => {
    setSection(label);
    if (label) setWide(true);
  };
  const hoverOut = () => window.clearTimeout(hoverTimer.current);
  const hoverIn = (label: string | null) => {
    hoverOut();
    hoverTimer.current = window.setTimeout(() => show(label), wide ? 65 : 30);
  };
  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  return (
    <>
      <div className="s-menu-rail"><button type="button" aria-label="Close menu" onClick={close}>×</button></div>
      <div className="s-menu-sheet" data-expanded={wide ? "" : undefined}>
        <nav className="s-menu-nav" aria-label="Main destinations">
          <ul className="s-menu-main">
            {navigation.map(item => {
              const isOpen = section === item.label;
              return (
                <li key={item.href} data-open={isOpen ? "" : undefined}
                  onMouseEnter={() => hoverIn(item.children ? item.label : null)} onMouseLeave={hoverOut}>
                  <MenuLink close={close} className="s-menu-item" href={item.href}
                    aria-current={currentState(item, pathname, currentSection)}
                    onFocus={event => {
                      if (event.currentTarget.matches(":focus-visible")) show(item.children ? item.label : null);
                    }}>
                    {item.label}
                  </MenuLink>
                  {item.children && (
                    <div className="s-menu-sub" inert={!isOpen}>
                      <ul aria-label={item.label}>
                        {item.children.map(link => <li key={link.href}>
                          <MenuLink close={close} href={link.href} aria-current={item === currentSection && link.href === pathname ? "page" : undefined}>
                            {link.label}
                          </MenuLink>
                        </li>)}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="s-menu-foot">
          <button type="button" className="s-menu-close" onClick={close}>Close <span aria-hidden="true">×</span></button>
          <QuickLinks pathname={pathname} close={close} />
        </div>
      </div>
    </>
  );
}

export function SiteNavigation() {
  const pathname = usePathname();
  const currentSection = navigation.find(item => item.href === pathname || pathname.startsWith(item.href + "/"));
  const currentPage = currentSection?.href === pathname ? currentSection
    : currentSection?.children?.find(link => link.href === pathname) ?? services.find(link => link.href === pathname);
  const currentLabel = currentPage?.label ?? currentSection?.label;
  const panel = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [touchMenu, setTouchMenu] = useState(false);
  const close = () => panel.current?.close();

  useLayoutEffect(() => {
    if (open && !panel.current?.open) panel.current?.showModal();
  }, [open]);
  useLayoutEffect(() => {
    if (panel.current?.open) panel.current.close();
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const media = window.matchMedia(touchMenuQuery);
    const update = () => setTouchMenu(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [open]);

  return (
    <>
      <aside className="s-rail" aria-label="Site controls" ref={rail => {
        if (rail) rail.dataset.menuReady = "";
      }}>
        <HomeLogo crest />
        <button type="button" className="rail-menu-toggle" aria-label="Open menu"
          aria-describedby={currentLabel ? "srm-current-location" : undefined}
          aria-controls="srm-menu" aria-expanded={open} onClick={() => {
            setTouchMenu(window.matchMedia(touchMenuQuery).matches);
            setOpen(true);
          }}>
          <i /><i /><i />
        </button>
        {/* Native links are available before hydration and when scripts are disabled.
            If someone already opened this menu, let them finish using it. */}
        <details className="s-menu-fallback" suppressHydrationWarning>
          <summary aria-label="Menu"><i /><i /><i /></summary>
          <nav aria-label="Site navigation">
            {[...navigation, ...services].map(link => <a key={link.href} href={link.href}
              aria-current={link.href === pathname ? "page" : undefined}>{link.label}</a>)}
          </nav>
        </details>
        {currentLabel && <span id="srm-current-location" className="s-rail-location" title={currentLabel}>{currentLabel}</span>}
        <Accessibility />
        <span className="s-progress" aria-hidden="true" />
      </aside>
      <dialog id="srm-menu" ref={panel} aria-label="Main navigation" className="s-menu"
        onClose={() => { if (!panel.current?.open) setOpen(false); }}
        onClick={event => { if (event.target === panel.current) close(); }}>
        {open && (touchMenu
          ? <PhoneMenu pathname={pathname} currentSection={currentSection} close={close} />
          : <DesktopMenu pathname={pathname} currentSection={currentSection} close={close} />)}
      </dialog>
    </>
  );
}
