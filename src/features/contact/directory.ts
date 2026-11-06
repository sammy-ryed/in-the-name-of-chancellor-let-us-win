import { admissionsEmails } from "@/features/admissions/contact";
import { campusLinks } from "@/features/campus/links";
import { srm, type NavLink } from "@/lib/navigation";

export const contactGroups = ["Admissions", "Student support", "Careers & alumni"] as const;

export type ContactOffice = {
  id: string;
  name: string;
  group: (typeof contactGroups)[number];
  description: string;
  phone: NavLink;
  email: string;
  source: NavLink;
};

const directoryHref = "https://webstor.srmist.edu.in/web_assets/downloads/2026/srmist-telephone-directory.pdf";
const directorySource: NavLink = { label: "University telephone directory", href: directoryHref };
const applicationSource: NavLink = { label: "Admissions helpdesk", href: "https://applications.srmist.edu.in/" };
const contactHref = srm + "/contact-us/";

function phone(label: string): NavLink {
  return { label, href: "tel:" + label.replaceAll(" ", "") };
}

export const generalContact = {
  phone: phone("+91 44 2741 7000"),
  email: "infodesk@srmist.edu.in",
  source: { label: "University contact details", href: contactHref },
};

export const mainCampus = {
  name: "Kattankulathur",
  address: ["SRM Nagar, Kattankulathur", "Chengalpattu District", "Tamil Nadu 603203, India"],
  mapHref: "https://www.google.com/maps/dir/?api=1&destination=SRM+Institute+of+Science+and+Technology%2C+Potheri%2C+Kattankulathur%2C+Tamil+Nadu+603203",
  visitorHref: campusLinks.visitors,
  campusesHref: directoryHref + "#page=7",
  sourceHref: contactHref,
};

export const contactOffices: ContactOffice[] = [
  {
    id: "domestic-admissions",
    name: "Engineering, agriculture & architecture",
    group: "Admissions",
    description: "For Indian applicants with questions about programmes, applications or the entrance exam.",
    phone: phone("+91 70 2645 2645"),
    email: admissionsEmails.domestic,
    source: applicationSource,
  },
  {
    id: "other-admissions",
    name: "Arts, medicine, management & law",
    group: "Admissions",
    description: "For Indian applicants to liberal arts, business, management, law, medicine, allied health or hotel management.",
    phone: phone("+91 70 2647 2647"),
    email: admissionsEmails.domestic,
    source: applicationSource,
  },
  {
    id: "international-admissions",
    name: "International & NRI admissions",
    group: "Admissions",
    description: "Ask the international admissions team about eligibility, applying from abroad or documents for your application.",
    phone: phone("+91 90031 77786"),
    email: admissionsEmails.international,
    source: { label: "International admissions FAQ", href: srm + "/admission-international/faq/" },
  },
  {
    id: "examinations",
    name: "Controller of Examinations",
    group: "Student support",
    description: "For university examination records, degree certificates and certificate verification.",
    phone: phone("+91 44 2745 2818"),
    email: "coe@srmist.edu.in",
    source: directorySource,
  },
  {
    id: "student-affairs",
    name: "Student Affairs",
    group: "Student support",
    description: "Contact the directorate about student clubs, campus activities and student-life enquiries.",
    phone: phone("+91 44 2745 6021"),
    email: "director.sa@srmist.edu.in",
    source: directorySource,
  },
  {
    id: "hostels",
    name: "Hostel helpdesk",
    group: "Student support",
    description: "For room bookings, hostel arrangements and finding the right hostel office at Kattankulathur.",
    phone: phone("+91 44 2745 3159"),
    email: "hostel.helpdesk.ktr@srmist.edu.in",
    source: { label: "Hostel contacts", href: campusLinks.hostelOffice },
  },
  {
    id: "transport",
    name: "Campus transport",
    group: "Student support",
    description: "Ask the Kattankulathur transport office about university bus routes and services.",
    phone: phone("+91 44 2741 7317"),
    email: "gm.transport@srmist.edu.in",
    source: directorySource,
  },
  {
    id: "career-centre",
    name: "Career Centre",
    group: "Careers & alumni",
    description: "For placement enquiries and employers who want to recruit at SRMIST.",
    phone: phone("+91 44 2745 5774"),
    email: "director.careercentre@srmist.edu.in",
    source: directorySource,
  },
  {
    id: "alumni-affairs",
    name: "Alumni Affairs",
    group: "Careers & alumni",
    description: "Get in touch about the alumni network, reunions or ways to stay involved after graduation.",
    phone: phone("+91 44 2745 6726"),
    email: "director.alumni@srmist.edu.in",
    source: directorySource,
  },
];
