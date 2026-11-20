import Image from "next/image";
import Link from "next/link";
import styles from "./pages.module.css";

const internal = (href: string) => href.startsWith("/") || href.startsWith("#");
const ext = (href: string) => href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {};

export function Btn({ href, children, kind = "primary" }: { href: string; children: React.ReactNode; kind?: "primary" | "secondary" | "dark" }) {
  const arrow = <span aria-hidden="true">{href.startsWith("http") ? "↗" : "→"}</span>;
  return internal(href)
    ? <Link className={styles[kind]} href={href}>{children} {arrow}</Link>
    : <a className={styles[kind]} href={href} {...ext(href)}>{children} {arrow}</a>;
}

export function Section({ id, title, intro, tone, children }: {
  id?: string; title: string; intro?: string; tone?: "pale" | "navy"; children: React.ReactNode;
}) {
  const hid = (id ?? title.toLowerCase().replace(/[^a-z]+/g, "-")) + "-h";
  return (
    <section id={id} className={styles.section} data-tone={tone} aria-labelledby={hid}
      data-search-surface={tone === "navy" ? "dark" : undefined}>
      <div className={styles.wrap}>
        <div className={styles.head}>
          <h2 id={hid}>{title}</h2>
          {intro && <p>{intro}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

export function Facts({ items }: { items: { value: string; label: string }[] }) {
  return (
    <dl className={styles.facts}>
      {items.map(i => <div key={i.label}><dt>{i.label}</dt><dd>{i.value}</dd></div>)}
    </dl>
  );
}

/** "I want to…" rows that send people straight to the right place. */
export function Picker({ items }: { items: { task: string; dest: string; href: string }[] }) {
  return (
    <ul className={styles.picker}>
      {items.map(i => (
        <li key={i.task}>
          <Link href={i.href}>
            <span className={styles.pickerTask}>{i.task}</span>
            <span className={styles.pickerDest}>{i.dest}</span>
            <span className={styles.pickerArrow} aria-hidden="true">→</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export type Feature = {
  id: string; eyebrow: string; title: string; text: string; image: string; alt: string;
  badge?: { value: string; label: string };
  facts: { label: string; value: string }[];
  actions: { label: string; href: string; kind?: "primary" | "secondary" | "dark" }[];
};

/** Big image beside the essentials, alternating sides. */
export function Features({ items }: { items: Feature[] }) {
  return (
    <div className={styles.features}>
      {items.map(f => (
        <article key={f.id} id={f.id} className={styles.feature} aria-labelledby={`${f.id}-t`}>
          <div className={styles.featureMedia}>
            <Image src={f.image} alt={f.alt} fill unoptimized={f.image.startsWith("/dei/")} sizes="(max-width: 860px) 100vw, 55vw" />
            {f.badge && <span className={styles.featureBadge}><b>{f.badge.value}</b>{f.badge.label}</span>}
          </div>
          <div className={styles.featureBody}>
            <p className={styles.eyebrow}>{f.eyebrow}</p>
            <h3 id={`${f.id}-t`}>{f.title}</h3>
            <p>{f.text}</p>
            <dl className={styles.keyfacts}>
              {f.facts.map(x => <div key={x.label}><dt>{x.label}</dt><dd>{x.value}</dd></div>)}
            </dl>
            <div className={styles.actions}>
              {f.actions.map(a => <Btn key={a.label} href={a.href} kind={a.kind}>{a.label}</Btn>)}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

/** A list of hairline-separated rows: title, detail, optional action. */
export function Rows({ items, cols }: {
  items: { title: string; detail?: React.ReactNode; tag?: string; action?: { label: string; href: string } }[];
  cols?: 2;
}) {
  return (
    <ul className={styles.rows} data-cols={cols}>
      {items.map(r => (
        <li key={r.title} className={styles.row}>
          <p className={styles.rowTitle}>{r.title}</p>
          {(r.detail || r.tag) && (
            <div className={styles.rowDetail}>
              {r.tag && <span className={styles.tag}>{r.tag}</span>} {r.detail}
            </div>
          )}
          {r.action && (
            <span className={styles.rowAction}>
              {internal(r.action.href)
                ? <Link href={r.action.href}>{r.action.label} <span aria-hidden="true">→</span></Link>
                : <a href={r.action.href} {...ext(r.action.href)}>{r.action.label} <span aria-hidden="true">{r.action.href.startsWith("http") ? "↗" : "→"}</span></a>}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export { styles as pageStyles };
