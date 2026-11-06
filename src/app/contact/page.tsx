import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SiteFooter } from "@/components/SiteFooter";
import { ContactLinks } from "@/features/contact/ContactLinks";
import { OfficeDirectory } from "@/features/contact/OfficeDirectory";
import { generalContact, mainCampus } from "@/features/contact/directory";
import { routes } from "@/lib/navigation";
import styles from "./contact.module.css";

export const metadata = {
  title: "Contact Us",
  description: "Reach SRMIST admissions, student services and university offices, or plan a visit to the Kattankulathur campus.",
};

export default function ContactPage() {
  return (
    <>
      <div className={styles.page}>
        <header className={styles.hero} data-search-surface="dark">
          <div className={styles.wrap}>
            <Breadcrumbs className={styles.crumbs} parents={[routes.home]} current="Contact us" />
            <div className={styles.heroLayout}>
              <div className={styles.intro}>
                <h1>Contact <em>SRM<span>.</span></em></h1>
                <p>Applying, studying here or coming back for a visit? Find the people who can help.</p>
                <div className={styles.heroActions}>
                  <a className={styles.primary} href="#directory">Find an office <span aria-hidden="true">↓</span></a>
                  <a className={styles.visitLink} href="#visit">Plan a visit <span aria-hidden="true">↓</span></a>
                </div>
              </div>
              <div className={styles.album}>
                <div className={styles.mainPrint}>
                  <div><Image src="/campus/tech-park.webp" alt="Students walking outside SRM Tech Park" fill preload sizes="(max-width: 700px) 75vw, 38vw" /></div>
                  <span>Tech Park, Kattankulathur</span>
                </div>
                <div className={styles.smallPrint} aria-hidden="true">
                  <Image src="/campus/green-walkway.webp" alt="" fill sizes="(max-width: 700px) 29vw, 13vw" />
                </div>
              </div>
            </div>
          </div>
        </header>
        <section className={styles.general} aria-labelledby="general-enquiries">
          <div className={styles.wrap}>
            <h2 id="general-enquiries">General enquiries</h2>
            <ContactLinks phone={generalContact.phone} email={generalContact.email} />
            <a className={styles.generalSource} href={generalContact.source.href}>University contact details <span aria-hidden="true">↗</span></a>
          </div>
        </section>
        <OfficeDirectory />
        <section id="visit" className={styles.visit} aria-labelledby="visit-title">
          <div className={styles.wrap}>
            <div className={styles.visitPhoto}><Image src="/parents/tech-park-panorama.webp" alt="Aerial view of the Kattankulathur campus" fill sizes="(max-width: 700px) 100vw, 46vw" /></div>
            <div className={styles.visitCopy}>
              <h2 id="visit-title">Visit <em>Kattankulathur.</em></h2>
              <address>{mainCampus.address.map(line => <span key={line}>{line}</span>)}</address>
              <div className={styles.visitActions}>
                <a className={styles.primary} href={mainCampus.mapHref}>Get directions <span aria-hidden="true">↗</span></a>
                <a className={styles.textLink} href={mainCampus.visitorHref}>Visitor information <span aria-hidden="true">↗</span></a>
              </div>
              <a className={styles.otherCampuses} href={mainCampus.campusesHref}>Other campus contacts (PDF) <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}
