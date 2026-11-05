/**
 * Alumni page content. Every fact here comes from an official SRMIST source:
 * - Notable alumni: https://www.srmist.edu.in/alumni-affairs/notable-alumni/
 * - Events, albums and contacts: https://alumni.srmist.edu.in/ (events.dz, albums.dz)
 * Photos were downloaded from those pages and converted to WebP in public/alumni/.
 * Retrieved 5 November 2026.
 */

const portal = "https://alumni.srmist.edu.in";

export const alumniLinks = {
  portal: portal + "/home.dz",
  register: portal + "/user/signup.dz",
  events: portal + "/events.dz",
  albums: portal + "/albums.dz",
  stories: portal + "/newsroom/category/success-stories.dz",
  mentor: portal + "/support/mentor.dz",
  volunteer: portal + "/support/volunteer.dz",
  enquiry: portal + "/support/enquiry.dz",
  notable: "https://www.srmist.edu.in/alumni-affairs/notable-alumni/",
  instagram: "https://www.instagram.com/srmist_daa/",
  linkedin: "https://www.linkedin.com/in/srmist-daa/",
};

/** Directorate of Alumni Affairs office lines, as published on the alumni portal. */
export const alumniOffice = {
  phones: ["+91 91508 67273", "+91 44 2741 7273"],
};

/** Hero grid, row by row; the fifth photo is the centre tile the hero opens on. Alumni photographs only. */
export const heroPhotos: { src: string; alt: string }[] = [
  { src: "/alumni/memories/m22.webp", alt: "An alumnus taking a selfie with his batchmates at the Silver Jubilee reunion" },
  { src: "/alumni/memories/m07.webp", alt: "The 1995 batch seated together on the steps for a reunion photo" },
  { src: "/alumni/memories/m13.webp", alt: "Two old friends deep in conversation at Alumni Day 2025" },
  { src: "/alumni/memories/m12.webp", alt: "Alumni Day lanyards laid out on a table, ready for returning graduates" },
  { src: "/alumni/memories/m11.webp", alt: "A group of 1995 batchmates standing together and smiling" },
  { src: "/alumni/memories/m17.webp", alt: "Two alumni greeting each other warmly at Alumni Day 2025" },
  { src: "/alumni/memories/m16.webp", alt: "Alumnae sharing a table and a laugh at Alumni Day 2025" },
  { src: "/alumni/memories/m09.webp", alt: "Alumni welcomed with flowers at the 1995 batch reunion" },
  { src: "/alumni/memories/m19.webp", alt: "The 2001 batch filling the hall for their Silver Jubilee reunion" },
];

export type Spot = {
  /** Key into the marker positions in CampusMap.tsx. */
  id: string;
  name: string;
  /** A short nostalgic line shown in place of the name. */
  line: string;
  /** Where it is, in a few words. */
  where: string;
  memory: string;
  /** An authentic SRMIST photograph of the place, where one exists. */
  photo?: { src: string; alt: string };
};

/**
 * Hangout spots on the Kattankulathur campus, marked on the aerial illustration.
 * Only places with a verifiable location are included. The memories are written for this page.
 */
export const spots: Spot[] = [
  {
    id: "university-building",
    line: "Where every first day began",
    name: "University Building",
    where: "The ‘UB’, at the heart of campus",
    memory:
      "Every first day started here. Tall blue windows, lifts that never came on time, and the steps where everyone waited for everyone else.",
    photo: { src: "/alumni/university-building.webp", alt: "The University Building at SRM Kattankulathur rising above the trees" },
  },
  {
    id: "lake",
    line: "Evenings by the water",
    name: "By the lake",
    where: "The water beside the University Building",
    memory:
      "The view every campus photo tried to capture. Long talks on the walk past the water, and evenings when nobody wanted to head back yet.",
    photo: { src: "/campus/srm-university-lake.webp", alt: "The University Building reflected in the lake beside it" },
  },
  {
    id: "java",
    line: "Meet you at Java",
    name: "Java Food Court",
    where: "Just east of the University Building",
    memory:
      "One more coffee before class. The table you always claimed, the gossip between labs, and the plans that started with ‘meet at Java’.",
  },
  {
    id: "tech-park",
    line: "Two steps at a time",
    name: "Tech Park & the TP stairs",
    where: "Fifteen storeys on the north side of campus",
    memory:
      "Those steps, taken two at a time when you were late. Labs that ran past dinner, and the view back over campus once the work was done.",
    photo: { src: "/campus/tech-park.webp", alt: "Students climbing the wide steps to SRM Tech Park" },
  },
  {
    id: "vendhar-square",
    line: "One more round of chai",
    name: "Vendhar Square",
    where: "Beside the big green, north-east of Java",
    memory:
      "Late-evening snacks after practice, crowds spilling out after a match, and the walk back that always took longer than it should.",
  },
  {
    id: "hostels",
    line: "Doors left open, all night",
    name: "The hostels",
    where: "Paari, Kaari, Oori, Adhyaman and their neighbours",
    memory:
      "Doors left open down the corridor, midnight Maggi, exam-eve group study that turned into stories. Home, for a few years.",
    photo: { src: "/alumni/spots/hostels.webp", alt: "SRM hostel towers rising above the trees" },
  },
];

export type Memory = { src: string; alt: string };

/** Photographs from SRMIST alumni reunions and Alumni Day, from the official alumni albums. */
export const memories: Memory[] = [
  { src: "/alumni/memories/m01.webp", alt: "Alumni of the 1994 batch filling the auditorium for their 30th-year reunion" },
  { src: "/alumni/memories/m02.webp", alt: "Classmates greeting each other between the rows at the 1994 batch reunion" },
  { src: "/alumni/memories/m03.webp", alt: "Former SRM athletes gathered for a group photo at the 2024 sports alumni reunion" },
  { src: "/alumni/memories/m04.webp", alt: "Alumni sportspeople lined up on court at the 2024 sports reunion" },
  { src: "/alumni/memories/m05.webp", alt: "Old teammates catching up courtside at the sports alumni reunion" },
  { src: "/alumni/memories/m06.webp", alt: "Alumni of the 1995 batch holding a ceremonial cheque at their 30th-year reunion" },
  { src: "/alumni/memories/m07.webp", alt: "The 1995 batch seated together on the steps for a reunion photo" },
  { src: "/alumni/memories/m08.webp", alt: "Friends from the 1995 batch talking in a crowd at their reunion" },
  { src: "/alumni/memories/m09.webp", alt: "Alumni welcomed with flowers at the 1995 batch reunion" },
  { src: "/alumni/memories/m10.webp", alt: "Classmates seated around a table at the 1995 batch reunion" },
  { src: "/alumni/memories/m11.webp", alt: "A group of 1995 batchmates standing together and smiling" },
  { src: "/alumni/memories/m12.webp", alt: "Alumni Day lanyards laid out on a table, ready for returning graduates" },
  { src: "/alumni/memories/m13.webp", alt: "Two old friends deep in conversation at Alumni Day 2025" },
  { src: "/alumni/memories/m14.webp", alt: "Alumni laughing together in the auditorium at Alumni Day 2025" },
  { src: "/alumni/memories/m15.webp", alt: "Alumni catching up at Alumni Day 2025" },
  { src: "/alumni/memories/m16.webp", alt: "Alumnae sharing a table and a laugh at Alumni Day 2025" },
  { src: "/alumni/memories/m17.webp", alt: "Two alumni greeting each other warmly at Alumni Day 2025" },
  { src: "/alumni/memories/m18.webp", alt: "Alumnae posing together with their name badges at Alumni Day 2025" },
  { src: "/alumni/memories/m19.webp", alt: "The 2001 batch filling the hall for their Silver Jubilee reunion" },
  { src: "/alumni/memories/m20.webp", alt: "Alumni on stage at the 2001 batch Silver Jubilee reunion" },
  { src: "/alumni/memories/m21.webp", alt: "The audience at the 2001 batch Silver Jubilee reunion" },
  { src: "/alumni/memories/m22.webp", alt: "An alumnus taking a selfie with his batchmates at the Silver Jubilee reunion" },
];

export type Alumnus = {
  id: string;
  name: string;
  photo: string;
  field: string;
  degree: string;
  /** Graduation year as published; omitted where SRMIST does not give one consistently. */
  year?: number;
  role: string;
  achievement: string;
};

export const notableAlumni: Alumnus[] = [
  {
    id: "sriram-krishnan",
    name: "Sriram Krishnan",
    photo: "/alumni/people/sriram-krishnan.webp",
    field: "Public policy",
    degree: "B.Tech, Information Technology",
    year: 2005,
    role: "Senior Policy Advisor for Artificial Intelligence, The White House",
    achievement: "Advises on US AI policy after leadership roles in the technology industry.",
  },
  {
    id: "ashok-kumar-malhotra",
    name: "Ashok Kumar Malhotra",
    photo: "/alumni/people/ashok-kumar-malhotra.webp",
    field: "Public service",
    degree: "M.Tech, Artificial Intelligence & Data Science",
    role: "Mission Director, National Technical Textiles Mission",
    achievement: "Has led more than 168 research projects worth ₹510 crore under India’s Ministry of Textiles.",
  },
  {
    id: "vikraman-vasudevan",
    name: "Vikraman Vasudevan, IPS",
    photo: "/alumni/people/vikraman-vasudevan.webp",
    field: "Civil service",
    degree: "B.Tech, Computer Science & Engineering",
    year: 2005,
    role: "Deputy Inspector General of Police, National Investigation Agency",
    achievement: "Oversees national security and counter-terrorism investigations.",
  },
  {
    id: "ravi-kunduru",
    name: "Ravi Kunduru",
    photo: "/alumni/people/ravi-kunduru.webp",
    field: "Business",
    degree: "B.E., Computer Science & Engineering",
    year: 1995,
    role: "CEO, Ventech Solutions and QurHealth",
    achievement: "Leads two companies building business technology and digital healthcare.",
  },
  {
    id: "sheela-kunduru",
    name: "Sheela Kunduru",
    photo: "/alumni/people/sheela-kunduru.webp",
    field: "Business",
    degree: "B.E., Computer Science & Engineering",
    year: 1995,
    role: "Founder & President, Sritech Global Inc.",
    achievement: "Founded a firm that develops and improves processes and projects within government.",
  },
  {
    id: "sudha-jamthe",
    name: "Dr. Sudha Jamthe",
    photo: "/alumni/people/sudha-jamthe.webp",
    field: "Technology & education",
    degree: "B.E., Computer Science & Engineering",
    year: 1999,
    role: "Author on Generative AI, Business School of AI",
    achievement: "Writes and teaches on how generative AI is reshaping business.",
  },
  {
    id: "ashok-ramachandran",
    name: "Ashok Ramachandran",
    photo: "/alumni/people/ashok-ramachandran.webp",
    field: "Business",
    degree: "B.E., Instrumentation & Control",
    year: 2002,
    role: "President, India Business, Suzlon Group",
    achievement: "Became the youngest CEO of Schindler India; 20+ years leading energy and infrastructure businesses.",
  },
  {
    id: "ojas-mahapatra",
    name: "Dr. Ojas Mahapatra",
    photo: "/alumni/people/ojas-mahapatra.webp",
    field: "Business",
    degree: "B.Tech, Biotechnology",
    year: 2003,
    role: "Group CEO, MARS Bioimaging, New Zealand",
    achievement: "PhD in nanotechnology; awarded a New Zealand Prime Minister’s Business Scholarship.",
  },
  {
    id: "sam-anton",
    name: "Sam Anton",
    photo: "/alumni/people/sam-anton.webp",
    field: "Film",
    degree: "B.Tech, Computer Science & Engineering",
    role: "Film director and screenwriter",
    achievement: "Directed Tamil films including Darling (2015), Enakku Innoru Per Irukku (2016) and Gurkha (2019).",
  },
  {
    id: "nikhil-chaudhary",
    name: "Dr. Nikhil Chaudhary",
    photo: "/alumni/people/nikhil-chaudhary.webp",
    field: "Health & wellness",
    degree: "B.Tech, Biotechnology",
    year: 2009,
    role: "Nutritionist and CEO, Nikhil Chaudhary Wellness",
    achievement: "Builds personalised nutrition plans that promote long-term health.",
  },
];

export const alumniDay = {
  title: "Alumni Day 2026",
  tagline: "Reconnect, relive and celebrate",
  quote: "Where memories become legacy, and connections create the future.",
  date: "2026-12-19T10:00:00+05:30",
  dateLabel: "Saturday, 19 December 2026",
  time: "10:00 am IST",
  venue: "Dr. T. P. Ganesan Auditorium, SRMIST, Kattankulathur",
  closes: "Registration closes 17 December 2026. No on-the-spot registration.",
  description:
    "SRMIST’s annual flagship gathering. Meet your batchmates and fellow alumni, interact with the university leadership, revisit campus and build connections that last beyond graduation.",
  expect: [
    "Reconnect with batchmates and fellow alumni",
    "Conversations with SRMIST leadership",
    "Cultural and entertainment programme",
    "Alumni recognition and celebrations",
  ],
  register: "https://forms.gle/LrJUez7uEmDVQGKx9",
  nominate: "https://forms.gle/MxrWiu8oEZapRbVd6",
  details: portal + "/events/event/636190.dz",
  image: "/alumni/events/alumni-day-2025-welcome.webp",
  imageAlt: "Alumnae with their name badges, smiling together at Alumni Day 2025",
};

export type PastEvent = { title: string; when?: string; place?: string; image: string; alt: string; href: string };

export const pastEvents: PastEvent[] = [
  {
    title: "Mumbai Alumni Chapter Meet",
    when: "October 2026",
    place: "Novotel Mumbai International Airport",
    image: "/alumni/events/mumbai-chapter-2026.webp",
    alt: "SRM alumni seated around dinner tables at the Mumbai chapter meet",
    href: portal + "/albums/photos/638204.dz",
  },
  {
    title: "Silver Jubilee Reunion, 2001 batch",
    when: "2026",
    image: "/alumni/events/silver-jubilee-2001.webp",
    alt: "The 2001 batch seated in the auditorium for their Silver Jubilee reunion",
    href: portal + "/albums/photos/625819.dz",
  },
  {
    title: "Alumni Day 2025",
    when: "December 2025",
    place: "Dr. T. P. Ganesan Auditorium",
    image: "/alumni/events/alumni-day-2025.webp",
    alt: "Two alumni looking over registration papers at Alumni Day 2025",
    href: portal + "/albums/photos/577910.dz",
  },
  {
    title: "30th-year Reunion, 1995 batch",
    image: "/alumni/events/reunion-1995.webp",
    alt: "Alumni of the 1995 batch standing together in front of their reunion screen",
    href: portal + "/albums/photos/537294.dz",
  },
  {
    title: "Sports Alumni Reunion",
    when: "August 2024",
    place: "SRMIST KTR Indoor Stadium",
    image: "/alumni/events/sports-reunion-2024.webp",
    alt: "Former SRM athletes gathered for a group photo at the indoor stadium",
    href: portal + "/albums/photos/425607.dz",
  },
  {
    title: "30th-year Reunion, 1994 batch",
    when: "July 2024",
    place: "Mini Hall 1",
    image: "/alumni/events/reunion-1994.webp",
    alt: "A 1994 batch alumnus being presented with flowers on stage at the reunion",
    href: portal + "/albums/photos/412265.dz",
  },
];
