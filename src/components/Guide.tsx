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
  const detail = section === "Programmes" && title !== section;
  const editorial =
    !detail && ["Programmes", "Campus life", "Students"].includes(destination);
  const companion: Record<string, string> = {
    Programmes: "developer",
    "Campus life": "athletics",
    Students: "research",
    Admissions: "campus",
    Parents: "students",
    News: "racing",
    Events: "students",
    "Career Centre": "developer",
  };
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
        <header className="guide-mast">
          <Link href="/" aria-label="Explore SRM home">
            <Image
              width={135}
              height={46}
              src="/home/srm-white.svg"
              alt="SRM Institute of Science and Technology"
              unoptimized
            />
          </Link>
          <nav aria-label="University sections">
            {navigation.map((item) => (
              <Link
                href={item.href}
                key={item.href}
                aria-current={destination === item.label ? "page" : undefined}
              >
                {item.label} <span aria-hidden="true">›</span>
              </Link>
            ))}
          </nav>
        </header>
        <header
          className="guide-cover"
          data-editorial={editorial || undefined}
          data-detail={detail || undefined}
        >
          <nav className="guide-crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <i aria-hidden="true">/</i>
            {detail && (
              <>
                <Link href="/programmes">Programmes</Link>
                <i aria-hidden="true">/</i>
              </>
            )}
            <span aria-current="page">
              {detail ? "Programme details" : title}
            </span>
          </nav>
          {!editorial && <h1>{title}</h1>}
          <div className="guide-lede">
            {editorial ? <h1>{intro}</h1> : <p>{intro}</p>}
            <a
              className="guide-entry yellow-action"
              href={"#" + (firstLink?.[1] ?? "guide-content")}
            >
              {entry} <span aria-hidden="true">↓</span>
            </a>
          </div>
          {!detail && (
            <div className="guide-diptych" aria-hidden="true">
              {[image, companion[destination] ?? "campus"].map((src, i) => (
                <div key={i}>
                  <Image
                    fill
                    sizes="(max-width: 760px) 50vw, 46vw"
                    src={"/home/" + src + ".webp"}
                    alt=""
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}
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
