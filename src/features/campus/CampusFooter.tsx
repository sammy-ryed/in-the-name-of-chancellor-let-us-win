import Link from "next/link";
import { services } from "@/lib/navigation";

export function CampusFooter() {
  return (
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
  );
}
