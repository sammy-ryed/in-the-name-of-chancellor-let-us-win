import Link from "next/link";
import Image from "next/image";
import { Guide, Section, Action } from "@/components/Guide";
import { stories, srm } from "@/features/home/content";
import headlines from "@/features/explore/headlines.json";
export const metadata = { title: "Campus news" };
export default function Page() {
  return (
    <Guide
      title="Campus news"
      section="News"
      image="developer"
      intro="Student work, university news and achievements from across SRM."
    >
      <Section title="In focus">
        <div className="news-bento">
          {stories.map((a) => (
            <a key={a.href} href={a.href}>
              <div>
                <Image
                  src={"/home/" + a.image + ".webp"}
                  alt={a.alt}
                  fill
                  unoptimized
                  sizes="(max-width:650px) 100vw, 50vw"
                />
              </div>
              <small>{a.category}</small>
              <h3>{a.title} ↗</h3>
            </a>
          ))}
        </div>
      </Section>
      <Section title="From the newsroom">
        <div className="headline-list">
          {headlines.map((a) => (
            <a key={a.href} href={a.href}>
              <small>{a.category}</small>
              <strong>{a.title}</strong>
              <b>↗</b>
            </a>
          ))}
        </div>
        <div className="action-row">
          <Action href={srm + "/news/"}>Official newsroom</Action>
          <Link href="/events">View events →</Link>
        </div>
      </Section>
    </Guide>
  );
}
