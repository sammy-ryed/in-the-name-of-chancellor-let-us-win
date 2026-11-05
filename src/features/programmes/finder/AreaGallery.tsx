import Image from "next/image";
import Link from "next/link";
import { Icon } from "./controls";
import type { StudyArea } from "./studyAreas";

export function AreaGallery({ areas, total }: { areas: StudyArea[]; total: number }) {
  return (
    <section id="study-areas" className="pf-main area-gallery" aria-labelledby="area-title">
      <div className="area-gallery-head">
        <h2 id="area-title">Explore by study area</h2>
        <Link className="area-browse" href="/programmes?view=all">Browse all {total} programmes <Icon name="arrow" /></Link>
      </div>
      <div className="area-grid">
        {areas.map(area => (
          <Link key={area.id} href={`/programmes?area=${area.id}`} className="area-tile">
            <Image src={area.photo || "/home/campus.webp"} alt="" fill
              sizes="(max-width: 580px) 94vw, (max-width: 960px) 44vw, 580px" />
            <div className="area-caption">
              <span className="area-count">{area.programmes.length} {area.programmes.length === 1 ? "programme" : "programmes"}</span>
              <h3>{area.title}</h3>
            </div>
            <span className="area-arrow"><Icon name="arrow" /></span>
          </Link>
        ))}
      </div>
    </section>
  );
}
