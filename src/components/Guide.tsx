import Link from "next/link";
import Image from "next/image";
import { SiteFooter } from "./SiteFooter";
import { Breadcrumbs } from "./Breadcrumbs";
import { GuideContents } from "./GuideContents";
import "./guide.css";
const homeCrumb = { href: "/", label: "Home" };

export function Action({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link className="guide-action yellow-action" href={href}>
      {children}
      <span aria-hidden="true">↗</span>
    </Link>
  );
}
export function Resources({
  items,
}: {
  items: { title: string; note: string; href: string }[];
}) {
  return (
    <div className="resources">
      {items.map((a) => (
        <Link href={a.href} key={a.href}>
          <strong>{a.title}</strong>
          <span>{a.note}</span>
          <b aria-hidden="true">↗</b>
        </Link>
      ))}
    </div>
  );
}
export function Guide({
  title,
  intro,
  image,
  section,
  children,
  links = [],
}: {
  title: string;
  intro: string;
  image: string;
  section?: string;
  children: React.ReactNode;
  links?: [string, string][];
}) {
  const destination = section ?? title;
  const detail = section === "Programmes" && title !== section;
  const firstLink = links[0];
  const entry =
    firstLink?.[0] ??
    {
      Events: "Campus calendar",
      News: "Read the news",
      Parents: "Parent services",
    }[destination] ??
    "Programme details";
  return (
    <>
    <div className="guide-shell">
      <div className="guide">
        <header className="guide-cover s-lines" data-detail={detail || undefined}>
          <div className="guide-cover-copy">
            <Breadcrumbs
              className="guide-crumbs"
              parents={detail ? [homeCrumb, { href: "/programmes", label: "Programmes" }] : [homeCrumb]}
              current={detail ? "Programme details" : title}
            />
            <h1>{title}</h1>
            <p className="guide-intro">{intro}</p>
            <a className="guide-entry yellow-action" href={"#" + (firstLink?.[1] ?? "guide-content")}>
              {entry} <span aria-hidden="true">↓</span>
            </a>
          </div>
          {!detail && (
            <div className="guide-cover-image">
              <Image src={"/home/" + image + ".webp"} alt="" fill
                sizes="(max-width: 700px) 100vw, 51vw" loading="eager" unoptimized />
            </div>
          )}
        </header>
        <div id="guide-content" tabIndex={-1} data-index={links.length > 1 || undefined}>
          {links.length > 1 && <GuideContents links={links} />}
          <div className="guide-body">{children}</div>
        </div>
      </div>
    </div>
    <SiteFooter />
    </>
  );
}
export function Section({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="guide-section" id={id}>
      <h2>
        <span>{title}</span>
      </h2>
      {children}
    </section>
  );
}
