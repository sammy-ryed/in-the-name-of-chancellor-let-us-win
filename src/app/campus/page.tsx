import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/navigation";
import { Rail } from "@/features/home/Rail";
import { ClubCards } from "@/features/campus/ClubCards";
import { clubs } from "@/features/campus/clubs";
import hostels from "@/features/explore/hostels.json";
import events from "@/features/explore/events.json";
import { srm, tourUrl } from "@/features/home/content";
import "./campus.css";

export const metadata = {
  title: "Campus life",
  description: "Clubs, hostels, events and getting around SRM's Kattankulathur campus.",
};

const hostelPage: Record<string, string> = {
  Men: "hostel-for-men",
  Women: "hostel-for-women",
  International: "international-hostel",
};
const blocks = Object.values(hostels).reduce((n, rooms) => n + rooms.length, 0);
const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });
const when = (start: string, end: string) => {
  const a = dateFmt.format(new Date(start));
  return start === end ? a : `${a} – ${dateFmt.format(new Date(end))}`;
};

function More({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("http");
  return (
    <Link className="cl-more" href={href}>
      {children}
      <span aria-hidden="true">{external ? " ↗" : " →"}</span>
    </Link>
  );
}

export default function Page() {
  return (
    <div className="cl-page s-chrome">
      <Rail current="Campus life" scrollHref="#people" />

      {/* 1 — Full-bleed photo hero */}
      <header className="cl-hero">
        <Image
          src="/home/film.webp"
          alt="SRM students celebrating beside the robot they built"
          fill
          priority
          sizes="100vw"
          unoptimized
        />
        <div className="cl-hero-text">
          <Link href="/" className="cl-crumb">
            SRMIST / Home
          </Link>
          <h1>Campus life</h1>
        </div>
      </header>
      <p className="cl-lede">
        Life at Kattankulathur keeps moving after class. Join a club, find your hostel block, catch a fest or a
        workshop, and get to know the campus before you arrive.
      </p>

      {/* 2 — Find your people: real counts from the site's own data */}
      <section id="people" className="cl-people" aria-labelledby="people-title">
        <div>
          <h2 id="people-title">Find your people</h2>
          <p>
            From the Rotaract Club to Astrophilia, student clubs are where most friendships at SRM start. Pick one that
            matches what you already love, or try something new.
          </p>
        </div>
        <dl className="cl-stats">
          <div>
            <dt>Student clubs</dt>
            <dd>{clubs.length}</dd>
          </div>
          <div>
            <dt>Hostel blocks</dt>
            <dd>{blocks}</dd>
          </div>
          <div>
            <dt>Upcoming events</dt>
            <dd>{events.length}</dd>
          </div>
        </dl>
      </section>

      {/* 3 — Housing & dining: copy + links beside a photo */}
      <section id="housing" className="cl-split" aria-labelledby="housing-title">
        <div className="cl-split-text">
          <h2 id="housing-title">Housing &amp; dining</h2>
          <p>
            Kattankulathur has separate hostel blocks for men, women and international students, from shared non-AC
            rooms to AC rooms with attached washrooms. Allocation, availability and charges depend on your intake and
            booking round.
          </p>
          <ul className="cl-links">
            <li>
              <More href={srm + "/srm-hostels/#hostel-announcement"}>Check the booking schedule</More>
            </li>
            <li>
              <More href="https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp">
                Open hostel booking
              </More>
            </li>
            <li>
              <More href={srm + "/srm-hostels/dining-eateries/"}>Dining &amp; eateries</More>
            </li>
            <li>
              <More href="https://webstor.srmist.edu.in/web_assets/downloads/2026/srm-hostel-rules-2026.pdf">
                Hostel rules 2026
              </More>
            </li>
          </ul>
        </div>
        <div className="cl-split-media">
          <Image
            src="/home/campus.webp"
            alt="Aerial panorama of the Kattankulathur campus"
            fill
            sizes="(max-width: 760px) 100vw, 55vw"
            unoptimized
          />
        </div>
      </section>
      <div className="cl-hostels">
        {Object.entries(hostels).map(([group, rooms]) => (
          <section key={group} aria-labelledby={`h-${group}`}>
            <h3 id={`h-${group}`}>
              {group} <span>{rooms.length} blocks</span>
            </h3>
            <ul>
              {rooms.map((r) => (
                <li key={r.name}>
                  <strong>{r.name}</strong> {r.detail}
                </li>
              ))}
            </ul>
            <More href={`${srm}/srm-hostels/${hostelPage[group]}/`}>Contacts &amp; floor plans</More>
          </section>
        ))}
      </div>

      {/* 4 — Dark photo band with a captioned mosaic */}
      <section id="after-class" className="cl-energy" aria-labelledby="energy-title">
        <div className="cl-energy-text">
          <h2 id="energy-title">After class</h2>
          <p>
            Classical dance on the main stage, league matches on the courts, a race car built in the workshop. There is
            always something happening on campus.
          </p>
          <ul className="cl-links">
            <li>
              <More href={srm + "/life-at-srm/culture/"}>Arts &amp; culture</More>
            </li>
            <li>
              <More href={srm + "/sports/"}>Sports</More>
            </li>
          </ul>
        </div>
        <div className="cl-mosaic">
          <figure className="cl-tall">
            <Image src="/home/stage.webp" alt="A classical dancer performing on stage" fill sizes="30vw" unoptimized />
            <figcaption>Classical dance on the SRM stage</figcaption>
          </figure>
          <figure>
            <Image src="/home/athletics.webp" alt="SRM's women's volleyball team" fill sizes="30vw" unoptimized />
            <figcaption>The women&rsquo;s volleyball squad</figcaption>
          </figure>
          <figure>
            <Image
              src="/home/racing.webp"
              alt="Team Camber Racing with its competition car"
              fill
              sizes="30vw"
              unoptimized
            />
            <figcaption>Team Camber Racing</figcaption>
          </figure>
        </div>
      </section>

      {/* 5 — Large photo with an overlapping colour box */}
      <section id="explore" className="cl-feature" aria-labelledby="explore-title">
        <div className="cl-feature-media">
          <Image
            src="/home/research.webp"
            alt="The Sir C. V. Raman Block on campus"
            fill
            sizes="(max-width: 760px) 100vw, 60vw"
            unoptimized
          />
        </div>
        <div className="cl-feature-box">
          <h2 id="explore-title">Explore Kattankulathur</h2>
          <p>Walk the campus from home with the 360° tour, then plan how you&rsquo;ll get here.</p>
          <ul className="cl-links">
            <li>
              <More href={tourUrl}>Take the 360° tour</More>
            </li>
            <li>
              <More href={srm + "/visitors/"}>Directions &amp; transport</More>
            </li>
          </ul>
        </div>
      </section>

      {/* 6 — Clubs as tilted cards */}
      <section id="clubs" className="cl-club-section" aria-labelledby="clubs-title">
        <div className="cl-section-head">
          <h2 id="clubs-title">Clubs &amp; organisations</h2>
          <p>Make friends, grow a passion or learn something new. Tap any card to see how to join.</p>
        </div>
        <ClubCards />
      </section>

      {/* 7 — What's on: dated list */}
      <section id="whats-on" className="cl-events" aria-labelledby="events-title">
        <div className="cl-section-head">
          <h2 id="events-title">What&rsquo;s on</h2>
          <More href="/events">All events</More>
        </div>
        <ol>
          {events.slice(0, 4).map((e) => (
            <li key={e.url}>
              <a href={e.url}>
                <time dateTime={e.start}>{when(e.start, e.end)}</time>
                <span>{e.title}</span>
                <b aria-hidden="true">↗</b>
              </a>
            </li>
          ))}
        </ol>
      </section>

      {/* 8 — Safety */}
      <section id="safety" className="cl-safety" aria-labelledby="safety-title">
        <h2 id="safety-title">Safety &amp; support</h2>
        <div>
          <p>
            Know who to call before you need them. Campus safety, hostel wardens and Student Affairs are there for
            everyday questions and emergencies alike.
          </p>
          <ul className="cl-links">
            <li>
              <More href={srm + "/life-at-srm/getting-around-campus-safety/"}>Campus safety</More>
            </li>
            <li>
              <More href={srm + "/srm-hostels/#hostels-contact"}>Hostel office</More>
            </li>
            <li>
              <More href="https://www.srmist.edu.in/directorate-of-student-affairs/">Student Affairs</More>
            </li>
          </ul>
        </div>
      </section>

      {/* 9 — Keep exploring / Take the next step */}
      <nav className="cl-next" aria-label="Keep exploring">
        <div>
          <h2>Keep exploring</h2>
          <ul>
            <li>
              <Link href="/programmes">Programmes</Link>
            </li>
            <li>
              <Link href="/students">Student services</Link>
            </li>
            <li>
              <Link href="/events">Events</Link>
            </li>
          </ul>
        </div>
        <div>
          <h2>Take the next step</h2>
          <ul>
            <li>
              <Link href="/admissions">Apply to SRM</Link>
            </li>
            <li>
              <a href={srm + "/visitors/"}>Visit campus ↗</a>
            </li>
            <li>
              <a href={srm + "/contact-us/"}>Contact SRM ↗</a>
            </li>
          </ul>
        </div>
      </nav>

      <footer className="cl-foot">
        <Link href="/">SRMIST / Home</Link>
        <nav aria-label="More services">
          {services.map((a) => (
            <Link key={a.href} href={a.href}>
              {a.label}
            </Link>
          ))}
        </nav>
      </footer>
    </div>
  );
}
