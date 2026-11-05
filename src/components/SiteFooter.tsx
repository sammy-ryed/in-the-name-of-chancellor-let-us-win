import Image from "next/image";
import { srm } from "@/lib/navigation";
import { HomeLogo } from "./HomeLogo";
import { AccessibilityButton, FooterColumns, type FooterGroup } from "./FooterColumns";
import "./footer.css";

const studentPortal = "https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp";

const social = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/SRMUniversityOfficial/",
    icon: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
      </>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/srm-ist-chennai",
    icon: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
        <path d="M8 10.5V16M8 7.6v.1M11.5 16v-5.5M11.5 13c0-1.6 1-2.6 2.3-2.6s2.2.9 2.2 2.6V16" />
      </>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/user/SRMeducation",
    icon: (
      <>
        <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
        <path d="M10.2 9.4v5.2l4.5-2.6z" fill="currentColor" />
      </>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/SRMUniversityOfficial",
    icon: <path d="M14.5 8H16V4.8h-2.2C11.4 4.8 10 6.3 10 8.7V11H8v3.2h2V20h3.3v-5.8h2.3l.4-3.2h-2.7V9c0-.6.4-1 1.2-1z" />,
  },
  {
    label: "X (Twitter)",
    href: "https://twitter.com/SRM_Univ",
    icon: <path d="M5 4.5h3.6l10.4 15H15.4zM18.6 4.5 13.4 10.4M5.4 19.5l5.4-6.1" />,
  },
];

export function SiteFooter({ admissionsHref = "/admissions" }: { admissionsHref?: string }) {
  const groups: FooterGroup[] = [
    {
      title: "Explore",
      links: [
        { label: "Academics", href: srm + "/about-us/academic-heads/" },
        { label: "Programmes", href: "/programmes" },
        { label: "Admissions", href: admissionsHref },
        { label: "Research", href: srm + "/research/" },
        { label: "Campus Life", href: "/campus" },
        { label: "News & Events", href: "/news" },
      ],
    },
    {
      title: "Our Community",
      links: [
        { label: "Prospective Students", href: admissionsHref },
        { label: "Current Students", href: "/students" },
        { label: "Parents", href: "/parents" },
        { label: "Alumni", href: "/alumni" },
        { label: "Recruiters", href: "/career-centre" },
        { label: "Faculty", href: srm + "/faculty-gateway/" },
      ],
    },
    {
      title: "Quick Access",
      links: [
        { label: "Student Portal", href: studentPortal },
        { label: "Faculty Directory", href: srm + "/faculty-gateway/" },
        { label: "Placements", href: srm + "/placements/" },
        { label: "Library", href: srm + "/library/" },
        { label: "Careers", href: "https://careers.srmist.edu.in/" },
      ],
    },
    {
      title: "Get in Touch",
      links: [
        { label: "Contact Us", href: srm + "/contact-us/" },
        { label: "Admissions Enquiry", href: "/admissions#enquiry" },
        { label: "Campus Location", href: srm + "/visitors/" },
        { label: "Help & Support", href: "/students" },
      ],
    },
  ];

  return (
    <footer className="ft">
      <div className="ft-inner">
        <div className="ft-top">
          <div className="ft-brand">
            <HomeLogo />
            <p>
              SRM Institute of Science and Technology — a multi-disciplinary university in Kattankulathur, Chennai,
              where students learn, build and research across engineering, medicine, management, law and the arts.
            </p>
          </div>
          <ul className="ft-social" aria-label="SRMIST on social media">
            {social.map((s) => (
              <li key={s.label}>
                <a href={s.href} aria-label={s.label} rel="noopener noreferrer" target="_blank">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    {s.icon}
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <FooterColumns groups={groups} />

        <div className="ft-util">
          <small>© {new Date().getFullYear()} SRM Institute of Science and Technology. Student redesign prototype.</small>
          <ul>
            <li>
              <a className="ft-util-link" href={srm + "/privacy-policy/"}>Privacy Policy</a>
            </li>
            <li>
              <a className="ft-util-link" href={srm + "/terms-and-conditions/"}>Terms &amp; Conditions</a>
            </li>
            <li>
              <AccessibilityButton />
            </li>
          </ul>
        </div>
      </div>

      {/* The closing visual: the supplied illustration, unaltered, full width. */}
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
