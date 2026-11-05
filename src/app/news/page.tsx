import Link from "next/link";
import Image from "next/image";
import { Guide, Action } from "@/components/Guide";
import { stories, srm } from "@/features/home/content";
import headlines from "@/features/explore/headlines.json";
import newsImages from "@/features/news/images.json";
import DriftWall from "@/features/news/DriftWall";
import "@/features/news/news.css";
import "@/components/inset-guide.css";
import "@/components/light-guide.css";

export const metadata = { title: "Campus news" };
const wallItems = [
  ...newsImages.map(article => ({ image: article.image, title: article.title, href: article.href })),
  ...stories.map(article => ({ image: `/home/${article.image}.webp`, title: article.title, href: article.href })),
];
const featuredStories = [
  {
    title: "Students having low attendance",
    category: "Student life",
    image: "/news/low-attendance.webp",
    alt: "Four students gathered around laptops in a classroom",
    href: "/students",
  },
  ...stories.slice(1).map(article => ({ ...article, image: `/home/${article.image}.webp` })),
];
export default function Page() {
  return <div className="news-experience inset-guide light-guide">
    <Guide title="Campus news" section="News" image="developer" intro="Student work, university news and achievements from across SRM.">
      <section className="newsroom-layout" aria-labelledby="newsroom-title">
        <div className="newsroom-editorial">
          <div className="newsroom-kicker">THE PEOPLE. THE IDEAS. THE MOMENT.</div>
          <h2 id="newsroom-title" className="newsroom-heading">From the newsroom<span aria-hidden="true">.</span></h2>
          <div className="newsroom-list">{headlines.map(article => <a key={article.href} href={article.href}>
            <small>{article.category}</small><strong>{article.title}</strong><b aria-hidden="true">↗</b>
          </a>)}</div>
          <div className="newsroom-actions"><Action href={srm + "/news/"}>Official newsroom</Action><Link href="/events">View events →</Link></div>
        </div>
        <aside className="newsroom-visual" aria-label="Campus stories in pictures">
          <DriftWall items={wallItems} columns={5} tileWidth={200} tileHeight={132} gap={18} tilt={16} turn={-14} perspective={1200} depth={120} speed={42} direction="up" variance={0.45} parallax={0.6} lift={64} fade={0.6} dim={0.72} overlayColor="var(--navy)" radius={8} roll={0} pauseOnHover={false} grayscale={false} />
        </aside>
      </section>
      <section className="newsroom-featured" aria-labelledby="news-featured-title"><div className="newsroom-kicker">A CLOSER LOOK</div><h2 id="news-featured-title">In focus</h2>
        <div className="news-bento">{featuredStories.map(article => <a key={article.href} href={article.href}>
          <div><Image src={article.image} alt={article.alt} fill unoptimized sizes="(max-width:650px) 100vw, 50vw" /></div><small>{article.category}</small><h3>{article.title} ↗</h3>
        </a>)}</div>
      </section>
    </Guide>
  </div>;
}
