export interface NavLink {
  href: string;
  label: string;
}
export interface NavItem extends NavLink {
  /** Sub-pages shown in the menu's second column (desktop) or below the destinations (portrait phone). */
  children?: NavLink[];
}

export const srm = "https://www.srmist.edu.in";
export const tourUrl = "https://webstor.srmist.edu.in/web_assets/srmist-virtual-tour-vo/index.htm";

export const routes = {
  home: { href: "/", label: "Home" },
  admissions: { href: "/admissions", label: "Admissions" },
  programmes: { href: "/programmes", label: "Programmes" },
  campus: { href: "/campus", label: "Campus life" },
  placements: { href: "/career-centre", label: "Placements" },
  research: { href: "/research", label: "Research" },
  students: { href: "/students", label: "Students" },
  parents: { href: "/parents", label: "Parents" },
  alumni: { href: "/alumni", label: "Alumni" },
  news: { href: "/news", label: "News" },
  events: { href: "/events", label: "Events" },
  contact: { href: "/contact", label: "Contact us" },
  finder: { href: "/admissions#programme-finder", label: "Course finder" },
  fees: { href: "/programmes/fees", label: "Fees & eligibility" },
  india: { href: "/admissions#apply", label: "Admissions in India" },
  international: { href: "/admissions#international", label: "International admissions" },
  exam: { href: "/admissions#exam", label: "SRMJEEE dates & deadlines" },
  apply: { href: "https://applications.srmist.edu.in/btech", label: "Apply for SRMJEEE" },
  clubs: { href: "/campus#clubs", label: "Student clubs" },
  festivals: { href: "/campus#festivals", label: "Aaruush & Milan" },
  housing: { href: "/campus/accommodation", label: "Accommodation & dining" },
  recruiters: { href: "/career-centre#recruiters", label: "Recruiters & Super Dream offers" },
  outcomes: { href: "/career-centre#outcomes", label: "Placement figures & average CTC" },
  portals: { href: "/parents#parent-portals", label: "Parent portals" },
  score: { href: "/students#score", label: "About SCORE" },
  photos: { href: "https://alumni.srmist.edu.in/albums.dz", label: "Alumni photo albums" },
  reunions: { href: "https://alumni.srmist.edu.in/events.dz", label: "Alumni events" },
  graduates: { href: "/alumni#notable", label: "Notable alumni" },
} satisfies Record<string, NavLink>;

export const navigation: NavItem[] = [
  routes.home,
  {
    ...routes.admissions,
    children: [routes.india, routes.international, routes.finder, routes.fees, routes.exam, routes.apply,
      { href: "/admissions#faq", label: "Admissions FAQs" },
      { href: "/admissions#enquiry", label: "Ask admissions" }],
  },
  {
    ...routes.programmes,
    // Faculties with programmes in the SRMIST Program Finder; ids are its college filter values.
    children: [
      routes.finder, routes.fees,
      { href: "/programmes?college=9812", label: "Engineering & Technology" },
      { href: "/programmes?college=24139", label: "Medicine & Health Sciences" },
      { href: "/programmes?college=23702", label: "Liberal Arts & Business Studies" },
      { href: "/programmes?college=29288", label: "Management" },
      { href: "/programmes?college=29281", label: "Law" },
      { href: "/programmes?college=28996", label: "Agriculture Sciences" },
      { href: "/programmes?college=266746", label: "Engineering & Technology, Acharapakkam" },
    ],
  },
  {
    ...routes.campus,
    children: [
      { href: "/campus#life", label: "Life at SRM" }, routes.festivals, routes.clubs,
      { href: "/campus#whats-on", label: "What’s happening" }, routes.housing,
      { href: "/campus#explore", label: "Explore Kattankulathur" },
      { href: "/campus#support", label: "Student support" },
    ],
  },
  { ...routes.research, children: [
    { href: "/research#overview", label: "Research Overview" },
    { href: "/research#centres", label: "Research Centres & Facilities" },
    { href: "/research#projects", label: "Projects & Innovation" },
    { href: "/research#opportunities", label: "Research Opportunities" },
  ] },
  { ...routes.placements, children: [
    { href: "/career-centre#outcomes", label: "Placement figures & CTC" },
    { href: "/career-centre#recruiters", label: "Recruiters & offers" },
    { href: "/career-centre#support", label: "Training & contacts" },
  ] },
  { ...routes.students, children: [
    { href: "/students#portals", label: "Academic portals" },
    { href: "/students#wifi", label: "Wi-Fi & IT" }, routes.score] },
  { ...routes.parents, children: [routes.portals, routes.score, routes.fees, routes.housing] },
  { ...routes.alumni, children: [routes.photos, routes.reunions, routes.graduates] },
  routes.news,
];

export const services: NavLink[] = [routes.events, routes.contact];

export const actions = [
  { label: "Programmes", detail: "Find your programme", href: "/programmes" },
  { label: "Campus life", detail: "Find your people", href: "/campus" },
  { ...routes.students, detail: "Open student services" },
  { ...routes.parents, detail: "Parent portals & contacts" },
];
