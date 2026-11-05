import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { Film } from "@/features/home/Film";
import { Choreography } from "@/features/home/Choreography";
import { NewsReel } from "@/features/home/NewsReel";
import { community } from "@/features/home/content";
import { actions, tourUrl } from "@/lib/navigation";
import "./home.css";
import "./home-scenes.css";

export const metadata = { title: "Life at SRM" };
const disciplines = [
  "Engineering",
  "Medicine",
  "Architecture",
  "Science & Humanities",
  "Law",
  "Agriculture",
];
function Headline({ primary = false }: { primary?: boolean }) {
  const Tag = primary ? "h1" : "div";
  return (
    <Tag className="s-headline" aria-hidden={primary ? undefined : true}>
      <span>Ready for</span> <span>life at SRMIST?</span>
    </Tag>
  );
}
function Arrow() {
  return <span className="s-arrow" aria-hidden="true" />;
}
export default function Page() {
  return (
    <div className="s-home">
      <Choreography />
      <div className="s-opening">
        <div className="s-stage">
          <section aria-label="Life at SRM" className="s-hero s-lines">
            <Headline primary />
            <div className="s-hero-arrow">
              <Arrow />
            </div>
            <div className="s-intro-pane">
              <Headline />
              <div className="s-opening-note">
                <p>Where a classroom idea can become a race car.</p>
                <small>
                  Meet the people building, testing and starting over at SRM.
                </small>
              </div>
            </div>
            <div className="s-film-pane">
              <Film />
              <Headline />
            </div>
          </section>
          <section className="s-academics" aria-labelledby="academics-title">
            <div className="s-acad-interior">
              <h2 id="academics-title" className="s-block-title">
                Big ideas.
                <br />
                Built
                <br />
                here.
              </h2>
              <div className="s-acad-note">
                <p className="s-serif">
                  Choose what you want to learn. Then find a place to try it.
                </p>
                <p>
                  Design a building, test a circuit, grow a crop. Start with a
                  subject and see where you can take it.
                </p>
                <Link className="yellow-action s-button" href="/programmes">
                  Find a programme <Arrow />
                </Link>
              </div>
              <div className="s-disciplines">
                {/* Two identical groups: the track slides one group's width, then repeats seamlessly. */}
                <div className="s-marquee-track">
                  {[0, 1].map((copy) => (
                    <ul
                      key={copy}
                      className="s-marquee-group"
                      aria-label={copy ? undefined : "Fields of study"}
                      aria-hidden={copy ? true : undefined}
                    >
                      {disciplines.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <section id="explore" className="s-place" aria-labelledby="place-title">
        <div className="s-place-frame">
          <div className="s-place-grid">
            <figure className="s-map">
              <Image
                className="s-map-img"
                src="/home/campus-map.webp"
                width={876}
                height={1446}
                sizes="(max-width: 760px) 70vw, 40vw"
                alt="Illustrated transit-style map of the Kattankulathur campus: coloured routes link the academic blocks, the pond and Potheri railway station."
                unoptimized
              />
            </figure>
            <div className="s-place-intro">
              <h2 id="place-title">Find your way</h2>
              <p className="s-serif">
                Follow the road through Kattankulathur. The next turn could be
                your department.
              </p>
            </div>
            <div className="s-place-details">
              <a className="yellow-action s-button" href={tourUrl}>
                Take the 360° tour <Arrow />
              </a>
              <div>
                <span className="s-compass" aria-hidden="true">
                  ✳
                </span>
                <p>
                  Walk between the labs, the library and the grounds. Get a feel
                  for the campus before your first day.
                </p>
                <small className="s-map-note">Illustrated map, not to scale.</small>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="s-people" aria-labelledby="people-title">
        <div className="s-people-frame">
          <h2 id="people-title" className="s-people-title">
            {["Great", "ideas", "need", "great", "teams."].map((word, i) => (
              <Fragment key={i}>
                {i === 2 && <i className="s-people-break" aria-hidden="true" />}
                <span>
                  <b>{word}</b>
                </span>
              </Fragment>
            ))}
          </h2>
          <div className="s-roster">
            {community.map((a, i) => (
              <a href={a.href} key={a.name}>
                <span>0{i + 1}</span>
                <strong>{a.name}</strong>
                <em>{a.place}</em>
                <Image
                  src={"/home/" + a.image + ".webp"}
                  alt=""
                  width={260}
                  height={175}
                  unoptimized
                />
              </a>
            ))}
          </div>
          <div className="s-people-strip" aria-hidden="true">
            {community.map((a, i) => (
              <figure key={a.name} style={{ "--i": i } as React.CSSProperties}>
                <Image src={"/home/" + a.image + ".webp"} alt="" width={260} height={175} unoptimized />
                <figcaption>{a.place}</figcaption>
              </figure>
            ))}
          </div>
          <Link className="yellow-action s-button s-people-cta" href="/campus">
            Explore campus life <Arrow />
          </Link>
        </div>
      </section>
      <section className="s-news" aria-labelledby="news-title">
        <h2 id="news-title" className="s-news-title">
          Campus news.
          <br />
          <span>
            <i aria-hidden="true">◉</i> In focus.
          </span>
        </h2>
        <div className="s-news-grid">
          <div className="s-news-aside">
            <p className="s-serif">
              The latest
              <br />
              from SRM.
            </p>
            <p>Meet the students, teams and ideas making news on campus.</p>
            <Link className="yellow-action s-button" href="/news">
              All news <Arrow />
            </Link>
          </div>
          <NewsReel />
        </div>
      </section>
      <section className="s-actions" aria-label="Where to next?">
        {actions.map((a) => (
          <Link key={a.label} href={a.href}>
            <span className="s-action-face">{a.label}</span>
            <span className="s-action-reveal" aria-hidden="true">
              {a.detail}
            </span>
            <span className="s-action-mark yellow-action" aria-hidden="true">
              <Arrow />
            </span>
          </Link>
        ))}
      </section>
      <SiteFooter />
    </div>
  );
}
