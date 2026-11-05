import Image from "next/image";
import Link from "next/link";

function SrmArtwork() {
  return <Image src="/home/srm-white.svg" width={600} height={203} alt="" unoptimized />;
}

export function SrmCrest() {
  return <span className="site-crest" aria-hidden="true"><SrmArtwork /></span>;
}

export function HomeLogo({ crest = false }: { crest?: boolean }) {
  return (
    <Link href="/" aria-label="SRM home">
      {crest ? <SrmCrest /> : <SrmArtwork />}
    </Link>
  );
}
