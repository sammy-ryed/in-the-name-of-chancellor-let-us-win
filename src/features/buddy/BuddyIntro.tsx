import Image from "next/image";
import { tourUrl } from "@/lib/navigation";
import type { Role } from "./matching";
import styles from "./buddy.module.css";

export function WalkRoute({ time }: { time?: string }) {
  return <section className={styles.walk} aria-label={time ? "Your meeting card" : "Sample first outing"}>
    <div className={styles.walkTitle}>
      <span className={styles.eyebrow}>{time ? "Your meeting card" : "Sample first outing"}</span>
      <h2>{time ? "Meet at Arch Gate." : "The first walk."}</h2>
      <p>{time ? time + " · First week" : "A short campus walk with your buddy."}</p>
    </div>
    <ol className={styles.route}>
      <li><span className={styles.routeDot} aria-hidden="true" /><div><strong>Arch Gate</strong><small>Meet your buddy at the gate.</small></div></li>
      <li><span className={styles.routeDot} aria-hidden="true" /><div><strong>Central Library</strong><small>Walk to the University Administrative Block. The library’s circulation counter is on level one.</small></div></li>
    </ol>
    {time && <>
      <a className={styles.inlineLink} href="https://www.google.com/maps/dir/?api=1&origin=SRM+Arch+Gate,+Potheri,+Kattankulathur&destination=SRM+Central+Library,+Kattankulathur&travelmode=walking">Open walking directions <span aria-hidden="true">↗</span></a>
      <a className={styles.inlineLink} href={tourUrl}>Preview the campus in 360° <span aria-hidden="true">↗</span></a>
    </>}
  </section>;
}
export function BuddyIntro({ start, withdrawn }: { start: (role: Role) => void; withdrawn: boolean }) {
  return <>
    <div className={styles.postcard}>
      <div className={styles.photo}>
        <Image src="/campus/green-walkway.webp" alt="A tree-lined walkway on the Kattankulathur campus" fill sizes="(max-width: 760px) 94vw, 46vw" fetchPriority="high" loading="eager" />
        <div className={styles.photoCaption}>Kattankulathur, Tamil Nadu</div>
      </div>
      <div className={styles.letter}>
        <div aria-hidden="true" className={styles.postmark}><span>SRM</span><i /><i /><i /></div>
        <h1>Know someone before your first day.</h1>
        <p>A second- or third-year student can meet you at the gate, walk you to class and check in after your first week.</p>
        <div className={styles.buttons}>
          <button type="button" className={styles.primary} onClick={() => start("fresher")}>Find a buddy <span aria-hidden="true">↗</span></button>
          <button type="button" className={styles.secondary} onClick={() => start("senior")}>Be a buddy <span aria-hidden="true">↗</span></button>
        </div>
        <small className={styles.disclosure}>Try either role with fictional students. Your demo stays in this tab.</small>
      </div>
    </div>
    {withdrawn && <p role="status" className={styles.notice}>You’ve withdrawn. Your preferences, demo emails and first-week plan have been cleared.</p>}
    <WalkRoute />
    <section className={styles.beforeMeet} aria-labelledby="buddy-before-title"><h2 id="buddy-before-title">Before you meet</h2><ol>
      <li><strong>Share your preferences</strong><span>Choose what you want help with, a language and a time to meet.</span></li>
      <li><strong>Both accept the match</strong><span>Read the suggested pairing and decide whether to meet.</span></li>
      <li><strong>Say hello by SRM email</strong><span>The senior sends the first email. The fresher replies to confirm the place and time.</span></li>
    </ol></section>
  </>;
}
