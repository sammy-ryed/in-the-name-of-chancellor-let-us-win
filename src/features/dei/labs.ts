/**
 * The four DEI facilities. Facts and equipment come from each lab's own site
 * (fablab.srmdei.com, birac.srmdei.com, ciap.srmdei.com). Equipment images are the manufacturer shots those
 * sites use; CIAP and TTO need real photos from DEI.
 */
export type LabSlide = { src: string; alt: string; caption: string; fit?: "cover" | "contain" };
export type Lab = {
  id: string;
  name: string;
  tag: string;
  lead: string;
  inside: { title: string; items: string[] };
  /** Who can use it, in a few words. */
  forWho: string;
  stats?: { value: string; label: string }[];
  steps?: string[];
  slides: LabSlide[];
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
};

const p = (file: string) => `/dei/labs/${file}.jpg`;

export const labs: Lab[] = [
  {
    id: "fablab",
    name: "FabLab",
    tag: "Prototype",
    lead: "Build your prototype with 3D printers, laser cutters, CNC and metal tools.",
    inside: { title: "Machines", items: ["3D printer", "Laser cutter", "CNC engraver", "Fibre laser metal cutter", "Lathe and milling", "Welding"] },
    forWho: "Students, faculty, alumni, startups and external makers",
    slides: [
      { src: "/home/innovation.webp", alt: "Machines and workbenches in an SRM innovation workshop", caption: "The workshop floor" },
      { src: "/dei/photos/initiative-hackathons.jpg", alt: "Students assembling an aluminium-frame prototype", caption: "Building at a DEI hackathon" },
      { src: p("fablab-3d-printer"), alt: "Dual-extrusion 3D printer", caption: "3D printer", fit: "contain" },
      { src: p("fablab-laser-cutter"), alt: "Laser cutting machine", caption: "Laser cutter", fit: "contain" },
      { src: p("fablab-cnc"), alt: "Large-bed CNC engraver", caption: "CNC engraver", fit: "contain" },
      { src: p("fablab-fiber-laser"), alt: "Fibre laser metal cutting machine", caption: "Fibre laser metal cutter", fit: "contain" },
      { src: p("fablab-lathe"), alt: "Lathe machine", caption: "Lathe", fit: "contain" },
      { src: p("fablab-milling"), alt: "Milling machine", caption: "Milling machine", fit: "contain" },
      { src: p("fablab-welding"), alt: "Welding machine", caption: "Welding", fit: "contain" },
    ],
    primary: { label: "Get a FabLab membership", href: "https://fablab.srmdei.com" },
  },
  {
    id: "bionest",
    name: "BioNEST",
    tag: "Biotech incubation",
    lead: "Wet labs and a biotech incubator. Book equipment by the hour.",
    inside: { title: "Lab equipment", items: ["Cell culture facility", "Biosafety cabinets", "CO₂ and shaker incubators", "ÄKTA pure, spectrophotometer, ELISA"] },
    forWho: "Biotech, MedTech, BioPharma and HealthTech startups",
    stats: [{ value: "25+", label: "startups incubated" }, { value: "16", label: "lab instruments" }],
    slides: [
      { src: "/research/laboratory.webp", alt: "A researcher running an instrument in an SRM laboratory", caption: "Research labs at SRM" },
      { src: p("bionest-cell-culture"), alt: "Gloved hand holding a petri dish beside a rack of tubes", caption: "Cell culture" },
      { src: p("bionest-biosafety"), alt: "Biosafety cabinet", caption: "Biosafety cabinet", fit: "contain" },
      { src: p("bionest-co2-incubator"), alt: "CO2 incubator", caption: "CO₂ incubator", fit: "contain" },
      { src: p("bionest-akta"), alt: "Cytiva ÄKTA pure chromatography system", caption: "ÄKTA pure", fit: "contain" },
      { src: p("bionest-imagequant"), alt: "ImageQuant 800 imager", caption: "ImageQuant 800", fit: "contain" },
      { src: p("bionest-spectrophotometer"), alt: "UV-Vis spectrophotometer", caption: "UV-Vis spectrophotometer", fit: "contain" },
      { src: p("bionest-centrifuge"), alt: "Eppendorf 5810R centrifuge", caption: "Centrifuge 5810R", fit: "contain" },
      { src: p("bionest-lyophilizer"), alt: "Freeze dryer", caption: "Lyophiliser", fit: "contain" },
    ],
    primary: { label: "Book lab equipment", href: "https://birac.srmdei.com/FacilitiesServices" },
    secondary: { label: "BioNEST site", href: "https://birac.srmdei.com" },
  },
  {
    id: "ciap",
    name: "CIAP",
    tag: "Patents & IP",
    lead: "Protect your idea. CIAP handles patent searches, drafting and filing.",
    inside: { title: "Help with", items: ["Prior-art searches", "Patent drafting and filing", "Trademarks and design", "IP training"] },
    forWho: "SRMIST students, faculty and DEI startups",
    stats: [{ value: "949+", label: "patents filed" }, { value: "393", label: "granted" }, { value: "2018", label: "National IP Award" }],
    slides: [
      { src: p("ciap-patent"), alt: "An inventor holding a patent certificate", caption: "Patent filing" },
      { src: "/dei/photos/iris-expo.jpg", alt: "Visitors at an SRM innovation showcase", caption: "Inventions on show at IRIS" },
    ],
    primary: { label: "Email CIAP about a patent", href: "mailto:admin.ciap@srmist.edu.in" },
    secondary: { label: "CIAP site", href: "https://ciap.srmdei.com" },
  },
  {
    id: "tto",
    name: "Technology Transfer",
    tag: "Licensing",
    lead: "License SRM research, or turn your own patent into a product or spin-off.",
    inside: { title: "How it works", items: [] },
    steps: ["Disclose your invention", "TTO checks novelty and market", "Find a licensee or partner", "Or launch a spin-off with DEI"],
    forWho: "SRMIST researchers and companies looking to license",
    slides: [
      { src: p("tto-digital"), alt: "Hands on a laptop with technology icons overlaid", caption: "From lab to market" },
      { src: "/dei/photos/initiative-iris.jpg", alt: "The IRIS Industry Academia Collider sign", caption: "Meeting industry at IRIS" },
    ],
    primary: { label: "See technologies to license", href: "https://ciap.srmdei.com/tto" },
    secondary: { label: "Disclose an invention", href: "mailto:admin.ciap@srmist.edu.in" },
  },
];
