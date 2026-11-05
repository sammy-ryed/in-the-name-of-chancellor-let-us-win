export interface StudentService {
  label: string;
  href: string;
  detail: string;
}

export interface StudentServiceGroup {
  id: string;
  label: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  links: StudentService[];
  status?: string;
}

export const studentServices: StudentServiceGroup[] = [
  {
    id: "portals",
    label: "Academic portals",
    title: "Your academics. Sorted.",
    description:
      "Attendance, marks, fees and everything in between. Choose the portal for your programme.",
    image: "/home/campus.webp",
    alt: "SRM campus buildings and landscaped grounds",
    links: [
      {
        label: "Academia",
        href: "https://academia.srmist.edu.in/",
        detail: "Attendance, marks & registration · 2nd–4th year B.Tech, KTR",
      },
      {
        label: "Student Information Portal",
        href: "https://sp.srmist.edu.in/",
        detail: "Engineering & Technology · fees, services & certificates",
      },
      {
        label: "StudentConnect",
        href: "https://studentconnect.srmist.edu.in/",
        detail:
          "2025 onwards · Medicine, Law, Management, Science & Humanities; excluding PhD",
      },
      {
        label: "Exams & results",
        href: "https://www.srmist.edu.in/controller-of-examinations/",
        detail: "Examination notices, schedules & results",
      },
      {
        label: "Academic calendar",
        href: "https://www.srmist.edu.in/students/cet-academic-schedule-2026-2027-ug-pg/",
        detail: "Engineering & Technology · 2026–27 UG / PG",
      },
      {
        label: "Student gateway",
        href: "https://www.srmist.edu.in/students/",
        detail: "Find the academic system for your cohort",
      },
    ],
  },
  {
    id: "wifi",
    label: "Wi-Fi & IT",
    title: "Stay connected.",
    description:
      "Join your campus network, sign in, or get help with your SRM account.",
    image: "/home/research.webp",
    alt: "Students working in an SRM research and learning space",
    links: [
      {
        label: "IAC Connect",
        href: "https://iac.srmist.edu.in/Connect",
        detail: "Wi-Fi sign-in · academic blocks",
      },
      {
        label: "Hostel Wi-Fi",
        href: "https://iach.srmist.edu.in/connect",
        detail: "Network access · hostel residents",
      },
      {
        label: "ITKM service desk",
        href: "https://sd.srmist.edu.in/",
        detail: "Connection and account support",
      },
      {
        label: "Reset NetID password",
        href: "https://ssp.srmist.edu.in/",
        detail: "Recover access to your SRM account",
      },
    ],
  },
  {
    id: "campus",
    label: "Campus life",
    title: "More than a classroom.",
    description:
      "Find your people, your next opportunity, and the support to make it happen.",
    image: "/home/students.webp",
    alt: "SRM students spending time together on campus",
    links: [
      {
        label: "Clubs & hostels",
        href: "/campus",
        detail: "Student communities and campus living",
      },
      {
        label: "Library",
        href: "https://www.srmist.edu.in/library/",
        detail: "Catalogue, digital resources & opening hours",
      },
      {
        label: "Career Centre",
        href: "https://www.srmist.edu.in/career-centre/",
        detail: "Placements, training and career support",
      },
      {
        label: "Campus events",
        href: "https://srmist-redesign.vercel.app/events",
        detail: "Explore the university events calendar",
      },
      {
        label: "Counselling",
        href: "https://www.srmist.edu.in/life-at-srm/student-counselling-services/",
        detail: "Student wellbeing and counselling services",
      },
    ],
  },
  {
    id: "score",
    label: "SCORE",
    title: "A fresh take on SCOPE.",
    description:
      "A student-built portal for a more intuitive campus experience. While SCORE takes shape, your academic records remain available through SRM’s portals.",
    image: "/home/developer.webp",
    alt: "A student building a digital project",
    status: "In development",
    links: [
      {
        label: "Open Academia",
        href: "https://academia.srmist.edu.in/",
        detail: "Continue to your academic records",
      },
      {
        label: "Student Information Portal",
        href: "https://sp.srmist.edu.in/",
        detail: "Access existing student services",
      },
    ],
  },
];
