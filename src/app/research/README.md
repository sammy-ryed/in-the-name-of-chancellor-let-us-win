# Research

New `/research` route. CSS is scoped to this route; existing pages and shared visual components are unchanged. The shared navigation adds Research and four section links. Ask SRM requires one `sectionNotes` entry for each top-level navigation label; its Research entry prevents an undefined summary during search-index construction.

## Content provenance

- Statistics: [SRMIST University Prospectus AY 2025–26](https://webstor.srmist.edu.in/web_assets/downloads/2025/srmist-university-prospectus-2025-26.pdf), printed pp. 31–32 (PDF pages 31–32). Historical totals are explicitly labelled; do not replace them with current CIAP figures from other reporting periods.
- Centres: same prospectus, printed p. 33. The three groupings are editorial. All listed centres remain available in the expandable directory; shared instrumentation and HPC are in Facilities.
- Electric mobility: prospectus p. 31, DST-PURSE outlay ₹13.63 crore. Use this figure rather than the rounded ₹14 crore on the departmental project listing. No patent year is stated.
- INOPOL: official [2021 report](https://webstor.srmist.edu.in/web_assets/downloads/2025/inopol-2021-report.pdf). Royal Norwegian Embassy support and partners appear in the report. No funding amount or patent year is inferred.
- Cancer models: [Geneticist January–June 2022](https://webstor.srmist.edu.in/web_assets/downloads/2023/jan-june-2022-the-geneticist.pdf), grants table. The amount is printed as `94.42 (175.00)` lakh; both figures are reproduced with an explanatory note. No patent is attributed to this grant.
- Energy materials: prospectus p. 32 lists the MNRE project on electrode materials for high-energy-density lithium-ion batteries and computational solar absorber studies; the [sponsored research report](https://webstor.srmist.edu.in/web_assets/downloads/2021/sponsored-research-consolidated-merged.pdf) also describes battery research. No project amount or patent year is inferred.
- Facilities: [2024–25 official brochure](https://webstor.srmist.edu.in/web_assets/downloads/2024/srmist-university-brochure-2024-25.pdf) and [SRM Online](https://srmonline.net/). Links lead to the actual instrument booking resources.
- Innovation: official [CIAP](https://ciap.srmdei.com/), linked from institutional materials, prospectus entrepreneurship section, and [2025–26 handbook](https://webstor.srmist.edu.in/web_assets/downloads/2025/hand-book-2025-26.pdf).
- Support: official Ph.D. application portal, institutional research policy and medical research resources. These are general resources; the page makes no claim about live grant or application availability.

## Assets and interaction

`public/research/laboratory.webp` is the supplied lab photograph, resized to 1600px and encoded as WebP. Existing SRMIST imagery is reused for research areas; project cards explicitly identify it as illustrative area imagery rather than photographs of specific project outcomes.

The hero follows the Career Centre's 60svh split composition and pointer-responsive blue/gold gradient. Only the hero glow and project selector are client components. The gradient respects reduced motion and the site's quiet-motion setting. Project details work on pointer hover, keyboard focus and click/tap; mobile cards use native horizontal scrolling. The centre directory uses native details/summary.

Fonts inherit the shared Bebas Neue (`SRM Display`), DM Sans, Newsreader and Manrope resources. No dependencies or global style changes are required.

## Interactive previews

Statistics count from zero when first scrolled into view (Indian number formatting, 1.8 seconds). Reduced/quiet motion displays final values. Project cards form a perspective diagonal stack and pull forward on hover, focus or tap; details remain alongside on desktop and below on mobile. Facility row buttons select a crossfading photo; separate arrow links open the official facility resources.

Facility photos were sourced from https://www.srmist.edu.in/research/: `2022/05/sir-cv-raman-research-park.png`, `2022/05/SCIF-Microscope-equipment.png`, `2023/09/Nanotechnology-Research-Center-NRC.jpg`, `2022/05/HPCC.png`, and `2022/03/Chemistry-research-149-1-scaled.jpg` (all under `/wp-content/uploads/`). Local WebP copies are in `public/research/`.
