/**
 * Content for the DEI (Directorate of Entrepreneurship and Innovation) redesign.
 * Copy and figures are taken from the public pages of https://www.srmdei.com.
 * Items marked CONFIRM disagree between pages on the live site and need checking with DEI.
 */
import type { NavLink } from "@/lib/navigation";

export const dei = "https://www.srmdei.com";
export const applyIncubation = "/dei/apply";
export const brcApply = "https://srmbrc.com/apply/";

export const deiRoutes = {
  home: { href: "/dei", label: "DEI home" },
  about: { href: "/dei/about", label: "About" },
  startups: { href: "/dei/startups", label: "Startups" },
  facilities: { href: "/dei/facilities", label: "Facilities" },
  programmes: { href: "/dei/programmes", label: "Programmes" },
  events: { href: "/dei/events", label: "Events" },
  contact: { href: "/dei/contact", label: "Contact" },
  apply: { href: "/dei/apply", label: "Apply for incubation" },
} satisfies Record<string, NavLink>;

export const deiNavigation: NavLink[] = [
  deiRoutes.about,
  deiRoutes.startups,
  deiRoutes.facilities,
  deiRoutes.programmes,
  deiRoutes.events,
  deiRoutes.contact,
];

// CONFIRM: the live homepage lists the two numbers below; the live /contact page lists +91 99400 36140.
export const contact = {
  phones: ["+91 91760 20760", "+91 97910 59105"],
  emails: [
    { label: "DEI office", address: "admin.dei@srmist.edu.in" },
    { label: "Incubation & outreach (BRC)", address: "associate.outreach@srmbrc.com" },
  ],
  address: [
    "Directorate of Entrepreneurship and Innovation",
    "SRM Institute of Science and Technology",
    "Kattankulathur, Chengalpattu District",
    "Tamil Nadu 603203",
  ],
};

export const stats = [
  { value: "₹225 Cr+", label: "raised by our startups" },
  { value: "37", label: "startups incubated" },
  { value: "130+", label: "pre-incubation projects" },
  { value: "₹1.2 Cr", label: "corpus fund" },
  { value: "110+", label: "events organised" },
  { value: "4", label: "technology transfers" },
];

/** The four things DEI offers. `points` preview the destination page on the back of each card. */
export const offers = [
  {
    title: "Incubation",
    body: "Workspace, mentors and investors through BRC.",
    href: deiRoutes.startups.href + "#incubation",
    page: "Startups › Incubation",
    points: ["Pre-incubation to acceleration", "Workspace on campus", "Mentor and investor access", "One application"],
  },
  {
    title: "Funding",
    body: "Grants, seed funds and loan guarantees.",
    href: deiRoutes.startups.href + "#funding",
    page: "Startups › Funding",
    points: ["NewGen IEDC for students", "SISFS: ₹20 lakh grant", "SISFS: ₹50 lakh debt", "CGSS: loans up to ₹20 Cr"],
  },
  {
    title: "Facilities",
    body: "Labs to build, test and protect your idea.",
    href: deiRoutes.facilities.href,
    page: "Facilities",
    points: ["FabLab prototyping", "BioNEST bio-incubator", "CIAP patents and IP", "Technology transfer"],
  },
  {
    title: "Programmes",
    body: "Minors, courses and bootcamps for SRMIST.",
    href: deiRoutes.programmes.href,
    page: "Programmes",
    points: ["Minor in Entrepreneurship", "Minor in BioDesign", "Design Thinking course", "Bootcamps"],
  },
];

/** The route from idea to company, so a founder knows which door to knock on. */
export const journey = [
  { step: "Explore", body: "Take Design Thinking, join a bootcamp or hackathon, and meet the IIC." },
  { step: "Pre-incubate", body: "Validate the idea with BRC mentors and build a first prototype at the FabLab." },
  { step: "Incubate", body: "Apply to BRC for workspace, seed funding and help with IP through CIAP." },
  { step: "Scale", body: "Raise from angel networks and partners, license technology and graduate." },
];

export const programmes = [
  {
    name: "Minor in Entrepreneurship and Design Innovation",
    who: "SRMIST undergraduates",
    body: "Learn technology innovation and entrepreneurship inspired by the Berkeley Method of Entrepreneurship.",
  },
  {
    name: "Minor in BioDesign and Innovation",
    who: "Undergraduate and postgraduate students",
    body: "A fast-paced, project-based course for students who want to improve global healthcare through technological innovation.",
  },
  {
    name: "Design Thinking",
    who: "Core, elective or optional for UG and PG",
    body: "Create solutions using user-centred design: empathy, prototyping and iterative problem-solving on real-world challenges. Over 6,000 students have completed it.",
  },
  {
    name: "Bootcamps",
    who: "Students and faculty",
    body: "Intensive Entrepreneurship and Design bootcamps, plus Blockchain Technology and Social Impact.",
  },
];

export const minorRules = [
  "A minor is completed alongside your major degree programme.",
  "You need a CGPA of at least 7.0 when you are admitted to the minor.",
  "Minors are offered by the SRM Innovation and Design Centre (SIDC).",
];

export const initiatives = [
  { name: "IRIS", body: "The Industry–Academia Collider: two days of expo, talks and partnerships." },
  { name: "Entrepreneurship Bootcamp", body: "A five-day sprint from problem to pitch." },
  { name: "Hackathons", body: "Build and demo in teams, judged by industry mentors." },
  { name: "Workshops", body: "Hands-on sessions on IP, fundraising, design and fabrication." },
  { name: "Triumph Talks", body: "Founders and investors share what worked and what didn't." },
  { name: "Expo", body: "Incubated startups show their products to the campus and industry." },
];

export const pastEvents = [
  { name: "IRIS '25 — Industry Academia Collider", date: "25–26 April 2025" },
  { name: "Entrepreneurship Bootcamp", date: "22–26 October 2024" },
];

export const team = [
  { name: "Dr. Shantanu Patil", role: "Director", email: "director.dei@srmist.edu.in" },
  { name: "Dr. R. Ananth Kumar", role: "Associate Director", email: "assocdirector.dei.ktr@srmist.edu.in" },
  { name: "Ramanan Ramanathan", role: "GD Naidu Chair Professor" },
  { name: "Mukesh Krishnan M B", role: "Academic Chair" },
  { name: "Vijay Rathan Lingaa", role: "Techno-Legal Advisor", email: "admin.ciap@srmist.edu.in" },
  { name: "Ramesh Krishnamoorthy", role: "Convener, IIC", email: "conveneriic.dei@srmist.edu.in" },
  { name: "Poornima Shyam", role: "Scientific Officer, BioNEST" },
  { name: "Dr. Yuvarani M S", role: "Associate, Technology Transfer" },
];

export const mentors = [
  { name: "Senthilkumar Rajendran", role: "Investor, partner and advisor", area: "Investor" },
  { name: "Giridharan", role: "CEO, SSN iFound", area: "Business" },
  { name: "Vanitha Shankar", role: "Founder, DPathways Consulting", area: "Business" },
  { name: "Chandran Krishnan", role: "MD & CEO, Campus Angels Network", area: "Investor" },
  { name: "Vaishali James", role: "Co-founder, Sangatna Angels", area: "Investor" },
  { name: "Hari Balasubramanian", role: "Angel investor and mentor", area: "Investor" },
  { name: "Amritha Sundararajan", role: "Digitalisation and transformation leader", area: "Technical" },
  { name: "Muthuraman", role: "Founder & CEO, CYGNUSA Technologies", area: "Technical" },
];

export const careers = [
  { title: "BioNEST Manager", body: "Run the BioNEST incubator and its BIRAC-funded projects." },
  { title: "Academic Coordinator", body: "Coordinate the Design Thinking course, minors and bootcamps." },
  { title: "Executive Secretary", body: "Be the single point of contact for DEI's administration." },
];

export const social = [
  { label: "Instagram", href: "https://www.instagram.com/srmdei.official/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/school/srmdei/" },
  { label: "X (Twitter)", href: "https://x.com/SRM_DEI" },
];
