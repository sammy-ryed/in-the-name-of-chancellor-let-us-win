import { Breadcrumbs } from "@/components/Breadcrumbs";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { campusLinks, hostelGroupPage } from "@/features/campus/links";
import hostels from "@/features/explore/hostels.json";
import "../campus.css";

export const metadata = {
  title: "Accommodation & dining",
  description:
    "Hostel blocks, room types, booking schedule, hostel rules, dining and contacts for SRM's Kattankulathur campus.",
};

const groups = Object.entries(hostels) as [string, { name: string; detail: string }[]][];
const blocks = groups.reduce((n, [, rooms]) => n + rooms.length, 0);
const groupLabel: Record<string, string> = {
  Men: "Hostels for men",
  Women: "Hostels for women",
  International: "International students",
};

export default function Page() {
  return (
    <div className="cl-page">

      <header className="ac-hero">
        <div className="cl-wrap">
          <Breadcrumbs
            className="ac-crumb"
            parents={[{ href: "/campus", label: "Campus life" }]}
            current="Accommodation & dining"
          />
          <h1>Accommodation &amp; dining</h1>
          <p className="cl-lede">
            {blocks} hostel blocks at Kattankulathur for men, women and international students, with mess halls and
            eateries across campus. Room allocation, availability and charges depend on your intake and booking round.
          </p>
          <ul className="ac-jump" aria-label="On this page">
            <li><a href="#booking">Booking</a></li>
            <li><a href="#blocks">Hostel blocks</a></li>
            <li><a href="#dining">Dining</a></li>
            <li><a href="#contacts">Contacts</a></li>
          </ul>
        </div>
      </header>

      {/* Booking: the three steps, in order */}
      <section id="booking" className="cl-wrap ac-section" aria-labelledby="booking-title">
        <h2 id="booking-title">Booking a room</h2>
        <ol className="ac-steps">
          <li>
            <strong>Check the booking schedule</strong>
            <span>Booking opens in rounds. Allocation, availability and charges depend on your intake and round.</span>
            <a href={campusLinks.bookingSchedule}>Booking schedule ↗</a>
          </li>
          <li>
            <strong>Read the hostel rules</strong>
            <span>Read the university’s 2026 hostel rules before you book.</span>
            <a href={campusLinks.hostelRules}>Hostel rules 2026 (PDF) ↗</a>
          </li>
          <li>
            <strong>Book through the student portal</strong>
            <span>Book your room on the student portal once your round opens.</span>
            <a href={campusLinks.bookingPortal}>Open hostel booking ↗</a>
          </li>
        </ol>
      </section>

      {/* Every block and its rooms */}
      <section id="blocks" className="cl-wrap ac-section" aria-labelledby="blocks-title">
        <div className="cl-head">
          <h2 id="blocks-title">Hostel blocks</h2>
          <p>Room types by block. Confirm current availability and charges on the official hostel pages.</p>
        </div>
        <div className="ac-groups">
          {groups.map(([group, rooms]) => (
            <section key={group} className="ac-group" aria-labelledby={`g-${group}`}>
              <h3 id={`g-${group}`}>
                {groupLabel[group] ?? group} <span>{rooms.length} blocks</span>
              </h3>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Block</th>
                    <th scope="col">Rooms</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((r) => (
                    <tr key={r.name}>
                      <th scope="row">{r.name}</th>
                      <td>{r.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <a className="cl-link" href={hostelGroupPage[group]}>
                Block contacts &amp; floor plans ↗
              </a>
            </section>
          ))}
        </div>
      </section>

      {/* Dining */}
      <section id="dining" className="ac-dining" aria-labelledby="dining-title">
        <figure>
          <Image src="/home/students.webp" alt="Students walking together on campus" fill sizes="(max-width: 760px) 100vw, 50vw" unoptimized />
        </figure>
        <div>
          <p className="cl-kicker">Dining</p>
          <h2 id="dining-title">Mess halls &amp; eateries</h2>
          <p>
            Mess facilities serve hostel residents, and there are eateries across the campus. Meals, timings and outlets
            are listed on the university’s dining page.
          </p>
          <a className="cl-btn cl-btn-primary" href={campusLinks.dining}>
            Dining &amp; eateries ↗
          </a>
        </div>
      </section>

      {/* Contacts */}
      <section id="contacts" className="cl-wrap cl-support" aria-labelledby="contacts-title">
        <div>
          <h2 id="contacts-title">Contacts</h2>
          <p>Questions about rooms, fees or allotment.</p>
        </div>
        <ul>
          <li>
            <a href={campusLinks.hostelOffice}>
              <strong>Hostel office</strong>
              <span>Rooms, fees and allotment</span>
            </a>
          </li>
          <li>
            <a href={campusLinks.hostels}>
              <strong>SRM hostels</strong>
              <span>Official hostel information and announcements</span>
            </a>
          </li>
          <li>
            <Link href="/campus">
              <strong>Back to campus life</strong>
              <span>Clubs, events and exploring Kattankulathur</span>
            </Link>
          </li>
        </ul>
      </section>

      <SiteFooter />
    </div>
  );
}
