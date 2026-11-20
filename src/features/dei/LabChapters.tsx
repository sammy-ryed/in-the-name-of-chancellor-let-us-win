import { LabGallery } from "./LabGallery";
import { labs } from "./labs";
import styles from "./labs.module.css";

/** One full-width chapter per lab: a big swipeable gallery on one side, the essentials on the other, alternating. */
export function LabChapters() {
  return (
    <>
      {labs.map((lab, i) => (
        <section key={lab.id} id={lab.id} className={styles.chapter} data-flip={i % 2 === 1 || undefined}
          data-tone={i % 2 === 1 ? "pale" : undefined} aria-labelledby={`${lab.id}-title`}>
          <div className={styles.chapterInner}>
            <div className={styles.media}>
              <LabGallery slides={lab.slides} label={lab.name} />
            </div>

            <div className={styles.info}>
              <p className={styles.eyebrow}><span>0{i + 1}</span>{lab.tag}</p>
              <h2 id={`${lab.id}-title`}>{lab.name}</h2>
              <p className={styles.lead}>{lab.lead}</p>

              {lab.stats && (
                <dl className={styles.stats}>
                  {lab.stats.map(s => <div key={s.label}><dd>{s.value}</dd><dt>{s.label}</dt></div>)}
                </dl>
              )}

              <div className={styles.block}>
                <h3>{lab.inside.title}</h3>
                {lab.steps
                  ? <ol className={styles.steps}>{lab.steps.map(s => <li key={s}>{s}</li>)}</ol>
                  : <ul className={styles.items}>{lab.inside.items.map(s => <li key={s}>{s}</li>)}</ul>}
              </div>

              <p className={styles.forWho}><span>For</span>{lab.forWho}</p>

              <div className={styles.actions}>
                <a className={styles.primary} href={lab.primary.href} {...(lab.primary.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  {lab.primary.label} <span aria-hidden="true">{lab.primary.href.startsWith("http") ? "↗" : "→"}</span>
                </a>
                {lab.secondary && (
                  <a className={styles.secondary} href={lab.secondary.href} {...(lab.secondary.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    {lab.secondary.label} <span aria-hidden="true">{lab.secondary.href.startsWith("http") ? "↗" : "→"}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
