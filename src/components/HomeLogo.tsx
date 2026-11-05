import Image from "next/image";
import Link from "next/link";

export function HomeLogo({ crest = false }: { crest?: boolean }) {
  return (
    <Link href="/" className={crest ? "site-crest" : undefined} aria-label="SRM home">
      <Image
        src="/home/srm-white.svg"
        width={600}
        height={203}
        alt="SRM Institute of Science and Technology"
        unoptimized
      />
    </Link>
  );
}
