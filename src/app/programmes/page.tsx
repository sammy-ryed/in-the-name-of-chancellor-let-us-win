import { Suspense } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { applicantSource } from "@/features/programmes/finder/applicants";
import { finderData } from "@/features/programmes/finder/data";
import { ProgrammeFinder } from "@/features/programmes/finder/ProgrammeFinder";
import { FinderFromURL } from "@/features/programmes/finder/FinderFromURL";
import "./programmes.css";

export const metadata = {
  title: "Programmes",
  description: "Explore SRMIST programmes by subject, school and campus. Compare fees and duration, then apply.",
};

export default function Page() {
  return (
    <>
      <div className="pf-page" id="programmes">
        <Suspense fallback={<ProgrammeFinder data={finderData} />}>
          <FinderFromURL data={finderData} />
        </Suspense>
        <p className="pf-source">
          Catalogue from the <a href={finderData.source}>SRMIST Program Finder</a>. “Most applied to” uses <a href={applicantSource}>2024–25 Kattankulathur application counts</a>. Study areas are ordered by their total reported applications, then by the number of programmes they offer. Within each area, courses without a matched count follow alphabetically. Check the official programme page for intake-specific fees and eligibility.
        </p>
      </div>
      <SiteFooter />
    </>
  );
}
