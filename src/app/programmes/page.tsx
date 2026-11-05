import { Suspense } from "react";
import Link from "next/link";
import { Inter } from "next/font/google";
import { services } from "@/lib/navigation";
import { Rail } from "@/features/home/Rail";
import { finderData } from "@/features/programmes/finder/data";
import { ProgrammeFinder } from "@/features/programmes/finder/ProgrammeFinder";
import { FinderFromURL } from "@/features/programmes/finder/FinderFromURL";
import "./programmes.css";

// Finder type: Manrope for headings (--font-nav), Inter for body, labels and metadata.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata = {
  title: "Programmes",
  description: "Search every SRMIST programme by level, campus, faculty, department and mode of delivery.",
};

export default function Page() {
  return (
    <div className={`pf-page s-chrome ${inter.variable}`}>
      <Rail current="Programmes" scrollHref="#pf-results-title" />
      <div className="pf-main" id="programmes">
        <header className="pf-hero">
          <p className="pf-eyebrow">Programmes</p>
          <h1>Find your programme</h1>
          <p className="pf-lede">
            Explore {finderData.programmes.length} undergraduate, postgraduate and doctoral programmes across SRM
            Institute of Science and Technology. Search by subject, then narrow by level, campus or faculty.
          </p>
        </header>
        {/* Static HTML carries the full list; the URL (e.g. ?college=) applies on the client. */}
        <Suspense fallback={<ProgrammeFinder data={finderData} />}>
          <FinderFromURL data={finderData} />
        </Suspense>
      </div>
      <footer className="pf-foot">
        <p>
          Programme data from the <a href={finderData.source}>SRMIST Program Finder</a>, retrieved {finderData.fetched}.
          Each programme links to its official page for fees, eligibility and admission details.
        </p>
        <nav aria-label="More services">
          <Link href="/">SRMIST / Home</Link>
          {services.map((a) => (
            <Link key={a.href} href={a.href}>
              {a.label}
            </Link>
          ))}
        </nav>
      </footer>
    </div>
  );
}
