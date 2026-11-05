import { SrmCrest } from "@/components/HomeLogo";
import { MotionPreview } from "@/features/home/MotionPreview";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { Film } from "@/features/home/Film";
import { Choreography } from "@/features/home/Choreography";
import { SubjectLinks } from "@/features/home/SubjectLinks";
import { NewsReel } from "@/features/home/NewsReel";
import { TeamRoll } from "@/features/home/TeamRoll";
import { HomeAction, HomeArrow } from "@/features/home/HomeAction";
import { actions, routes, tourUrl } from "@/lib/navigation";
import "./home.css";
import "./home-scenes.css";
import "@/features/home/journeys.css";

export const metadata = { title: "Life at SRM" };
export default function Page() {
  return (
    <div className="s-home">
      <Choreography />
      <div className="s-opening">
        <div className="s-stage">
          <section aria-label="Life at SRM" className="s-hero s-lines">
            <div className="s-intro-pane">
              <div className="s-hero-copy">
                <h1 className="s-hero-title"><span>Ready for</span>{" "}<span>life at</span>{" "}<span>SRMIST?</span></h1>
                <div className="s-hero-actions">
                  <p className="s-motto">Learn. Leap. Lead.</p>
                  <HomeAction href={routes.admissions.href}>Apply now</HomeAction>
                </div>
              </div>
            </div>
            <div className="s-hero-brand" aria-hidden="true"><SrmCrest /><HomeArrow /></div>
            <div className="s-film-pane" data-search-surface="media"><Film /></div>
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
                <HomeAction href={routes.programmes.href}>Find a programme</HomeAction>
              </div>
              <SubjectLinks />
            </div>
          </section>
        </div>
      </div>
      <section id="explore" className="s-tour-section" aria-labelledby="place-title">
        <figure className="s-tour-view" data-search-surface="media">
          <MotionPreview label="virtual tour preview" mp4="/home/campus-tour-preview.mp4" poster="/home/campus-tour-preview.webp" />
          <figcaption>360° / Kattankulathur campus</figcaption>
        </figure>
        <div className="s-tour-copy">
          <h2 id="place-title">Find your way</h2>
          <p className="s-serif">Start at the lake, pass through Arch Gate and step inside T.P. Ganesan Auditorium.</p>
          <div className="s-tour-links">
            <HomeAction href={tourUrl}>Enter the 360° tour</HomeAction>
            <a href="/home/campus-map.webp">View campus map ↗</a>
          </div>
        </div>
      </section>
      <TeamRoll />
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
            <HomeAction href={routes.news.href}>All news</HomeAction>
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
              <HomeArrow />
            </span>
          </Link>
        ))}
      </section>
      <SiteFooter />
    </div>
  );
}
