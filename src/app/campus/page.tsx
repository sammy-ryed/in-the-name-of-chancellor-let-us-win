import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { ClubDirectory } from "@/features/campus/ClubDirectory";
import { clubs } from "@/features/campus/clubs";
import { campusLinks } from "@/features/campus/links";
import hostels from "@/features/explore/hostels.json";
import events from "@/features/explore/events.json";
import { tourUrl } from "@/lib/navigation";
import { finderData } from "@/features/programmes/finder/data";
import "./campus.css";

export const metadata = {
  title: "Campus life",
  description: "Clubs, events, housing and getting around SRM's Kattankulathur campus.",
};

const blocks = Object.values(hostels).reduce((n, rooms) => n + rooms.length, 0);
const day = new Intl.DateTimeFormat("en-IN", { day: "numeric" });
const month = new Intl.DateTimeFormat("en-IN", { month: "short" });
const full = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" });
const range = (start: string, end: string) => {
  const a = new Date(start);
  const b = new Date(end);
  if (start === end) return full.format(a);
  return a.getMonth() === b.getMonth()
    ? `${day.format(a)}–${full.format(b)}`
    : `${full.format(a)} – ${full.format(b)}`;
};

function Arrow() {
  return (
    <svg className="cl-arrow" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5" />
    </svg>
  );
}

export default function Page() {
  return (
    <div className="cl-page">

      {/* 1 — Hero */}
      <header className="cl-hero">
        <Image
          src="/campus/students-hero.webp"
          alt="Four SRM students, including a medical student in a white coat, standing outside SRM Tech Park"
          fill
          priority
          sizes="100vw"
          unoptimized
        />
        <div className="cl-hero-text">
          <h1>Campus life</h1>
          <p>Clubs, fests, late-night builds and a campus that never quite switches off.</p>
        </div>
      </header>

      {/* 2 — More than a campus: asymmetric photos + statistics */}
      <section id="life" className="cl-life" aria-labelledby="life-title">
        <div className="cl-life-copy">
          <h2 id="life-title">More than a campus</h2>
          <p className="cl-lede">
            Classical dance on the main stage, league matches on the courts, a race car built in the workshop — what
            happens after class is half the education.
          </p>
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
          <p className="cl-inline-links">
            <a href={campusLinks.culture}>Arts &amp; culture</a>
            <a href={campusLinks.sports}>Sports</a>
          </p>
        </div>
        <div className="cl-life-photos">
          <figure className="cl-ph cl-ph-a">
            <Image src="/home/stage.webp" alt="A classical dancer performing on stage" fill sizes="(max-width: 760px) 60vw, 28vw" unoptimized />
            <figcaption>Classical dance on the SRM stage</figcaption>
          </figure>
          <figure className="cl-ph cl-ph-b">
            <Image src="/home/athletics.webp" alt="SRM's women's volleyball team" fill sizes="(max-width: 760px) 90vw, 30vw" unoptimized />
            <figcaption>The women’s volleyball squad</figcaption>
          </figure>
          <figure className="cl-ph cl-ph-c">
            <Image src="/home/racing.webp" alt="Team Camber Racing with its competition car" fill sizes="(max-width: 760px) 90vw, 34vw" unoptimized />
            <figcaption>Team Camber Racing</figcaption>
          </figure>
        </div>
      </section>

      {/* 3 — Find your people: club directory with a details drawer */}
      <section id="clubs" className="cl-band cl-clubs" aria-labelledby="clubs-title">
        <div className="cl-wrap">
          <div className="cl-head">
            <div>
              <h2 id="clubs-title">Find your people</h2>
            </div>
            <p>Pick something you already love, or try something new. Open any club to see how to join.</p>
          </div>
          <ClubDirectory />
        </div>
      </section>

      {/* 4 — What's happening: compact timeline */}
      <section id="whats-on" className="cl-wrap cl-events" aria-labelledby="events-title">
        <div className="cl-head">
          <div>
            <h2 id="events-title">What’s happening</h2>
          </div>
          <Link className="cl-link" href="/events">
            All events <Arrow />
          </Link>
        </div>
        <ol className="cl-timeline">
          {events.slice(0, 4).map((e) => (
            <li key={e.url}>
              <a href={e.url}>
                <time dateTime={e.start} className="cl-date">
                  <b>{day.format(new Date(e.start))}</b>
                  <span>{month.format(new Date(e.start))}</span>
                </time>
                <span className="cl-event">
                  <strong>{e.title}</strong>
                  <span>{range(e.start, e.end)}</span>
                </span>
                <Arrow />
              </a>
            </li>
          ))}
        </ol>
      </section>

      {/* 5 — Make yourself at home: photo + two navigation cards */}
      <section id="home" className="cl-home" aria-labelledby="home-title">
        <figure className="cl-home-photo">
          <Image src="/campus/tech-park.webp" alt="Students climbing the steps to SRM Tech Park" fill sizes="100vw" unoptimized />
        </figure>
        <div className="cl-wrap cl-home-body">
          <div className="cl-home-copy">
            <h2 id="home-title">Make yourself at home</h2>
            <p>
              Separate hostels for men, women and international students — {blocks} blocks, from shared rooms to AC
              rooms with attached washrooms — with mess halls and eateries across campus.
            </p>
          </div>
          <div className="cl-home-cards">
            <Link className="cl-navcard" href="/campus/accommodation">
              <strong>Accommodation</strong>
              <span>Room types, booking schedule, hostel rules and contacts.</span>
              <Arrow />
            </Link>
            <Link className="cl-navcard" href="/campus/accommodation#dining">
              <strong>Dining</strong>
              <span>Mess facilities, meals and eateries across campus.</span>
              <Arrow />
            </Link>
          </div>
        </div>
      </section>

      {/* 6 — Explore Kattankulathur: large photograph with prominent links */}
      <section id="explore" className="cl-explore" aria-labelledby="explore-title">
        {/* Soft glow: the same photograph, enlarged and blurred, fills the section behind the sharp one. */}
        <div className="cl-explore-glow" aria-hidden="true">
          <Image src="/campus/srm-university-lake.webp" alt="" fill sizes="50vw" unoptimized />
        </div>
        <figure className="cl-explore-photo">
          <Image
            src="/campus/srm-university-lake.webp"
            alt="The SRM University building above the lake at Kattankulathur"
            width={506}
            height={482}
            sizes="(max-width: 760px) 100vw, 506px"
            unoptimized
          />
        </figure>
        <div className="cl-explore-panel">
          <h2 id="explore-title">Explore Kattankulathur</h2>
          <p>Walk the campus from home, then plan how you’ll get here.</p>
          <div className="cl-explore-actions">
            <a className="cl-btn cl-btn-gold" href={tourUrl}>
              Take the 360° tour <Arrow />
            </a>
            <a className="cl-btn cl-btn-ghost" href={campusLinks.visitors}>
              Directions &amp; transport <Arrow />
            </a>
          </div>
        </div>
      </section>

      {/* 7 — Student support: compact row */}
      <section id="support" className="cl-wrap cl-support" aria-labelledby="support-title">
        <div>
          <h2 id="support-title">Student support</h2>
          <p>Know who to call before you need them.</p>
        </div>
        <ul>
          <li>
            <a href={campusLinks.safety}>
              <strong>Campus safety</strong>
              <span>Security, emergencies and getting around safely</span>
              <Arrow />
            </a>
          </li>
          <li>
            <a href={campusLinks.hostelOffice}>
              <strong>Hostel office</strong>
              <span>Rooms, fees and allotment questions</span>
              <Arrow />
            </a>
          </li>
          <li>
            <a href={campusLinks.studentAffairs}>
              <strong>Student Affairs</strong>
              <span>Clubs, activities and student concerns</span>
              <Arrow />
            </a>
          </li>
        </ul>
      </section>

      {/* 8 — Take the next step: two distinct CTA panels */}
      <section className="cl-next" aria-labelledby="next-title">
        <h2 id="next-title" className="cl-sr">
          Take the next step
        </h2>
        <Link className="cl-cta cl-cta-light" href="/programmes">
          <strong>Find your programme</strong>
          <span>Search {finderData.programmes.length} programmes across every faculty and campus.</span>
          <span className="cl-cta-go">
            Explore programmes <Arrow />
          </span>
        </Link>
        <Link className="cl-cta cl-cta-dark" href="/admissions">
          <strong>Join SRM</strong>
          <span>How to apply, SRMJEEE dates and answers to common questions.</span>
          <span className="cl-cta-go">
            Start your application <Arrow />
          </span>
        </Link>
      </section>

      <SiteFooter />
    </div>
  );
}
