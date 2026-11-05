import Link from "next/link";
export interface DirectoryContent {
  title: string;
  intro: string;
  links: { label: string; href: string; detail: string }[];
}
export function Directory({ title, intro, links }: DirectoryContent) {
  return (
    <div className="directory-shell">
      <section className="intro">
        <h1>{title}</h1>
        <p>{intro}</p>
      </section>
      <ul className="directory">
        {links.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>
              <span className="yellow-action">{item.label}</span>
              <p>{item.detail}</p>
            </Link>
          </li>
        ))}
      </ul>
      <footer>SRMIST website redesign · Student hackathon prototype</footer>
    </div>
  );
}
