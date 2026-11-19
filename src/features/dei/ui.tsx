import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { routes } from "@/lib/navigation";
import { applyIncubation, deiRoutes } from "./data";
import styles from "./dei.module.css";

const isInternal = (href: string) => href.startsWith("/") || href.startsWith("#");

export function DeiAction({ href, children, quiet = false }: { href: string; children: React.ReactNode; quiet?: boolean }) {
  const className = quiet ? styles.textLink : styles.primary;
  const arrow = <span aria-hidden="true">{isInternal(href) ? "→" : "↗"}</span>;
  return isInternal(href)
    ? <Link className={className} href={href}>{children} {arrow}</Link>
    : <a className={className} href={href}>{children} {arrow}</a>;
}

/** Dark navy page opener: display title with an editorial italic accent, matching the SRM contact hero. */
export function DeiHero({ current, title, accent, lead, image, alt, credit, media, children }: {
  current?: string;
  title: string;
  accent: string;
  lead: string;
  image?: string;
  alt?: string;
  /** Attribution for openly licensed photos, shown under the image. */
  credit?: { text: string; href: string };
  /** Replaces the single photo, e.g. with the home page's card deck. */
  media?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className={styles.hero} data-search-surface="dark">
      <div className={styles.wrap}>
        {current && (
          <Breadcrumbs className={styles.crumbs} parents={[routes.home, deiRoutes.home]} current={current} />
        )}
        <div className={styles.heroLayout}>
          <div>
            <h1 className={styles.heroTitle}>{title} <em>{accent}<span>.</span></em></h1>
            <p className={styles.heroLead}>{lead}</p>
            {children && <div className={styles.actions}>{children}</div>}
          </div>
          {media ?? (image && (
            <div className={styles.heroPrint}>
              <div><Image src={image} alt={alt ?? ""} fill preload unoptimized={image.startsWith("/dei/")} sizes="(max-width: 760px) 90vw, 40vw" /></div>
              {credit && <a className={styles.heroCredit} href={credit.href} target="_blank" rel="noopener noreferrer">{credit.text}</a>}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

export function DeiSection({ id, title, accent, intro, tone = "warm", children }: {
  id?: string;
  title: string;
  accent?: string;
  intro?: string;
  tone?: "warm" | "pale" | "navy";
  children: React.ReactNode;
}) {
  const headingId = (id ?? title.toLowerCase().replace(/[^a-z]+/g, "-")) + "-title";
  return (
    <section id={id} className={styles.section} data-tone={tone} aria-labelledby={headingId}
      data-search-surface={tone === "navy" ? "dark" : undefined}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <h2 id={headingId}>{title}{accent && <> <em>{accent}</em></>}</h2>
          {intro && <p>{intro}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

/** Gold closing band used at the foot of every DEI page. */
export function DeiCallToAction() {
  return (
    <section className={styles.cta} aria-labelledby="dei-cta">
      <div className={`${styles.wrap} ${styles.ctaInner}`}>
        <div>
          <h2 id="dei-cta">Have a startup <em>idea?</em></h2>
          <p>Apply for incubation, or talk to the team first. Students, faculty and external founders welcome.</p>
        </div>
        <div className={styles.actions}>
          <DeiAction href={applyIncubation}>Apply for incubation</DeiAction>
          <DeiAction href={deiRoutes.contact.href} quiet>Talk to the team</DeiAction>
        </div>
      </div>
    </section>
  );
}
