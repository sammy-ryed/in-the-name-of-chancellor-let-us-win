import { internationalApplicationUrl, srm } from "@/lib/navigation";
import s from "./apply.module.css";

const portal = "https://applications.srmist.edu.in";
const otherApplications = [
  { label: "MBA · SRMJEEM", href: portal + "/mba" },
  { label: "Medicine and health sciences · SRMJEEH", href: srm + "/admission-india/medicine-health-sciences/" },
  { label: "All domestic programme forms", href: portal + "/" },
  { label: "International and NRI applications", href: internationalApplicationUrl },
];

export function ApplicationPortal() {
  return <section className={s.portal} id="application-form" aria-labelledby="apply-portal-heading">
    <div className={s.formTitle}>
      <span aria-hidden="true" /><p className={s.kicker}>Domestic applicants</p>
      <h2 id="apply-portal-heading">Apply for B.Tech</h2>
      <p>SRM uses this form for B.Tech and integrated M.Tech applications through SRMJEEE.</p>
    </div>
    <a className={s.portalAction} href={portal + "/btech"}>Open B.Tech application <span aria-hidden="true">↗</span></a>
    <p className={s.login}>Already registered? Choose <strong>Login</strong> on the portal to continue your application.</p>
    <nav className={s.otherRoutes} aria-label="Other application routes">
      <h3>Other application routes</h3>
      {otherApplications.map(route => <a key={route.href} href={route.href}>{route.label} <span aria-hidden="true">↗</span></a>)}
    </nav>
  </section>;
}
