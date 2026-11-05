import Link from "next/link";
export interface DirectoryContent {
  title: string;
  intro: string;
  links: { label: string; href: string; detail: string }[];
}
export function Directory({ title, intro, links }: DirectoryContent) {
  return <><section className="intro"><h1>{title}</h1><p>{intro}</p></section><ul className="directory">{links.map(item => <li key={item.href}><Link href={item.href}><span>{item.label}</span><p>{item.detail}</p></Link></li>)}</ul></>;
}
