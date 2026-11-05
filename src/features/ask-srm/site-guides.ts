import { sources as careerSources, stories as placementStories, training } from "@/app/career-centre/_ui/content";
import recruiters from "@/app/career-centre/_ui/all-recruiters.json";
import { recruiterCategories } from "@/app/career-centre/_ui/recruiter-categories";
import { centreGroups, facilities, projects, sources as researchSources, statistics } from "@/app/research/content";
import { alumniDay, alumniLinks, alumniOffice, notableAlumni } from "@/features/alumni/data";
import { campusLinks } from "@/features/campus/links";
import { routes, srm } from "@/lib/navigation";
import type { Entry } from "./catalogue";

type Guide = [title: string, href: string, summary: string, keywords?: string];
function section(section: string, items: Guide[]): Entry[] {
  return items.map(([title, href, summary, keywords]) => ({ section, title, href, summary, keywords }));
}

export function siteGuides(): Entry[] {
  return [
    ...section("University", [
      ["SRM's history and name", "https://webstor.srmist.edu.in/web_assets/downloads/2020/ent-hand-book-2020-2021.pdf", "Sri Ramasamy Memorial Engineering College began in Kattankulathur in the 1985–86 academic year. SRM Institute of Science and Technology (SRMIST), formerly SRM University, dates to 2002.", "founded established origin full form stands for"],
      ["SRM motto", "https://webstor.srmist.edu.in/web_assets/downloads/2025/ugc-annual-report-2023-24.pdf", "SRMIST uses “Learn. Leap. Lead.” on its annual report.", "slogan tagline"],
      ["NIRF rankings in 2025", "https://webstor.srmist.edu.in/web_assets/downloads/2026/flipbook/srmist-institutional-development-plan/files/basic-html/page11.html", "In NIRF 2025, SRMIST ranked 11th in the University category, 14th in Engineering, 10th in Pharmacy, 18th in Medical and 25th in Research. Rankings depend on the year and category.", "rank ranking nirf"],
    ]),
    ...section("Admissions", [
      ["International and NRI admissions", routes.international.href, "Foreign nationals, NRIs and NRI-sponsored applicants use the international application. The international admissions page links to its own eligibility and fee schedule. For questions about applicant category, email admissions.ir@srmist.edu.in.", "foreign overseas nri international application tuition fee eligibility"],
      ["Contact admissions", "/admissions#enquiry", "Use the admissions enquiry form or email admissions.india@srmist.edu.in for domestic applicants. International applicants can email admissions.ir@srmist.edu.in.", "phone email help contact counsellor"],
      ["SRMJEEE application fee", "/admissions#faq", "The admissions guide lists a non-refundable ₹1,400 application fee per phase for the 2027 B.Tech SRMJEEE. This is a registration charge, separate from tuition. Confirm before paying on the application portal.", "entrance exam registration payment refund"],
      ["Engineering scholarships and financial aid", srm + "/admission-india/engineering/scholarships/", "Open the engineering scholarships list and check the academic, entrance or other criteria for the specific award. Eligibility and renewal depend on the scheme.", "discount concession waiver merit aid renewal"],
      ["Find a course that fits", routes.finder.href, "The course finder quiz asks about your interests and study preferences, then suggests undergraduate programmes. Its shortlist links to the course, campus and fee details.", "quiz unsure pick choose recommend interest career confused 12th school"],
      ["Compare programme fees and eligibility", routes.fees.href, "Choose up to three programmes in the fee catalogue. Compare campus, degree, timing, entry requirements, and the published fee period. A listed fee with no period should be confirmed with the faculty. Domestic tuition excludes hostel charges and does not establish an international fee.", "comparison shortlist cost cheaper cheapest budget tuition amount semester annual total campus fees"],
    ]),
    ...section("Parents", [
      ["Parent portal · ParentConnect for 2025 intake onwards", "https://parentconnect.srmist.edu.in/", "For 2025 intake onwards, use the parent or guardian email registered during enrolment. Select Forgot Password on ParentConnect to receive a setup email.", "parent portal sign in login first password guardian reset registration"],
      ["Parent portal · 2024 intake and earlier", "https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/parentLogin.jsp", "Parents of students admitted before the 2025 intake use the earlier Parent Portal.", "2024 2023 2022 older previous intake batch guardian portal"],
      ["Parent attendance and marks", "/parents#records", "In ParentConnect (2025 intake onwards), choose Course beside the student's name. Open Attendance for each course or Marks for examination marks.", "guardian parent absences grades attendance marks child son daughter"],
      ["Find your faculty advisor (FA)", "/parents#records", "Check the student dashboard for an assigned mentor or class coordinator. If the contact is missing, ask the department for the faculty advisor with the student's registration number, programme and section. The parent guide links to the staff directory.", "advisor adviser fa number phone contact mentor parent"],
      ["Tuition and hostel payment receipts", "/parents#records", "In ParentConnect for 2025 onwards, open Fees beside the student's name. Choose Online Payment Receipt for past payments, or Academic Fees and Hostel Fees to review the charges separately.", "parent paid bill invoice receipt guardian download"],
      ["Family visits and campus transport", "/parents#family-visits", "The family guide links to official visitor directions, university transport and bus routes, exam notices, scholarships and hostel arrangements.", "parent visit transport buses travel bus route"],
      ["Family support and safety contacts", "/parents#family-support", "For residential concerns, use the hostel office. The family guide links to the Information Centre, counselling, anti-ragging and anti-discrimination teams.", "parents help ragging bullying discrimination complaint"],
    ]),
    ...section("Campus life", [
      ["Aaruush and Milan festivals", routes.festivals.href, "Aaruush is SRM’s technical festival for student projects and competitions. Milan is its cultural festival for performances and intercollegiate competitions. Use the organisers' pages for the schedule and registration.", "aarush fest cultural techfest festival music dance"],
      ["Book a hostel room", routes.housing.href + "#booking", "At Kattankulathur, check the booking schedule for your intake, read the hostel rules and book on the student portal once your round opens. Room allocation, prices and availability vary by booking round.", "hostel accommodation housing room vacancy allotment room rent charges hostel fees freshers"],
      ["Hostel mess and campus food", routes.housing.href + "#dining", "Hostel residents use mess halls, and the campus also has eateries. The university dining page lists meals, timings and outlets.", "cafeteria meals food hall dining"],
      ["Hostel charges and office contacts", campusLinks.hostelOffice, "The hostel office handles questions about rooms, current hostel charges and allotment. Confirm the charge for your block and booking round with the office.", "warden hostel fees price cost contact phone complaint rent"],
      ["Visit campus and find directions", campusLinks.visitors, "Use SRM’s visitor information to plan your trip to Kattankulathur. The main campus is in SRM Nagar, Chengalpattu district, Tamil Nadu 603203.", "travel directions transport getting there visitor address"],
      ["Campus sports", campusLinks.sports, "SRM’s sports page covers university sports and athletics. The campus guide also links to Student Affairs, which can help with clubs and activities.", "athletics sports games gym"],
    ]),
    ...section("Career Centre", [
      ["Placement results for the 2026 graduating batch", routes.outcomes.href, "SRM’s Career Centre snapshot for the 2026 batch reports 10,969+ offers, 1,701 roles and 5,499+ high-paying offers. The highest CTC was ₹60 lakh per annum and the average was ₹7.47 lakh per annum. These are university-wide figures; multiple offers may go to one student. The reporting date is unspecified.", "placement statistics highest average CTC salary package offers LPA overall"],
      ["Dream, Super Dream and Marquee offers", careerSources.categories, "SRM lists Dream offers at ₹5 lakh per annum and above, Super Dream at ₹10 lakh and above, and Marquee at ₹20 lakh and above. Published examples include Deloitte, Microsoft and Adobe respectively. A category example is not an open position or a guaranteed package.", "placement company packages threshold category"],
      ["Campus recruiters by industry", routes.recruiters.href, `SRM’s recruiter gallery lists ${recruiters.length} companies. Browse technology, consulting, finance, data and analytics, engineering and industry, or healthcare. Confirm current openings and eligibility through your cohort’s placement portal.`, "companies employers recruit campus recruitment visit placements"],
      ...Object.entries(recruiterCategories).map(([category, files]): Guide => {
        const names = recruiters.filter(company => (files as readonly string[]).includes(company.file)).map(company => company.name.replace(/_/g, " "));
        return [category + " recruiters", routes.recruiters.href, "Names in the " + category + " directory include " + names.join(", ") + ". Directory membership describes published recruiters, not vacancies or campus-specific offers.", names.join(" ")];
      }),
      ...placementStories.map((story): Guide => [story.name + " · " + story.company, careerSources.career, story.department + ". " + story.summary, "student placement story " + story.company]),
      ...training.map((item): Guide => [item.tag, item.href, item.text + " " + item.detail, "placement career " + item.tag]),
    ]),
    ...section("Research", [
      ["Research centres, labs and shared facilities", "/research#facilities", "SRM's facilities guide covers " + facilities.map(f => f.title).join(", ") + ". The Central Instrumentation Facilities portal is the place to request instrument time.", "research facilities available labs equipment booking instrumentation"],
      ["Research statistics and patents", "/research#glance", "The SRMIST 2025–26 prospectus reports " + statistics.map(([value, label]) => value + " " + label).join(", ") + ". This is a historical snapshot.", "number total research papers published citations patents funded projects funding scholars H-index"],
      ...centreGroups.map((group): Guide => [group.title + " research centres", "/research#centres", "The SRMIST 2025–26 prospectus lists these centres: " + group.centres.join("; ") + ".", group.centres.join(" ")]),
      ...centreGroups.flatMap(group => group.centres.map((name): Guide =>
        [name, "/research#centres", name + " is listed in SRMIST's 2025–26 prospectus under the research centres. Explore the centre directory or consult the prospectus for its listing.", "research centre laboratory facility " + group.title])),
      ...projects.map((item): Guide => [item.title, item.source, `${item.description} Sponsor: ${item.agency}. Funding: ${item.funding}.${item.fundingNote ? ' ' + item.fundingNote : ''} Source: ${item.year}.`, "research project " + item.field]),
      ...facilities.map((item): Guide => [item.title, item.href, item.description, "research facility laboratory instrumentation booking"]),
      ["Research opportunities, PhD and fellowships", "/research#opportunities", "The Research guide links to doctoral applications, research grant and fellowship policy, scholar regulations and Research Day. Check deadlines and conditions on the relevant official page.", "research funding fellowship scholarship apply phd doctoral supervisor"],
      ["Patent protection and technology transfer", researchSources.ciap, "The Centre for Intellectual Asset Protection helps with intellectual property, licensing and commercialisation.", "patents IP CIAP innovation incubation"],
    ]),
    ...section("Alumni", [
      [alumniDay.title, alumniDay.details, `${alumniDay.title} is scheduled for ${alumniDay.dateLabel}, ${alumniDay.time} at ${alumniDay.venue}. ${alumniDay.closes}`, "reunion batchmate register time date tickets"],
      ["Notable alumni", routes.graduates.href, "SRM’s published profiles feature " + notableAlumni.map(person => person.name).join(", ") + ". Explore their degrees and achievements in the gallery.", "famous graduates prominent people studied"],
      ...notableAlumni.map((person): Guide => [person.name, routes.graduates.href, `SRM’s alumni profile lists ${person.degree}${person.year ? ", class of " + person.year : ""}. Field: ${person.field}. ${person.achievement}`, "notable graduate alumnus alumna"]),
      ["Join the alumni network", alumniLinks.register, "Register on the SRMIST Alumni Network to reconnect with graduates. The Directorate of Alumni Affairs lists " + alumniOffice.phones.join(" and ") + " for enquiries.", "sign up alumni contact number register membership"],
      ["Alumni mentoring", alumniLinks.mentor, "Graduates can offer mentoring through the alumni network's mentoring page.", "volunteer alumni mentor"],
    ]),
  ];
}
