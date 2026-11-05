import { Suspense } from "react";
import { Inter } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { finderData } from "@/features/programmes/finder/data";
import { ProgrammeFinder } from "@/features/programmes/finder/ProgrammeFinder";
import { FinderFromURL } from "@/features/programmes/finder/FinderFromURL";
import "./programmes.css";

// Finder type: Manrope for headings (--font-nav), Inter for body, labels and metadata.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Programmes",
  description:
    "Search every SRMIST programme by level, campus, faculty, department and mode of delivery.",
};

export default function Page() {
  return (
    <>
      <div className={`pf-page ${inter.variable}`}>
        <div className="pf-main" id="programmes">
          <header className="pf-hero">
            <p className="pf-eyebrow">Programmes</p>
            <h1>Find your programme</h1>
            <p className="pf-lede">
              Explore {finderData.programmes.length} undergraduate, postgraduate
              and doctoral programmes across SRM Institute of Science and
              Technology. Search by subject, then narrow by level, campus or
              faculty.
            </p>
          </header>
          {/* Static HTML carries the full list; the URL (e.g. ?college=) applies on the client. */}
          <Suspense fallback={<ProgrammeFinder data={finderData} />}>
            <FinderFromURL data={finderData} />
          </Suspense>
        </div>
        <p className="pf-source">
          Programme data from the{" "}
          <a href={finderData.source}>SRMIST Program Finder</a>, retrieved{" "}
          {finderData.fetched}. Each programme links to its official page for
          fees, eligibility and admission details.
        </p>
      </div>
      <SiteFooter />
    </>
  );
}
