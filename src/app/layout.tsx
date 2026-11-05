import type { Metadata } from "next";
import { DM_Sans, Manrope, Newsreader } from "next/font/google";
import "./globals.css";
import "@/components/chrome.css";
import AskSRM from "@/features/ask-srm/AskSRM";
import Accessibility from "@/components/Accessibility";
import "@/components/access.css";
// Design-system fonts: --font-primary (DM Sans) and --font-editorial (Newsreader) in globals.css.
const sans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
const editorial = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", display: "swap" });
// Navigation menu face: --font-nav in globals.css.
const nav = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
export const metadata: Metadata = {
  icons: { icon: "/home/srm-white.svg" },
  title: { default: "Explore SRM", template: "%s | Explore SRM" },
  description:
    "Explore programmes, campus life and student services at SRM Institute of Science and Technology.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${editorial.variable} ${nav.variable}`}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <main id="main">{children}</main>
        <Accessibility />
        <AskSRM />
      </body>
    </html>
  );
}
