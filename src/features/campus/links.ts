import { srm } from "@/lib/navigation";

/** Official SRMIST pages the campus pages link to. */
export const campusLinks = {
  bookingSchedule: srm + "/srm-hostels/#hostel-announcement",
  bookingPortal: "https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp",
  hostelRules: "https://webstor.srmist.edu.in/web_assets/downloads/2026/srm-hostel-rules-2026.pdf",
  hostelOffice: srm + "/srm-hostels/#hostels-contact",
  hostels: srm + "/srm-hostels/",
  dining: srm + "/srm-hostels/dining-eateries/",
  safety: srm + "/life-at-srm/getting-around-campus-safety/",
  studentAffairs: srm + "/directorate-of-student-affairs/",
  culture: srm + "/life-at-srm/culture/",
  sports: srm + "/sports/",
  visitors: srm + "/visitors/",
};

/** Official page for each hostel group (block contacts and floor plans). */
export const hostelGroupPage: Record<string, string> = {
  Men: srm + "/srm-hostels/hostel-for-men/",
  Women: srm + "/srm-hostels/hostel-for-women/",
  International: srm + "/srm-hostels/international-hostel/",
};
