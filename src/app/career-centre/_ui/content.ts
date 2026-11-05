export const sources = {
  career: "https://www.srmist.edu.in/career-centre/",
  categories: "https://www.srmist.edu.in/placements/catapulting-careers/",
  prospectus: "https://webstor.srmist.edu.in/web_assets/downloads/2025/srmist-university-prospectus-2025-26.pdf#page=37",
  activities: "https://www.srmist.edu.in/placements/activities/",
  cdc: "https://www.srmist.edu.in/department/cet-cdc/",
  contact: "https://www.srmist.edu.in/placements/leadership-contact/",
};

// Verbatim excerpts from SRM's testimonials; summaries are paraphrases.
// Upload dates are not used to infer a student's placement year or job title.
export const stories = [
  { name: "Madhu Shree Aravindan", department: "B.Tech. Computer Science & Engineering", company: "Google", image: "Madhu-Shree-Aravindan", quote: "strengthening our interview readiness", summary: "Madhu credits technical practice, aptitude preparation and support from her faculty and Career Centre for helping her approach the interview process with confidence." },
  { name: "Shreyansh Rajesh Kumbhare", department: "B.Tech. Computer Science & Engineering", company: "Amazon", image: "Shreyansh-Rajesh-Kumbhare", quote: "well-planned mock interviews, practice assessments, and continuous feedback", summary: "Shreyansh describes how structured preparation and regular feedback helped him develop the technical skills and confidence to secure an on-campus offer." },
  { name: "Vijaya Lakshmi Das", department: "Master of Computer Applications", company: "Adobe", image: "Vijaya-Lakshmi-Das", quote: "a clear and steady preparation path", summary: "Vijaya’s internship led to a full-time opportunity at Adobe. She reflects on the faculty guidance and career preparation that supported that transition." },
  { name: "Ujjwal Kumar Singh", department: "BCA, Data Science · Delhi-NCR · 2023–26", company: "D. E. Shaw India", image: "Ujjwal-Kumar-Singh", quote: "proud milestone", summary: "Ujjwal received a Super Dream offer at D. E. Shaw. He highlights practical learning, real-world data problems and sustained support from his faculty and placement team." },
];

export const training = [
  { title: "Find your direction", tag: "Career Development Centre", text: "Identify your interests, recognise your strengths and develop a career plan with guidance from the Career Development Centre.", detail: "CDC supports career planning, personality development and leadership skills, alongside academic progression.", href: sources.cdc, image: "industry", alt: "Students attending SRM’s Wells Fargo leadership talk", caption: "Leadership Talk / Wells Fargo" },
  { title: "Build your foundations", tag: "Aptitude & technical training", text: "Work on quantitative and verbal aptitude, then develop technical skills aligned with industry requirements.", detail: "CDC provides aptitude preparation for placement tests and competitive examinations, with industry-oriented technical training for pre-final-year students.", href: sources.cdc, image: "training", alt: "Students participating in SRM’s Hyperverge coding hiring challenge", caption: "36-Hour Coding Hiring Challenge / Hyperverge" },
  { title: "Make yourself heard", tag: "Communication & interviews", text: "Develop your soft skills and put preparation into practice through assessments, group discussions and mock interviews.", detail: "SRM’s preparation combines professional skills with interview practice. Student accounts describe regular feedback and structured mock assessments.", href: sources.career, image: "industry", alt: "An industry speaker addressing SRM students at a leadership session", caption: "Industry perspectives / Career Centre activities" },
  { title: "Step into industry", tag: "Internships & industry exposure", text: "Explore internship opportunities, industrial visits, expert talks and hands-on events that bring professional life closer.", detail: "The Career Centre’s activities include an internship fair, hackathons and industry talks. Academic Interfacing Programs connect industry partners and the academic community.", href: sources.activities, image: "internships", alt: "Participants at SRM’s Internship Fair 2026", caption: "Internship Fair / 2026" },
  { title: "Turn preparation into possibility", tag: "Academic Interface Programmes & placements", text: "Connect classroom learning with industry expectations through Academic Interfacing Programs and campus recruitment preparation.", detail: "AIP supports collaboration and industry-endorsed certifications. The placement office facilitates pre-placement lectures, written tests, group discussions and interviews.", href: sources.prospectus, image: "training", alt: "SRM students working together during an industry coding challenge", caption: "Practice, collaboration & industry exposure" },
];

export const resources = [
  { title: "Placement reports", note: "Official statistics and published placement records", href: "https://www.srmist.edu.in/placements/placement-statistics/" },
  { title: "Student placement support", note: "Sign in for your cohort’s eligibility and company information", href: "https://sp.srmist.edu.in/" },
  { title: "Recruiter enquiries", note: "Connect with the Career Centre’s placement team", href: "mailto:placement@srmist.edu.in?subject=Recruiter%20enquiry" },
  { title: "Industry collaborations", note: "Explore SRM’s connections with industry", href: "https://www.srmist.edu.in/placements/industry-collaborations/" },
  { title: "2025–26 university prospectus", note: "Recruiter sectors and historical 2023 placement figures · p. 37", href: sources.prospectus },
  { title: "Work at SRM", note: "University staff vacancies and faculty recruitment", href: "https://careers.srmist.edu.in/careerportal/careerportal/loginManager/applyJobs.jsp" },
  { title: "University brochure archive · 2024–25", note: "2023 batch: 13,069 offers, 3,970 high-paying offers, ₹1 crore highest and ₹10.5 LPA average · p. 25", href: "https://webstor.srmist.edu.in/web_assets/downloads/2024/srmist-university-brochure-2024-25.pdf#page=25" },
  { title: "Departmental Super Dream archive", note: "Networking & Communications bulletin · December 2021 · historical offer examples", href: "https://webstor.srmist.edu.in/web_assets/downloads/2022/netcomm-bulletin-december-2021.pdf" },
];
