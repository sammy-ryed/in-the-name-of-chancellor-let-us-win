import type { Metadata } from "next";
import "./globals.css";
import "@/components/chrome.css";
import Accessibility from "@/components/Accessibility";
import "@/components/access.css";
export const metadata: Metadata = {
  icons: { icon: "/home/srm-white.svg" },
  title: { default: "Explore SRM", template: "%s | Explore SRM" },
  description:
    "Explore programmes, campus life and student services at SRM Institute of Science and Technology.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <main id="main">{children}</main>
        <Accessibility />
      </body>
    </html>
  );
}
