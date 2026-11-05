export interface NavLink {
  href: string;
  label: string;
}
export interface NavItem extends NavLink {
  /** Sub-pages shown in the menu's second column (desktop) or accordion (phone). */
  children?: NavLink[];
}

export const navigation: NavItem[] = [
  {
    href: "/programmes",
    label: "Programmes",
    // Faculties with programmes in the SRMIST Program Finder; ids are its college filter values.
    children: [
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
    href: "/campus",
    label: "Campus life",
    children: [
      { href: "/campus#life", label: "More than a campus" },
      { href: "/campus#clubs", label: "Find your people" },
      { href: "/campus#whats-on", label: "What’s happening" },
      { href: "/campus/accommodation", label: "Accommodation & dining" },
      { href: "/campus#explore", label: "Explore Kattankulathur" },
      { href: "/campus#support", label: "Student support" },
    ],
  },
  {
    href: "/students",
    label: "Students",
    children: [
      { href: "/students#portals", label: "Academic portals" },
      { href: "/students#wifi", label: "Wi-Fi & IT" },
      { href: "/students#score", label: "SCORE" },
    ],
  },
  {
    href: "/admissions",
    label: "Admissions",
    children: [
      { href: "/admissions#apply", label: "How to apply" },
      { href: "/admissions#exam", label: "SRMJEEE dates" },
      { href: "/admissions#faq", label: "FAQs" },
      { href: "/admissions#enquiry", label: "Ask admissions" },
    ],
  },
  { href: "/news", label: "News" },
];
export const services: NavLink[] = [
  { href: "/career-centre", label: "Career Centre" },
  { href: "/events", label: "Events" },
  { href: "/parents", label: "Parents" },
  { href: "/alumni", label: "Alumni" },
];

export const srm = "https://www.srmist.edu.in";
export const tourUrl =
  "https://webstor.srmist.edu.in/web_assets/srmist-virtual-tour-vo/index.htm";

export const actions = [
  { label: "Programmes", detail: "Find your programme", href: "/programmes" },
  { label: "Campus life", detail: "Find your people", href: "/campus" },
  { label: "Students", detail: "Open student services", href: "/students" },
];
