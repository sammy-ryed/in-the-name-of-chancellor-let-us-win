import Image from "next/image";
import type { CSSProperties } from "react";
import type { StudyArea, StudyAreaId } from "./studyAreas";
import styles from "./FieldArtwork.module.css";

// Each mark is drawn against the same four-by-four grid, with one ink and one offset colour.
const prints = {
  computing: {
    ink: "#254bca", paper: "#f2ae45",
    mark: "M0 0H48V24H24V48H0ZM48 24H72V48H48ZM72 48H96V96H48V72H72ZM0 72H24V96H0Z",
  },
  engineering: {
    ink: "#bb422a", paper: "#ffbe62",
    mark: "M0 72 72 0H96L24 72ZM24 96 96 24V48L48 96ZM0 48V24L24 0H48Z",
  },
  health: {
    ink: "#0a7669", paper: "#9cdab6",
    mark: "M24 0H72V24H96V72H72V96H24V72H0V24H24ZM36 36V60H60V36Z",
  },
  business: {
    ink: "#703da2", paper: "#f6b379",
    mark: "M0 72H18V96H0ZM26 48H44V96H26ZM52 24H70V96H52ZM78 0H96V96H78Z",
  },
  sciences: {
    ink: "#2055aa", paper: "#8fdacb",
    mark: "M48 0A48 48 0 1 0 96 48H72A24 24 0 1 1 48 24ZM63 0H96V33H63Z",
  },
  humanities: {
    ink: "#a5424f", paper: "#ffb092",
    mark: "M0 48A48 48 0 0 1 48 0V24A24 24 0 0 0 24 48H48V72H0ZM48 72A48 48 0 0 1 96 24V48A24 24 0 0 0 72 72H96V96H48Z",
  },
  design: {
    ink: "#3454aa", paper: "#f6c557",
    mark: "M0 96V48A48 48 0 0 1 96 48V96H72V48A24 24 0 0 0 24 48V96ZM36 60A12 12 0 0 1 60 60V96H36Z",
  },
  agriculture: {
    ink: "#337341", paper: "#e6c557",
    mark: "M0 0H24A24 24 0 0 1 48 24V48H24A24 24 0 0 1 0 24ZM48 48A48 48 0 0 1 96 0V24A48 48 0 0 1 48 72ZM0 48A48 48 0 0 1 48 96H24A24 24 0 0 1 0 72Z",
  },
  law: {
    ink: "#4b5192", paper: "#efbc71",
    mark: "M0 0H96V18H0ZM0 30H42A21 21 0 0 1 0 30ZM54 30H96A21 21 0 0 1 54 30ZM39 54H57V78H78V96H18V78H39Z",
  },
  hospitality: {
    ink: "#bd4c27", paper: "#f6c36e",
    mark: "M0 68A48 48 0 0 1 96 68ZM0 80H96V96H0ZM36 0H60V12H36Z",
  },
} satisfies Record<StudyAreaId, { ink: string; paper: string; mark: string }>;

export function FieldArtwork({ area, priority = false }: { area: StudyArea; priority?: boolean }) {
  const print = prints[area.id];
  const colours = { "--field-ink": print.ink, "--field-paper": print.paper } as CSSProperties;
  return (
    <div className={styles.art} style={colours} aria-hidden="true">
      <div className={styles.photo}>
        <Image src={area.photo} alt="" fill loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined} sizes="(max-width: 760px) 90vw, (max-width: 1500px) 43vw, 640px" />
      </div>
      <svg className={styles.mark} viewBox="-4 -4 112 112" fillRule="evenodd" focusable="false">
        <path d={print.mark} transform="translate(6 6)" fill="var(--field-paper)" />
        <path d={print.mark} fill="var(--field-ink)" />
      </svg>
    </div>
  );
}
