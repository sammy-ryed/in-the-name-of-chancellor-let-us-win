import "server-only";
import { navigation, services } from "@/lib/navigation";
import { studentServices } from "@/features/students/services";
import { clubs } from "@/features/campus/clubs";
import { finderData } from "@/features/programmes/finder/data";
import { courses, criteria, faculties } from "@/features/explore/academic";
import { programmeFee } from "@/features/explore/fee-listing";
import { siteGuides } from "./site-guides";
import hostels from "@/features/explore/hostels.json";
import headlines from "@/features/explore/headlines.json";
import events from "@/features/explore/events.json";
import { stories } from "@/features/home/content";
import { tourUrl } from "@/lib/navigation";
import type { Source } from "./types";

export type Entry = Source & { keywords?: string };

const sectionNotes: Record<string, string> = {
  Programmes:
    "Search the SRM programme finder by degree, campus, faculty or department.",
  "Campus life":
    "Explore clubs, hostel blocks, dining, culture and directions around campus.",
  Students:
    "Find the academic portal for your cohort, Wi-Fi sign-in and student support.",
  Admissions:
    "Find the right application, entrance exam schedule and eligibility guidance for your programme.",
  News: "Read campus stories, student achievements and announcements.",
  Home: "Start on the SRM homepage and explore academics, campus life and news.",
  Alumni:
    "Find alumni events, reunion photo albums, graduate profiles and the alumni network.",
  Placements:
    "Compare published placement outcomes by batch and find training and placement contacts.",
  Research:
    "Explore SRMIST research centres, funded projects, facilities and doctoral opportunities.",
  Events:
    "Use the campus calendar to see upcoming events, filter by date or find an organiser’s registration page.",
  Parents:
    "Choose ParentConnect for the 2025 intake onwards, or the earlier-batch login for older cohorts.",
};

const portalInstructions: Record<string, string> = {
  "Hostel Wi-Fi":
    "Connect to the hostel network, then open Hostel Wi-Fi below to sign in. For an academic block, use IAC Connect instead.",
  "IAC Connect":
    "Connect to the academic block’s Wi-Fi, then open IAC Connect below to reach the sign-in screen.",
  "ITKM service desk":
    "Open the ITKM service desk to report a connection problem or get help with an SRM account.",
  "Reset NetID password":
    "Use SRM’s password recovery service to reset your NetID, then sign in to your student portal again.",
};

// Address records also provide compact evidence for questions with no lexical matches.
export const universityOverview: Entry[] = [
  {
    title: "Main campus address · Kattankulathur",
    section: "Visit SRM",
    href: "https://webstor.srmist.edu.in/web_assets/downloads/2025/hand-book-2025-26.pdf",
    keywords:
      "address location directions reach visit headquarters Chennai Potheri main campus",
    summary:
      "KTR is short for Kattankulathur, SRMIST’s main campus near Chennai. Its postal address is SRM Nagar, Kattankulathur, Chengalpattu district, Tamil Nadu 603203.",
  },
  {
    title: "Ramapuram campus address",
    section: "Visit SRM",
    href: "https://webstor.srmist.edu.in/web_assets/downloads/2026/ugc-annual-report-2024-25.pdf",
    keywords: "Chennai campus location directions",
    summary:
      "The Ramapuram campus is on Bharathi Salai, Ramapuram, Chennai, Tamil Nadu 600089.",
  },
  {
    title: "Vadapalani campus address",
    section: "Visit SRM",
    href: "https://webstor.srmist.edu.in/web_assets/downloads/2026/ugc-annual-report-2024-25.pdf",
    keywords: "Chennai campus location directions",
    summary:
      "The Vadapalani campus is at No. 1, Jawaharlal Nehru Road (100 Feet Road), near Vadapalani Signal, Chennai 600026.",
  },
  {
    title: "Delhi NCR campus address · Modinagar",
    section: "Visit SRM",
    href: "https://webstor.srmist.edu.in/web_assets/downloads/2026/ugc-annual-report-2024-25.pdf",
    keywords: "Ghaziabad Modinagar Delhi NCR location directions",
    summary:
      "The Delhi NCR campus is on Delhi–Meerut Road in Modinagar, Ghaziabad, Uttar Pradesh 201204.",
  },
  {
    title: "Tiruchirappalli campus address",
    section: "Visit SRM",
    href: "https://webstor.srmist.edu.in/web_assets/downloads/2026/ugc-annual-report-2024-25.pdf",
    keywords: "Trichy Samayapuram location directions",
    summary:
      "The Tiruchirappalli campus is on the Trichy–Chennai Highway near Samayapuram, Tamil Nadu 621105.",
  },
  {
    title: "Baburayanpettai campus address",
    section: "Visit SRM",
    href: "https://webstor.srmist.edu.in/web_assets/downloads/2026/ugc-annual-report-2024-25.pdf",
    keywords: "agricultural sciences location directions",
    summary:
      "The Baburayanpettai campus is at Vendhar Nagar, Elapakkam Post, Maduranthagam Taluk, Chengalpattu district, Tamil Nadu 603201.",
  },
  {
    title: "About SRMIST",
    section: "University",
    href: "https://www.srmist.edu.in/",
    keywords: "university introduction about full name stands for",
    summary:
      "SRMIST stands for SRM Institute of Science and Technology. Its main campus is in Kattankulathur, Tamil Nadu. The programme finder lists degrees across its faculties and campuses.",
  },
];

const guides: Entry[] = [
  {
    title: "Student attendance, marks and class timetables",
    section: "Students",
    href: "/students#portals",
    keywords: "timetable schedule section attendance grades marks CGPA",
    summary:
      "Open the academic portal for your programme and intake. The student guide lists Academia for years 2–4 of B.Tech at Kattankulathur, and StudentConnect for 2025 onwards in Medicine, Law, Management and Science & Humanities (except PhD). Your department can confirm your section timetable. Personal records require sign-in.",
  },

  {
    title: "SRMJEEE exam dates",
    section: "Admissions",
    href: "/admissions#exam",
    keywords: "exam entrance deadline application schedule phases srmjee",
    summary:
      "The admissions guide lists tentative 2027 test dates of 17–18 April and 19–20 June. Its listed application deadlines are 2 April and 4 June respectively. Confirm your phase on the official application portal.",
  },
  {
    title: "B.Tech applications and eligibility",
    section: "Admissions",
    href: "/admissions#faq",
    keywords: "apply requirements admission qualification",
    summary:
      "For the regular domestic B.Tech route, the guide lists a 60% aggregate in Physics, Mathematics and an approved third subject in 10+2. Some branches accept different subject combinations. Check the eligibility for the specific programme.",
  },
  {
    title: "Apply for B.Tech / SRMJEEE",
    section: "Admissions",
    href: "/admissions#apply",
    keywords: "apply register application",
    summary:
      "Open the official B.Tech application from How to apply. Other faculties have their own admissions routes.",
  },
  {
    title: "SCORE student app",
    section: "Students",
    href: "/students#score",
    keywords: "scope app",
    summary:
      "SCORE is the student team’s app in development. Use the official student portals for your current academic records.",
  },
  {
    title: "Join a student club",
    section: "Campus life",
    href: "/campus#clubs",
    keywords: "join club clubs societies apply recruitment register",
    summary:
      "Search the club directory by name or interest. Open the club’s details to find its contact and confirm the next recruitment round with Student Affairs.",
  },
  {
    title: "Hostels and dining",
    section: "Campus life",
    href: "/campus/accommodation",
    keywords: "hostel housing booking accommodation rooms mess fees",
    summary:
      "Compare Kattankulathur hostel blocks and room types in Accommodation & dining. Use the booking schedule and hostel office links for current charges and availability.",
  },
  {
    title: "Explore the campus in 360°",
    section: "Campus life",
    href: tourUrl,
    keywords: "virtual map tour 3d walk visit",
    summary:
      "Open the SRMIST virtual tour to look around Kattankulathur before a visit.",
  },
  {
    title: "Parent portal by intake",
    section: "Parents",
    href: "/parents#parent-portals",
    keywords: "parents parentconnect login guardian",
    summary: sectionNotes.Parents,
  },
];

export function catalogue(): Entry[] {
  const guideSummaries = new Map(guides.map(guide => [guide.href, guide.summary]));
  return [
    ...universityOverview,
    ...guides,
    ...siteGuides(),
    ...[...navigation, ...services].map((item) => ({
      title: item.label,
      section: item.label,
      href: item.href,
      summary: sectionNotes[item.label],
    })),
    ...navigation.flatMap((item) =>
      (item.children ?? []).map((child) => ({
        title: child.label,
        section: item.label,
        href: child.href,
        summary:
          child.href.startsWith("/programmes?college=")
            ? "Browse the " + child.label + " programmes in SRM’s finder."
            : guideSummaries.get(child.href) ?? child.label + " in the " + item.label + " guide.",
      })),
    ),
    ...studentServices.flatMap((group) =>
      group.links.map((item) => ({
        title: item.label,
        section: "Students",
        href: item.href.replace("https://srmist-redesign.vercel.app/", "/"),
        summary: portalInstructions[item.label] ?? item.detail + ".",
        keywords: group.label,
      })),
    ),
    ...clubs.map((club) => ({
      title: club.name,
      section: "Clubs",
      href: "/campus#clubs",
      summary: club.name + " (" + club.type + "). " + club.description
        + " Open the club directory to find coordinator contacts and confirm recruitment dates."
        + (club.social ? " Its profile links to " + club.social.label + "." : ""),
      keywords: club.type + " student club society",
    })),
    ...Object.entries(hostels).flatMap(([group, rooms]) =>
      rooms.map((room) => ({
        title: room.name + " hostel",
        section: "Housing",
        href: "/campus/accommodation#g-" + group,
        summary: group + "’s accommodation in Kattankulathur. " + room.detail,
        keywords: group + " hostel rooms block housing",
      })),
    ),
    ...courses.map((c): Entry => {
      const { fee, period } = programmeFee(c);
      const qualifiers = [c.mode, c.shift].filter(Boolean).join(", ");
      return {
        title: c.degree + " " + c.name + " · " + c.campus + (qualifiers ? " · " + qualifiers : ""),
        section: "Course details",
        href: "/programmes/" + c.id,
        summary: [
          c.degree + " " + c.name + " · " + c.campus + " · " + qualifiers + ".",
          "Domestic fee listing — " + period + ": " + fee + ".",
          period === "Listed fee" && "The billing period is unspecified.",
          c.duration && "Duration: " + c.duration + ".",
          c.notes,
          criteria(c),
        ].filter(Boolean).join(" "),
        keywords: ["tuition fee eligibility duration", faculties[c.faculty], c.level, period].join(" "),
      };
    }),
    ...finderData.programmes.map((p): Entry => {
      const campuses = finderData.campuses.filter(campus => p.college.some(id => campus.colleges.includes(id)));
      const campus = campuses.map(c => c.label).join(", ");
      return {
        title: p.name,
        section: "Programme Finder",
        href: p.url,
        summary: [p.name, p.level.join(" / "), campus, p.duration].filter(Boolean).join(" · ")
          + ". Open the official programme page for its published details.",
        keywords: [campus, p.certification, p.level.join(" ")].join(" "),
      };
    }),
    ...stories.map((s) => ({
      title: s.title,
      section: "News",
      href: s.href,
      summary: s.title + ". " + s.category + ".",
    })),
    ...headlines.map((h) => ({
      title: h.title,
      section: "News",
      href: h.href,
      summary: h.title + ". Read the SRM newsroom report for the full story.",
    })),
    ...events.map((e) => ({
      title: e.title,
      section: "Events",
      href: e.url,
      summary:
        e.title +
        " is listed for " +
        e.start +
        (e.end === e.start ? "" : " to " + e.end) +
        ". Check the organiser’s page for registration.",
    })),
  ];
}
