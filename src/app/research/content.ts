// Historical figures and centre names: SRMIST University Prospectus AY 2025–26,
// printed pp. 31–33. Grouping below is editorial; names are from the source.
export const prospectus = "https://webstor.srmist.edu.in/web_assets/downloads/2025/srmist-university-prospectus-2025-26.pdf";
export const sources = {
  prospectus,
  facilities: "https://srmonline.net/",
  medical: "https://medicalresearch.srmist.edu.in/about/",
  ciap: "https://ciap.srmdei.com/",
  phd: "https://admissions.srmist.edu.in/srmistonline/phdapplication",
  policy: "https://www.srmistvdp.edu.in/research-policy",
  inopol: "https://webstor.srmist.edu.in/web_assets/downloads/2025/inopol-2021-report.pdf",
  genetics: "https://webstor.srmist.edu.in/web_assets/downloads/2023/jan-june-2022-the-geneticist.pdf",
  energy: "https://webstor.srmist.edu.in/web_assets/downloads/2021/sponsored-research-consolidated-merged.pdf",
  infrastructure: "https://webstor.srmist.edu.in/web_assets/downloads/2024/srmist-university-brochure-2024-25.pdf",
  handbook: "https://webstor.srmist.edu.in/web_assets/downloads/2025/hand-book-2025-26.pdf",
};

export const statistics = [
  ["30,177", "Research papers"], ["2,40,441", "Scopus citations"],
  ["833", "Patents filed"], ["784", "Patents published"],
  ["500+", "Funded projects"], ["₹231+ Cr", "External research funding"],
  ["3,800+", "Doctoral scholars"], ["145", "Scopus H-index"],
];

export const centreGroups = [
  { title: "Engineering & Technology", image: "/home/subjects/engineering.webp", alt: "Engineering at SRMIST", centres: [
    "Centre for Electric Mobility (CEM)", "Nanotechnology Research Centre (NRC)",
    "SRM-BRIN Centre of Excellence in Automation Technologies",
    "SRM-Mitsubishi Electric Centre of Excellence in Factory Automation",
    "Centre of Excellence for Electronics Cooling, CFD Simulation",
    "Centre for Advanced Concrete Research (CACR)",
    "Centre for Composites and Advanced Materials",
    "Centre for Advanced Complex Control and Embedded Systems (ACCES)",
    "Centre for Electronics and Skills Development and Consultancy Services",
    "NI Academy and Research Centre",
  ] },
  { title: "Medical & Health Sciences", image: "/home/subjects/health.webp", alt: "Medical training at SRMIST", centres: [
    "Division of Medical Research", "SRM Centre for Clinical Trials and Research (CCTR)",
    "Neuro-Otology and Vestibular Laboratory", "Molecular Diagnostic Centre",
    "SRM Centre for Clinical Pharmacology", "Autism Centre of Excellence",
    "SRM Centre of Excellence for Treatment of Cleft Lip & Palate Care",
  ] },
  { title: "Specialised & Interdisciplinary Centres", image: "/research/laboratory.webp", alt: "Research instrumentation laboratory at SRMIST", centres: [
    "Centre for Research in Environment, Sustainability Advocacy and Climate Change (REACH)",
    "SRM-DBT Partnership Platform", "Inter Disciplinary Institute of Indian System of Medicine",
    "Centre for Earthquake Research (CER)", "Centre for Quantum Computing",
    "Centre for Immersive Technologies", "Centre for Statistics", "Centre for Architectural Heritage",
  ] },
];

export type ResearchProject = {
  title: string; field: string; description: string; agency: string;
  funding: string; year: string; patent: string; fundingNote?: string; image: string; alt: string; source: string;
};

// Do not infer project-specific patents or turn reporting years into patent years.
export const projects: ResearchProject[] = [
  { title: "Electric Mobility Infrastructure", field: "Energy & mobility", description: "Infrastructure and supporting networks for electric-mobility research and startups under DST-PURSE.", agency: "Department of Science & Technology · PURSE", funding: "₹13.63 Cr", year: "2025–26 prospectus", patent: "Not specified in the cited source", image: "/home/racing.webp", alt: "SRMIST student motorsport engineering — research area imagery", source: prospectus + "#page=31" },
  { title: "Plastic Pollution Research", field: "Environment · INOPOL", description: "India–Norway research and capacity building to reduce plastic and chemical pollution, including marine litter and persistent organic pollutants.", agency: "Royal Norwegian Embassy, New Delhi", funding: "Amount not published in the cited report", year: "2021 report", patent: "Not specified in the cited source", image: "/home/subjects/agriculture.webp", alt: "SRMIST environmental fieldwork — research area imagery", source: sources.inopol },
  { title: "Cancer Models Using CRISPR-Cas9", field: "Genetics & health", description: "Developing zebrafish cancer models using CRISPR-Cas9 gene-editing techniques.", agency: "Department of Biotechnology (DBT)", funding: "₹94.42 lakh (₹175.00 lakh)", year: "2022 grants newsletter", fundingNote: "The newsletter gives both amounts without explaining the figure in brackets.", patent: "Not specified in the cited source", image: "/research/laboratory.webp", alt: "SRMIST laboratory — research area imagery", source: sources.genetics },
  { title: "Advanced Energy Materials & Lithium-ion Batteries", field: "Materials & energy storage", description: "Electrode materials for high-energy-density lithium-ion batteries, alongside computational studies of solar absorber layers.", agency: "Ministry of New and Renewable Energy (MNRE)", funding: "Amount not published in the cited sources", year: "2025–26 prospectus", patent: "Not specified in the cited sources", image: "/home/research.webp", alt: "Sir C. V. Raman Block at SRMIST — research area imagery", source: prospectus + "#page=32" },
];

export const facilities = [
  {
    title: "Sir C. V. Raman Research Park", description: "A shared home for advanced instrumentation and interdisciplinary research.",
    image: "/research/park.webp", alt: "Sir C. V. Raman Research Park at SRMIST",
    href: sources.infrastructure, linkLabel: "Read the facilities brochure",
  },
  {
    title: "Central Instrumentation Facilities", description: "Explore shared instruments and request time through the SCIF booking portal.",
    image: "/research/instrumentation.webp", alt: "Microscope equipment at SRM Central Instrumentation Facility",
    href: "https://scif.srmonline.net/index.php", linkLabel: "Book instrument time",
  },
  {
    title: "Nanotechnology Research Centre", description: "Access diffraction, microscopy and materials-characterisation instruments.",
    image: "/research/nano.webp", alt: "SRMIST Nanotechnology Research Centre",
    href: sources.facilities, linkLabel: "Find instrument services",
  },
  {
    title: "High-Performance Computing", description: "Computing infrastructure supporting theoretical and computational research.",
    image: "/research/computing.webp", alt: "SRMIST High-Performance Computing Centre",
    href: sources.infrastructure, linkLabel: "Read the facilities brochure",
  },
  {
    title: "Department Research Laboratories", description: "Specialist laboratories across engineering, sciences and health disciplines.",
    image: "/research/labs.webp", alt: "Chemistry research laboratory at SRMIST",
    href: sources.facilities, linkLabel: "Explore laboratory services",
  },
];
