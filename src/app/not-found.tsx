import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Compass } from "@/components/wayfinding/Compass";
import styles from "@/components/wayfinding/wayfinding.module.css";
import { routes } from "@/lib/navigation";

export const metadata: Metadata = { title: "404 · Page not found" };

export default function NotFound() {
  return (
    <article className={styles.missing}>
      <figure className={styles.panorama}>
        <Image src="/home/campus.webp" alt="" fill sizes="100vw" loading="eager" unoptimized />
        <div className={styles.registration} aria-hidden="true" />
        <div className={styles.code} aria-hidden="true">
          <span>4</span><Compass /><span>4</span>
        </div>
        <figcaption>Kattankulathur campus</figcaption>
      </figure>
      <div className={styles.recovery}>
        <h1>Off the map<span>.</span></h1>
        <div className={styles.recoveryBody}>
          <p>We couldn’t find the page at this address.</p>
          <div className={styles.actions}>
            <Link className={styles.home} href={routes.home.href}><span aria-hidden="true">←</span> Back to home</Link>
            <Link className={styles.explore} href={routes.programmes.href}>Explore programmes <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </div>
    </article>
  );
}
