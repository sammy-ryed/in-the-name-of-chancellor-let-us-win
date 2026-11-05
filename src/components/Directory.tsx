import Link from "next/link";
import { navigation } from "@/lib/navigation";
export interface DirectoryContent {
  title: string;
  intro: string;
  links: { label: string; href: string; detail: string }[];
}
export function Directory({ title, intro, links }: DirectoryContent) {
  return (
    <div className="directory-shell">
      <header>
        <Link className="brand" href="/">
          SRMIST
        </Link>
        <nav aria-label="Main navigation">
          {navigation.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
        </nav>
      </header>
      <section className="intro">
        <h1>{title}</h1>
        <p>{intro}</p>
      </section>
      <ul className="directory">
        {links.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>
              <span>{item.label}</span>
              <p>{item.detail}</p>
            </Link>
          </li>
        ))}
      </ul>
      <footer>SRMIST website redesign · Student hackathon prototype</footer>
    </div>
  );
}
