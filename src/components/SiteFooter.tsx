import Link from "next/link";
import { actions, services, srm, tourUrl } from "@/lib/navigation";
import { HomeLogo } from "./HomeLogo";
import "./footer.css";

export function ServiceLinks() {
  return services.map(({ href, label }) => (
    <Link key={href} href={href}>{label}</Link>
  ));
}

export function ServiceFooter({ className }: { className: string }) {
  return (
    <footer className={className}>
      <Link href="/">SRMIST / Home</Link>
      <nav aria-label="More services"><ServiceLinks /></nav>
    </footer>
  );
}

export function SiteFooter({
  admissionsHref = "/admissions",
  showServices = true,
}: {
  admissionsHref?: string;
  showServices?: boolean;
}) {
  return (
    <footer className="s-footer s-lines">
      <HomeLogo />
      <div>
        <p>Address</p>
        <a href={srm + "/visitors/"}>
          Kattankulathur, Chengalpattu
          <br />
          Tamil Nadu, India
        </a>
        <div className="s-foot-cols">
          <div>
            <p>Explore</p>
            {actions.map((a) => (
              <Link key={a.href} href={a.href}>
                {a.label}
              </Link>
            ))}
          </div>
          <div>
            <p>Connect</p>
            <a href={srm + "/contact-us/"}>Contact SRM</a>
            <Link href={admissionsHref}>Admissions</Link>
            <a href={tourUrl}>Visit campus</a>
            {showServices && <ServiceLinks />}
          </div>
        </div>
      </div>
      <small>SRMIST · Student redesign prototype</small>
      <a className="s-foot-top yellow-action" href="#main">
        Back to top ↑
      </a>
    </footer>
  );
}
