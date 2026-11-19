import Image from "next/image";
import Link from "next/link";
import { AccessibilityButton, FooterColumns, type FooterGroup } from "@/components/FooterColumns";
import "@/components/footer.css";
import { srm } from "@/lib/navigation";
import { applyIncubation, contact, dei, deiRoutes, social } from "./data";
import styles from "./dei.module.css";

const icons: Record<string, React.ReactNode> = {
  Instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
    </>
  ),
  LinkedIn: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <path d="M8 10.5V16M8 7.6v.1M11.5 16v-5.5M11.5 13c0-1.6 1-2.6 2.3-2.6s2.2.9 2.2 2.6V16" />
    </>
  ),
  "X (Twitter)": <path d="M5 4.5h3.6l10.4 15H15.4zM18.6 4.5 13.4 10.4M5.4 19.5l5.4-6.1" />,
};

const groups: FooterGroup[] = [
  { title: "Explore DEI", links: [deiRoutes.home, deiRoutes.about,
    { label: "Team & mentors", href: deiRoutes.about.href + "#team" },
    { label: "Institution's Innovation Council", href: deiRoutes.about.href + "#iic" },
    deiRoutes.events, { label: "Blog", href: dei + "/blog" }] },
  { title: "For startups", links: [
    { label: "Apply for incubation", href: applyIncubation },
    { label: "Incubation journey", href: deiRoutes.startups.href + "#incubation" },
    { label: "Funding programmes", href: deiRoutes.startups.href + "#funding" },
    { label: "Our startups", href: deiRoutes.startups.href + "#portfolio" },
    { label: "Partners", href: deiRoutes.startups.href + "#partners" }] },
  { title: "Facilities & learning", links: [
    { label: "FabLab", href: deiRoutes.facilities.href + "#fablab" },
    { label: "BioNEST", href: deiRoutes.facilities.href + "#bionest" },
    { label: "CIAP & IP protection", href: deiRoutes.facilities.href + "#ciap" },
    { label: "Technology transfer", href: deiRoutes.facilities.href + "#tto" },
    { label: "Minors & courses", href: deiRoutes.programmes.href }] },
  { title: "Contact & careers", links: [deiRoutes.contact,
    ...contact.emails.map(e => ({ label: e.address, href: "mailto:" + e.address })),
    { label: "Careers at DEI", href: deiRoutes.contact.href + "#careers" },
    { label: "SRMIST main site", href: "/" }] },
];

/** The SRM site footer, re-pointed at DEI: same structure, colours, accordions and skyline. */
export function DeiFooter() {
  return (
    <footer className="ft">
      <div className="ft-inner">
        <div className="ft-top">
          <div className="ft-brand">
            <Link href={deiRoutes.home.href} className={styles.footBrand} aria-label="DEI home">
              <span className={styles.wordmarkMark}>DEI</span>
              <span>Directorate of Entrepreneurship <br />and Innovation, SRMIST</span>
            </Link>
            <p>
              Founded in 2015, DEI supports student, faculty and external founders from first idea to funded company,
              with the Bootstrappers&apos; Research Council, FabLab, BioNEST and CIAP.
            </p>
          </div>
          <ul className="ft-social" aria-label="DEI on social media">
            {social.map(s => (
              <li key={s.label}>
                <a href={s.href} aria-label={s.label} rel="noopener noreferrer" target="_blank">
                  <svg viewBox="0 0 24 24" aria-hidden="true">{icons[s.label]}</svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <FooterColumns groups={groups} />

        <div className="ft-util">
          <small>© {new Date().getFullYear()} Directorate of Entrepreneurship and Innovation, SRMIST. Student redesign prototype.</small>
          <ul>
            <li><a className="ft-util-link" href={dei + "/privacy-policy"}>Privacy Policy</a></li>
            <li><a className="ft-util-link" href={dei + "/terms-and-conditions"}>Terms &amp; Conditions</a></li>
            <li><a className="ft-util-link" href={dei + "/refund-cancellation-policy"}>Refunds &amp; Cancellations</a></li>
            <li><a className="ft-util-link" href={srm}>SRMIST</a></li>
            <li><AccessibilityButton /></li>
          </ul>
        </div>
      </div>

      <figure className="ft-skyline">
        <Image
          src="/home/campus-skyline.webp"
          alt="Illustration of the SRM Kattankulathur campus skyline reflected in the lake at night"
          width={2155}
          height={730}
          sizes="100vw"
          unoptimized
        />
      </figure>
    </footer>
  );
}
