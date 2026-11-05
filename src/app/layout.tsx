import type { Metadata } from "next";
import Link from "next/link";
import { navigation } from "@/lib/navigation";
import "./globals.css";

export const metadata: Metadata = { title: { default: "Explore SRM", template: "%s | Explore SRM" }, description: "A student-built SRMIST redesign prototype." };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><a className="skip" href="#main">Skip to content</a><header><Link className="brand" href="/">SRMIST</Link><nav aria-label="Main navigation">{navigation.map(n => <Link key={n.href} href={n.href}>{n.label}</Link>)}</nav></header><main id="main">{children}</main><footer>SRMIST website redesign · Student hackathon prototype</footer></body></html>;
}
