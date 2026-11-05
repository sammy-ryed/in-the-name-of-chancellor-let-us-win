"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "./controls";
import type { StudyArea } from "./studyAreas";

const areaUrl = (area: StudyArea) => `/programmes?area=${area.id}`;
const countLabel = (area: StudyArea) =>
  `${area.programmes.length} ${area.programmes.length === 1 ? "programme" : "programmes"}`;

export function AreaGallery({ areas, total }: { areas: StudyArea[]; total: number }) {
  const [previewId, setPreviewId] = useState(areas[0]?.id);
  const preview = areas.find(area => area.id === previewId) ?? areas[0];
  if (!preview) return null;

  return (
    <section id="study-areas" className="pf-main area-gallery" aria-labelledby="area-title">
      <div className="area-gallery-head">
        <h2 id="area-title">Study areas</h2>
        <Link className="area-browse" href="/programmes?view=all">
          Browse all {total} programmes <Icon name="arrow" />
        </Link>
      </div>
      <div className="area-index">
        <aside className="area-preview" aria-label="Study area preview">
          <div className="area-preview-visual">
            <Image key={preview.id} src={preview.photo || "/home/campus.webp"} alt="" fill
              sizes="(max-width: 760px) 1px, (max-width: 1280px) 40vw, 510px" />
          </div>
          <div className="area-preview-caption">
            <span className="area-count">{countLabel(preview)}</span>
            <Link href={areaUrl(preview)}>{preview.title}<Icon name="arrow" /></Link>
          </div>
        </aside>
        <ul className="area-directory">
          {areas.map(area => (
            <li key={area.id}>
              <Link className="area-tile" href={areaUrl(area)} data-preview={area === preview || undefined}
                onPointerEnter={event => { if (event.pointerType !== "touch") setPreviewId(area.id); }}
                onFocus={() => setPreviewId(area.id)}>
                <span className="area-thumb"><Image src={area.photo || "/home/campus.webp"} alt="" fill sizes="64px" /></span>
                <div className="area-caption">
                  <h3>{area.title}</h3>
                  <span className="area-count">{countLabel(area)}</span>
                </div>
                <span className="area-arrow"><Icon name="arrow" /></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
