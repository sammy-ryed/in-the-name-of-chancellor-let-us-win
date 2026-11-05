import Link from "next/link";
import Image from "next/image";
import { navigation, services } from "@/lib/navigation";
import { Rail } from "@/features/home/Rail";
import "./guide.css";
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
  const index =
    [...navigation, ...services].findIndex(
      (item) => item.label === destination,
    ) + 1;
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
    <div className="guide-shell s-chrome">
      <Rail current={destination} scrollHref="#guide-content" />
      <div className="guide">
        <header
          className="guide-hero s-lines"
          data-detail={detail || undefined}
        >
          <div className="guide-photo" aria-hidden="true">
            <Image
              fill
              sizes="(max-width: 760px) 100vw, 50vw"
              src={"/home/" + image + ".webp"}
              alt=""
              unoptimized
            />
          </div>
          <div className="guide-hero-copy">
            <div className="guide-kicker">
              <Link href="/">SRMIST</Link>
              <span aria-hidden="true">/</span>
              {detail ? (
                <Link href="/programmes">Programmes</Link>
              ) : (
                <span>University guide</span>
              )}
            </div>
            <h1>{title}</h1>
            <p>{intro}</p>
            <a
              className="guide-entry yellow-action"
              href={"#" + (firstLink?.[1] ?? "guide-content")}
            >
              {entry}
              <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="guide-folio" aria-hidden="true">
            <span>{String(index).padStart(2, "0")}</span> / 08
          </div>
        </header>
        <div id="guide-content" tabIndex={-1}>
          {links.length > 0 && (
            <nav className="guide-jump" aria-label="On this page">
              {links.map(([label, id]) => (
                <a href={"#" + id} key={id}>
                  {label} ↓
                </a>
              ))}
            </nav>
          )}
          <div className="guide-body">{children}</div>
        </div>
        <footer className="guide-footer">
          <Link href="/">SRMIST / Home</Link>
          <nav aria-label="More services">
            {services.map((a) => (
              <Link key={a.href} href={a.href}>
                {a.label}
              </Link>
            ))}
          </nav>
        </footer>
      </div>
    </div>
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
