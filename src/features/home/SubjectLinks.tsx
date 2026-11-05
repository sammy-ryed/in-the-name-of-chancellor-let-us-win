"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { StudyAreaId } from "@/features/programmes/finder/studyAreas";
import "./subject-links.css";

const subjects = [
  { label: "Engineering", area: "engineering" },
  { label: "Medicine", area: "health" },
  { label: "Architecture", area: "design" },
  { label: "Sciences", area: "sciences" },
  { label: "Humanities", area: "humanities" },
  { label: "Law", area: "law" },
  { label: "Agriculture", area: "agriculture" },
] satisfies { label: string; area: StudyAreaId }[];

export function SubjectLinks() {
  const [hovered, setHovered] = useState<StudyAreaId | null>(null);
  const [focused, setFocused] = useState<StudyAreaId | null>(null);
  const preview = hovered ?? focused;

  return (
    <div className="s-subject-rail">
      {preview && (
        <div className="s-subject-photo" aria-hidden="true">
          <Image key={preview} src={`/home/subjects/${preview}.webp`} alt=""
            width={600} height={400} unoptimized loading="eager" />
        </div>
      )}
      <div className="s-subject-links">
        <div className="s-subject-track">
          {[false, true].map(repeat => (
            <ul key={String(repeat)} className="s-subjects"
              aria-label={repeat ? undefined : "Fields of study"} aria-hidden={repeat || undefined}>
              {subjects.map(({ label, area }) => (
                <li key={area}>
                  <Link href={`/programmes?area=${area}`} tabIndex={repeat ? -1 : undefined}
                    onPointerEnter={event => { if (event.pointerType !== "touch") setHovered(area); }}
                    onPointerLeave={() => setHovered(null)}
                    onFocus={event => { if (event.currentTarget.matches(":focus-visible")) setFocused(area); }}
                    onBlur={() => setFocused(null)}>
                    {label} <span aria-hidden="true">↗</span>
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
