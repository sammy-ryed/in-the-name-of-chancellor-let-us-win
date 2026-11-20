import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { campusLinks } from "@/features/campus/links";
import { Disclosure } from "@/components/Disclosure";
import { SiteFooter } from "@/components/SiteFooter";
import { BookingExperience } from "@/features/campus-visit/BookingExperience";
import { itinerary } from "@/features/campus-visit/config";
import { VisitReveal, VisitScene } from "@/features/campus-visit/VisitMotion";
import "./visit.css";
import "./refinements.css";
import "./visit-motion.css";

export const metadata = {
  title: "Schedule a Campus Visit",
  description: "Experience SRM campus life. Explore our facilities, meet our community and try the automated campus visit booking demonstration.",
};
const experiences = [
  { title: "Academic spaces", label: "Learning", image: "/campus/tech-park.webp", alt: "Students on the steps of SRM Tech Park", text: "Walk through the academic buildings and get a feel for a day of learning at SRM." },
  { title: "Research & discovery", label: "Research", image: "/research/laboratory.webp", alt: "Research facilities at SRM", text: "See where students and researchers test their ideas. Laboratory access depends on activity on the day." },
  { title: "Life between classes", label: "Community", image: "/home/clubs.webp", alt: "Students gathering along a tree-lined campus walkway", text: "Explore the shared spaces where students meet, take a break and spend time together." },
];
const faqs = [
  ["Can my parents or family come along?", "Yes. Include everyone accompanying you in your group size so each person has a place in the batch. The booking allows up to 25 people including the lead visitor, subject to remaining capacity."],
  ["How long does a campus visit take?", "The sample guided visit lasts around one hour. Plan to reach the reporting venue 15 minutes before your start time. The itinerary and access to individual facilities must be confirmed by the university."],
  ["Do I need to wait for approval?", "No. This demonstration automatically confirms your reservation once the server validates the batch and saves your booking. Your group joins the guide already assigned to that batch."],
  ["Can I cancel or reschedule my visit?", "Use the controls on your confirmation screen before the tour starts. Cancellation releases your places immediately. Rescheduling checks the new batch before moving your reservation. Download a fresh pass and replace your calendar event after a change."],
  ["What happens if a batch is full?", "A batch is unavailable when there are not enough places for your whole group. Choose another time or date. Capacity is checked again when you confirm, so a time you selected earlier may become unavailable."],
  ["Will I receive an email or an official entry permit?", "No. This website is a student redesign prototype. The demo does not send email or connect to official SRM systems. Save your downloadable demo pass and keep this browser tab open to manage your booking. Reservations disappear when the demo server restarts and must not be used to travel without official confirmation."],
  ["Can I arrange accessibility support or a larger school visit?", "Contact Admissions before planning your journey to discuss step-free routes, individual support or groups larger than 25. Accessibility arrangements and special visits are outside this demo booking service."],
];

export default function CampusVisitPage() {
  return <><VisitScene>
    <header className="cv-hero">
      <Image src="/campus/green-walkway.webp" alt="A tree-lined walkway through SRM’s Kattankulathur campus" fill sizes="100vw" priority className="cv-hero-photo"/>
      <div className="cv-hero-content">
        <Breadcrumbs className="cv-breadcrumbs" parents={[{ href: "/", label: "Home" }, { href: "/admissions", label: "Admissions" }]} current="Campus visit"/>
        <p className="cv-eyebrow">Admissions / Campus visits</p>
        <h1>Your future<br/>{" "}begins with <em>a visit.</em></h1>
        <p className="cv-hero-description">Explore Kattankulathur’s guided itinerary and try a demo booking. For a visit in person, confirm arrangements with Admissions before you travel.</p>
        <div className="cv-hero-actions"><a className="cv-button" href="#book-visit">Try a demo booking</a><Link className="cv-hero-link" href="/campus">Explore the Campus</Link></div>
      </div>
    </header>
    <nav className="cv-page-links" aria-label="Plan your campus visit"><a href="#book-visit">Demo booking</a><a href="#itinerary">Tour itinerary</a><a href="#before-arrival">Before you arrive</a></nav>

    <section className="cv-section cv-experience" id="experience" aria-labelledby="experience-title"><VisitReveal><div className="cv-section-heading"><div><p className="cv-eyebrow">Explore SRM</p><h2 id="experience-title">What you’ll experience</h2></div><p>Take a closer look at the places you could study, the work happening here and the life around it.</p></div></VisitReveal>
      <div className="cv-experience-grid">{experiences.map(e => <VisitReveal key={e.title}><figure className="cv-experience-image"><Image src={e.image} alt={e.alt} fill sizes="(max-width: 700px) 90vw, 30vw"/><figcaption>{e.label}</figcaption></figure><h3>{e.title}</h3><p>{e.text}</p></VisitReveal>)}</div>
      <div className="cv-also"><span>Also on the tour</span><ul><li>University library</li><li>Sports & recreation</li><li>Admissions counselling</li></ul></div><p className="cv-fine">Photography features SRM learning and campus life. Tour routes and access to facilities vary by campus and activity on the day.</p>
    </section>

    <section className="cv-section cv-book-section" id="book-visit" aria-labelledby="booking-title"><VisitReveal><div className="cv-section-heading"><div><p className="cv-eyebrow">Schedule a campus visit</p><h2 id="booking-title">Plan your visit</h2></div><p>Choose your campus and a time for your group.<br/>Your places are confirmed as soon as the booking is saved.</p></div></VisitReveal><BookingExperience/></section>

    <section className="cv-section cv-itinerary" id="itinerary" aria-labelledby="itinerary-title"><VisitReveal><div className="cv-section-heading"><div><p className="cv-eyebrow">Tour itinerary</p><h2 id="itinerary-title">One hour on campus</h2></div><p>From meeting your guide to talking about admissions.<br/>This sample itinerary may vary by campus.</p></div></VisitReveal><div className="cv-itinerary-grid"><figure className="cv-itinerary-photo"><Image src="/campus/srm-university-lake.webp" alt="The SRM campus beside the lake" fill sizes="(max-width: 800px) 90vw, 40vw"/><figcaption>The lake at Kattankulathur</figcaption></figure><div className="cv-timeline-wrap"><svg className="cv-route-track" viewBox="0 0 2 100" preserveAspectRatio="none" aria-hidden="true"><path className="cv-route-base" d="M1 0V100"/><path className="cv-route-progress" d="M1 0V100"/></svg><ol className="cv-timeline">{itinerary.map((item, i) => <li key={item.title}><span className="cv-timeline-index">0{i + 1}</span><div><span className="cv-eyebrow">{item.time}</span><h3>{["Arrival & verification", "Guided campus tour", "Admissions conversation", "Questions & next steps"][i]}</h3><p>{item.text}</p></div></li>)}</ol></div></div></section>

    <section className="cv-section cv-before" id="before-arrival" aria-labelledby="before-title"><VisitReveal><div className="cv-before-grid"><div><p className="cv-eyebrow">Visitor information</p><h2 id="before-title">Before you arrive</h2><p>Check your reporting venue and allow time to meet your guide. For access requirements or special arrangements, speak to Admissions before travelling.</p><a href={campusLinks.visitors} className="cv-button">Official visitor information ↗</a></div><div className="cv-arrival-list">{[{ title: "Arrive 15 minutes early", text: "Meet your group at the reporting venue shown on your pass." }, { title: "Bring your pass and photo ID", text: "Keep your QR pass ready and include everyone accompanying you in the booking." }, { title: "Plan for a walking tour", text: "Wear comfortable shoes and bring water. Ask Admissions about step-free routes or other support." }].map(item => <div key={item.title}><div><h3>{item.title}</h3><p>{item.text}</p></div></div>)}<p className="cv-policy">Sample visitor guidance: arrival times, identification requirements and access arrangements require university confirmation. Demo passes do not authorise campus entry.</p></div></div></VisitReveal></section>

    <section className="cv-section cv-faq" aria-labelledby="faq-title"><div><p className="cv-eyebrow">Planning your trip</p><h2 id="faq-title">Your questions,<br/>{" "}answered.</h2><p>Need something else?<br/><Link href="/admissions#enquiry">Talk to Admissions</Link></p></div><div className="cv-accordions">{faqs.map(([question, answer]) => <Disclosure key={question} summary={question}><p>{answer}</p></Disclosure>)}</div></section>
  </VisitScene><SiteFooter/></>;
}
