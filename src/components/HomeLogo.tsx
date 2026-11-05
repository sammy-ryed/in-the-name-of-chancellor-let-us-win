import Image from "next/image";
import Link from "next/link";

export function HomeLogo() {
  return (
    <Link href="/" aria-label="SRM home">
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
