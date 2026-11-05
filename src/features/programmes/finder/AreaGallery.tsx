"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./controls";
import { studyAreaHref, type StudyArea } from "./studyAreas";

const countLabel = (area: StudyArea) =>
  `${area.programmes.length} ${area.programmes.length === 1 ? "programme" : "programmes"}`;

export function AreaGallery({ areas, total }: { areas: StudyArea[]; total: number }) {
  const [previewIndex, setPreviewIndex] = useState(0);
  const directory = useRef<HTMLOListElement>(null);
  const preview = areas[previewIndex] ?? areas[0];

  useEffect(() => {
    const list = directory.current;
    if (!list) return;
    const laptop = window.matchMedia("(min-width: 961px)");
    let observer: IntersectionObserver | undefined;

    function observeRows() {
      observer?.disconnect();
      if (!laptop.matches || !list) return;
      // A single reading line drives the image without intercepting the user's scroll.
      const readingLine = Math.round(window.innerHeight * 0.46);
      const bottom = window.innerHeight - readingLine - 1;
      observer = new IntersectionObserver(entries => {
        const row = entries.find(entry => entry.isIntersecting);
        if (row) setPreviewIndex(Number((row.target as HTMLElement).dataset.index));
      }, { rootMargin: `-${readingLine}px 0px -${bottom}px 0px` });

      for (const row of list.children) observer.observe(row);
    }

    observeRows();
    window.addEventListener("resize", observeRows);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", observeRows);
    };
  }, []);

  if (!preview) return null;
  return (
    <section id="study-areas" className="pf-main area-gallery" aria-labelledby="area-title">
      <div className="area-gallery-head">
        <h2 id="area-title">Browse by study area</h2>
        <Link className="area-browse" href="/programmes?view=all">
          All {total} programmes <Icon name="arrow" />
        </Link>
      </div>
      <div className="area-index">
        <div className="area-preview">
          <Link className="area-preview-link" href={studyAreaHref(preview)}>
            <div className="area-preview-visual" data-search-surface="media">
              <Image key={preview.id} src={preview.photo} alt="" fill
                sizes="(max-width: 960px) 1px, (max-width: 1440px) 40vw, 555px" />
            </div>
            <div className="area-preview-caption" key={preview.id}>
              <span className="area-preview-title">{preview.title}</span>
              <span className="area-preview-action">Explore {countLabel(preview)} <Icon name="arrow" /></span>
            </div>
          </Link>
        </div>
        <ol ref={directory} className="area-directory">
          {areas.map((area, index) => (
            <li key={area.id} data-index={index}>
              <Link className="area-tile" href={studyAreaHref(area)} data-preview={index === previewIndex || undefined}
                onPointerMove={event => { if (event.pointerType === "mouse") setPreviewIndex(index); }}
                onFocus={() => setPreviewIndex(index)}>
                <span className="area-thumb"><Image src={area.photo} alt="" fill sizes="72px" /></span>
                <div className="area-caption">
                  <h3>{area.title}</h3>
                  <span className="area-count">{countLabel(area)}</span>
                </div>
                <span className="area-arrow"><Icon name="arrow" /></span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
