/**
 * Startups, partners, funding previews and hero slides for the DEI pages.
 * Logos and photos are copied from https://www.srmdei.com into /public/dei.
 * Startup summaries come from each company's own website or published coverage; entries
 * without `summary` could not be verified and show a "profile coming soon" note until DEI supplies one.
 */

export type Startup = {
  id: string;
  name: string;
  logo: string;
  status: "Incubating" | "Graduated";
  sector?: string;
  /** One line on the card. */
  summary?: string;
  /** Longer description in the detail dialog. */
  detail?: string;
  highlight?: string;
  href?: string;
};

const logo = (file: string) => `/dei/startups/${file}.png`;

export const startups: Startup[] = [
  {
    id: "zero-meat", name: "Zero Meat", logo: logo("zeromeat"), status: "Incubating", sector: "Food tech",
    summary: "Plant-based meat and dairy alternatives.",
    detail: "Zero Meat makes plant-based alternatives to meat and dairy products for Indian kitchens.",
    href: "https://www.linkedin.com/company/zero-meat/",
  },
  {
    id: "weezy", name: "Weezy", logo: logo("weezy"), status: "Incubating", sector: "Consumer brand",
    summary: "Men's casual fashion and streetwear, sold online.",
    detail: "Weezy is a direct-to-consumer fashion label selling men's casual wear and streetwear (oversized tees, shirts, cargos, jeans and jackets) through its own online store.",
    href: "https://weezy.in/",
  },
  { id: "wbr", name: "WBR", logo: logo("weber"), status: "Incubating", href: "https://wbr.mobi/" },
  {
    id: "reliamotive", name: "Reliamotive Labs", logo: logo("reliamotive"), status: "Incubating", sector: "E-mobility",
    summary: "Electrification technology, consulting and training.",
    detail: "Reliamotive Labs develops next-generation electrification technology and offers consulting services and workshops for companies moving to electric powertrains.",
    href: "https://reliamotivelabs.tech/",
  },
  {
    id: "intakt", name: "IntaktEV", logo: logo("intakt"), status: "Incubating", sector: "E-mobility",
    summary: "Kits that turn petrol and diesel vehicles into plug-in hybrids.",
    detail: "IntaktEV's retrofit kit converts new or existing internal-combustion vehicles into dual-powertrain plug-in hybrid electric vehicles without removing the engine.",
    href: "https://www.intaktev.com/",
  },
  { id: "goyatra", name: "GoYatra", logo: logo("goyatra"), status: "Incubating" },
  {
    id: "fitsurance", name: "Fitsurance", logo: logo("fitsurance"), status: "Incubating", sector: "Health",
    summary: "Preventive health programmes for employers.",
    detail: "Fitsurance, which began at VU Amsterdam, uses health measurements, data and personal coaching to improve employee vitality and fitness, as a preventive alternative to costly insurance packages.",
    href: "https://fitsurance.in/",
  },
  {
    id: "brainwaves", name: "BrainwaveS", logo: logo("brainwaves"), status: "Incubating", sector: "Med tech",
    summary: "Virtual-reality rehabilitation for stroke patients.",
    detail: "BrainwaveS Neurorehab Solutions helps people through stroke rehabilitation with virtual-reality therapy.",
    href: "http://brainwavesinc.tech/",
  },
  { id: "aptitudebuster", name: "AptitudeBuster", logo: logo("aptitudebuster"), status: "Incubating" },
  {
    id: "reflow", name: "ReFlow Technologies", logo: logo("reflow"), status: "Incubating", sector: "Industrial IoT",
    summary: "AI-powered monitoring for manufacturing.",
    detail: "ReFlow Technologies builds industrial IoT and AI tools that help manufacturers monitor and improve their production lines.",
    href: "https://reflowtech.in",
  },
  { id: "vayut", name: "Vayut", logo: logo("vayut"), status: "Incubating", href: "https://www.linkedin.com/company/vayutsocial/about/" },
  {
    id: "climec", name: "Climec Labs", logo: logo("climeclabs"), status: "Graduated", sector: "Climate tech",
    summary: "Microalgae-powered indoor air purification.",
    detail: "Climec Labs uses living microalgae to clean indoor air, tackling sick-building syndrome while capturing carbon.",
    href: "http://www.climeclabs.com/",
  },
  { id: "surelocal", name: "SureLocal", logo: logo("surelocal"), status: "Graduated", href: "https://www.surelocal.in/" },
  {
    id: "rizel", name: "Rizel Automotive", logo: logo("rizel"), status: "Graduated", sector: "E-mobility",
    summary: "Electric motors and drive systems for EVs.",
    detail: "Rizel Automotive designs customisable radial-flux motors and drive components for two-, three- and four-wheeler electric vehicles.",
    highlight: "Acquired by MM Forgings, which took an 88% stake; now Abhinava Rizel.",
    href: "https://www.rizelautomotive.com/",
  },
  { id: "paperplane", name: "PaperPlane", logo: logo("paperplane"), status: "Graduated" },
  { id: "mczone", name: "McZone", logo: logo("mczone"), status: "Graduated", href: "https://www.mczone.in/McZone" },
  {
    id: "kreator", name: "Kreator 3D", logo: logo("kreator"), status: "Graduated", sector: "Deep tech",
    summary: "Made-in-India 3D printers and bioprinters.",
    detail: "Kreator 3D, started by SRM students, builds 3D printers and is developing 3D bioprinters for biomedical research.",
    highlight: "Open-sourced a low-cost ventilator design with SRM and Rizel during Covid-19.",
    href: "http://kreator3d.com/",
  },
  { id: "closerlook", name: "CloserLook", logo: logo("closerlook"), status: "Graduated" },
  {
    id: "torus", name: "Torus Robotics", logo: logo("torus"), status: "Graduated", sector: "Deep tech",
    summary: "Axial-flux electric motors.",
    detail: "Torus Robotics, now Torus Motion, develops compact, high-power axial-flux motor technology.",
    href: "https://www.torusrobotics.com",
  },
  { id: "monkwish", name: "Monkwish", logo: logo("monkwish"), status: "Graduated", href: "https://www.monkwish.com" },
  {
    id: "thinkmetal", name: "ThinkMetal", logo: logo("thinkmetal"), status: "Graduated", sector: "Manufacturing",
    summary: "Metal 3D printing for industry.",
    detail: "ThinkMetal offers metal additive manufacturing to produce high-quality metal parts for industrial applications.",
    href: "http://thinkmetal.in/",
  },
  {
    id: "neur", name: "Neur XR Studios", logo: logo("neur"), status: "Graduated", sector: "XR",
    summary: "Extended-reality experiences and content.",
    detail: "Neur Industries runs Neur XR Studios, which builds augmented and virtual-reality experiences.",
    href: "https://www.neurindustries.com/",
  },
  {
    id: "bversity", name: "Bversity", logo: logo("bversity"), status: "Graduated", sector: "Ed tech",
    summary: "Biotech education and applied research.",
    detail: "Bversity runs the Bversity School of Bioscience and the Biotech Foundry, taking learners from a first biotech degree to careers in AI-driven biology.",
    href: "https://bversity.io",
  },
  { id: "waveform", name: "Waveform Labs", logo: logo("waveform"), status: "Graduated", href: "https://www.waveformlabs.in" },
];

export const partnerLogos = [
  { name: "EDII Ahmedabad", file: "pb1" },
  { name: "IEDC SRM", file: "pb2" },
  { name: "Jacobs Institute, UC Berkeley", file: "pb3" },
  { name: "SCET, UC Berkeley", file: "pb4" },
  { name: "Kingston University", file: "pb5" },
  { name: "The Chennai Angels", file: "pb7" },
  { name: "TiE Chennai", file: "pb8" },
  { name: "MoE's Innovation Cell", file: "pb9" },
  { name: "Institution's Innovation Council", file: "pb10" },
  { name: "Teesside University", file: "pb11" },
  { name: "Ministry of MSME", file: "pb12" },
  { name: "Department of Science & Technology", file: "pb14" },
  { name: "StartupTN", file: "startuptn" },
  { name: "D-Thinking", file: "desthink" },
  { name: "Startup India", file: "startupind" },
  { name: "Campus Angels Network", file: "campusangels" },
  { name: "Jajal Medical", file: "jalal" },
  { name: "Bridge Bharat Council", file: "bridgebharat" },
  { name: "STPI NEXT", file: "stpi" },
  { name: "PCCOE CIIL", file: "pcoe" },
  { name: "iTNT Hub", file: "itnt" },
  { name: "R.K. Dewan & Co.", file: "rkdewan" },
  { name: "Vakilsearch", file: "vakilsearch" },
].map(p => ({ name: p.name, src: `/dei/partners/${p.file}.png` }));

export type FundingProgramme = {
  id: string;
  name: string;
  full: string;
  logo?: string;
  /** Who runs it. */
  by: string;
  audience: string;
  /** What you get, one fact per line. */
  offers: string[];
  apply: string;
  href: string;
  cta: string;
};

/**
 * Audited against the scheme pages (Nov 2026). NewGen IEDC publishes no fixed per-project amount, so none is shown.
 * CGSS cover rates are as published on srmdei.com and in the May 2025 revision (₹20 Cr ceiling per borrower).
 */
export const funding: FundingProgramme[] = [
  {
    id: "newgen-iedc",
    name: "NewGen IEDC",
    full: "New Generation Innovation and Entrepreneurship Development Centre",
    logo: "/dei/logos/newgen.svg",
    by: "DST (NSTEDB), run with EDII Ahmedabad",
    audience: "SRMIST student teams with an idea",
    offers: [
      "Funding to build a working prototype",
      "Covers materials, fabrication and vendor costs",
      "A mentor for your team",
      "Support from idea to prototype",
    ],
    apply: "Through DEI, during the annual call",
    href: "/dei/apply",
    cta: "Apply through DEI",
  },
  {
    id: "sisfs",
    name: "SISFS",
    full: "Startup India Seed Fund Scheme",
    logo: "/dei/logos/sisfs.svg",
    by: "DPIIT, Government of India",
    audience: "DPIIT-recognised startups, incorporated two years ago or less",
    offers: [
      "Grant up to ₹20 lakh for proof of concept, prototypes or product trials",
      "Up to ₹50 lakh as convertible debentures or debt for market entry and scale-up",
      "Disbursed through an approved incubator such as DEI",
    ],
    apply: "On the SISFS portal, choosing DEI as your incubator",
    href: "https://seedfund.startupindia.gov.in/",
    cta: "Open the SISFS portal",
  },
  {
    id: "cgss",
    name: "CGSS",
    full: "Credit Guarantee Scheme for Startups",
    by: "DPIIT, administered by NCGTC",
    audience: "DPIIT-recognised startups taking a loan",
    offers: [
      "Guarantee on loans up to ₹20 Cr per startup",
      "85% cover on loans up to ₹10 Cr",
      "75% cover on loans above ₹10 Cr",
      "Loans from banks, NBFCs and SEBI-registered AIFs",
    ],
    apply: "Through your lender; DEI can help you prepare",
    href: "https://www.ncgtc.in/",
    cta: "Open the NCGTC site",
  },
];

export const heroSlides = [
  { src: "/dei/photos/iris-expo.jpg", alt: "Guests trying a humanoid robot at the IRIS expo", caption: "IRIS Industry–Academia Collider" },
  { src: "/dei/photos/initiative-hackathons.jpg", alt: "Students building a prototype together at a DEI hackathon", caption: "Hackathons" },
  { src: "/dei/photos/bootcamp.jpg", alt: "Participants taking notes at the DEI Entrepreneurship Bootcamp", caption: "Entrepreneurship Bootcamp" },
  { src: "/dei/photos/initiative-workshops.jpg", alt: "Students at a workshop in the DEI innovation space", caption: "Workshops" },
  { src: "/dei/photos/initiative-iris.jpg", alt: "The IRIS '24 Industry Academia Collider sign by SRM and DEI", caption: "IRIS '24" },
];
