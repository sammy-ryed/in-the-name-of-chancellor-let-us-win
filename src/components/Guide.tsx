import Link from "next/link";
import Image from "next/image";
import { navigation, services } from "@/lib/navigation";
import { Menu } from "./GuideMenu";
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
  return (
    <div className="guide">
      <header className="guide-header">
        <Link href="/" aria-label="SRM home">
          <Image
            width={132}
            height={45}
            src="/home/srm-white.svg"
            alt="SRM Institute of Science and Technology"
            unoptimized
          />
        </Link>
        <nav aria-label="Primary">
          {navigation.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              aria-current={a.label === section ? "page" : undefined}
            >
              {a.label}
            </Link>
          ))}
        </nav>
        <Menu />
      </header>
      <div className="guide-hero">
        <div>
          <Link href="/" className="guide-home">
            SRMIST / Home
          </Link>
          <h1>{title}</h1>
          <p>{intro}</p>
        </div>
        <div className="guide-photo">
          <Image
            fill
            sizes="(max-width:650px) 100vw, 40vw"
            src={"/home/" + image + ".webp"}
            alt=""
            unoptimized
          />
        </div>
      </div>
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
      <h2>{title}</h2>
      {children}
    </section>
  );
}
