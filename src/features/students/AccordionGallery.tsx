"use client";

// Adapted from React Bits Accordion Gallery by David Haz.
// https://reactbits.dev/components/accordion-gallery
// Original license: third-party/react-bits-LICENSE.md.
import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { gsap } from "gsap";
import { studentServices, type StudentService } from "./services";

export interface AccordionGalleryItem {
  id?: string;
  image: string;
  label: string;
  link?: string;
  alt?: string;
  title?: string;
  description?: string;
  links?: StudentService[];
  status?: string;
}
export interface AccordionGalleryProps {
  items?: AccordionGalleryItem[];
  defaultIndex?: number;
  accentColor?: string;
  overlayColor?: string;
  textColor?: string;
  height?: number;
  gap?: number;
  radius?: number;
  expandRatio?: number;
  orientation?: "horizontal" | "vertical";
  duration?: number;
  ease?: string;
  parallax?: number;
  tilt?: number;
  stagger?: number;
  trigger?: "hover" | "click";
  showLabels?: boolean;
  grayscale?: boolean;
  className?: string;
}

export function AccordionGallery({
  items = studentServices,
  defaultIndex = 2,
  accentColor = "#ffffff",
  overlayColor = "#060010",
  textColor = "#ffffff",
  height = 460,
  gap = 10,
  radius = 16,
  expandRatio = 0.52,
  orientation = "horizontal",
  duration = 0.6,
  ease = "power3.out",
  parallax = 0.5,
  tilt = 8,
  stagger = 0.06,
  trigger = "hover",
  showLabels = true,
  grayscale = true,
  className = "",
}: AccordionGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const textRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const firstRunRef = useRef(true);
  const mediaSizeRef = useRef(320);
  const vertical = orientation === "vertical";
  const count = items.length;
  const [active, setActive] = useState(
    Math.min(Math.max(defaultIndex, 0), Math.max(count - 1, 0)),
  );
  const selectedIndex = Math.min(active, Math.max(count - 1, 0));
  const ratio = Math.min(Math.max(expandRatio, 0.2), 0.9);
  const grow = count > 1 ? (ratio * (count - 1)) / (1 - ratio) : 1;
  const overlayBg = `linear-gradient(180deg, transparent 45%, color-mix(in srgb, ${overlayColor} 78%, transparent) 100%), color-mix(in srgb, ${overlayColor} calc(var(--ag-dim, 0.35) * 100%), transparent)`;

  const applyLayout = useCallback(
    (animate: boolean) => {
      const mobile = window.matchMedia("(max-width: 760px)").matches;
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const dur = animate && !reduced ? duration : 0;
      tlRef.current?.kill();
      const tl = gsap.timeline();
      panelRefs.current.slice(0, count).forEach((panel, i) => {
        if (!panel) return;
        const isActive = i === selectedIndex;
        const rot =
          mobile || reduced || isActive ? 0 : i < selectedIndex ? tilt : -tilt;
        tl.to(
          panel,
          {
            flexGrow: isActive ? grow : 1,
            rotateX: vertical ? -rot : 0,
            rotateY: vertical ? 0 : rot,
            "--ag-dim": isActive ? 0 : 0.35,
            duration: dur,
            ease,
          },
          0,
        );
        const media = mediaRefs.current[i];
        if (media) {
          const drift = Math.max(-1.5, Math.min(1.5, selectedIndex - i));
          const shift =
            mobile || reduced
              ? 0
              : drift * parallax * mediaSizeRef.current * 0.06;
          tl.to(
            media,
            {
              xPercent: -50,
              yPercent: -50,
              x: vertical || isActive ? 0 : shift,
              y: vertical && !isActive ? shift : 0,
              "--ag-gray": grayscale && !isActive ? 1 : 0,
              duration: dur,
              ease,
            },
            0,
          );
        }
        const bar = barRefs.current[i];
        const text = textRefs.current[i];
        if (showLabels && bar && text)
          tl.to(
            [bar, text],
            {
              opacity: isActive ? 1 : 0,
              x: isActive ? 0 : -14,
              duration: isActive ? dur : dur * 0.6,
              ease,
              stagger: reduced ? 0 : stagger,
            },
            0,
          );
      });
      tlRef.current = tl;
    },
    [
      count,
      selectedIndex,
      duration,
      ease,
      grow,
      vertical,
      tilt,
      parallax,
      grayscale,
      showLabels,
      stagger,
    ],
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      const usable = Math.max(
        (vertical ? rect.height : rect.width) - gap * (count - 1),
        120,
      );
      mediaSizeRef.current = Math.max(140, usable * ratio * 1.22);
      el.style.setProperty("--ag-media-size", `${mediaSizeRef.current}px`);
      applyLayout(!firstRunRef.current);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 760px)");
    motion.addEventListener("change", measure);
    mobile.addEventListener("change", measure);
    return () => {
      ro.disconnect();
      motion.removeEventListener("change", measure);
      mobile.removeEventListener("change", measure);
    };
  }, [applyLayout, gap, count, ratio, vertical]);
  useEffect(() => {
    applyLayout(!firstRunRef.current);
    firstRunRef.current = false;
  }, [applyLayout]);
  useEffect(
    () => () => {
      tlRef.current?.kill();
    },
    [],
  );

  function handleKeyDown(i: number, event: KeyboardEvent<HTMLButtonElement>) {
    let next: number;
    if (event.key === "ArrowRight" || event.key === "ArrowDown")
      next = (i + 1) % count;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      next = (i - 1 + count) % count;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = count - 1;
    else return;
    event.preventDefault();
    setActive(next);
    triggerRefs.current[next]?.focus();
  }
  if (!count) return null;
  return (
    <div
      ref={rootRef}
      className={`student-accordion${vertical ? " student-accordion--vertical" : ""} ${className}`}
      style={
        {
          gap,
          height: vertical ? Math.round(height * 1.6) : height,
          "--ag-accent": accentColor,
          "--ag-overlay": overlayColor,
          "--ag-text": textColor,
        } as CSSProperties
      }
      role="list"
      aria-label="Student services gallery"
    >
      {items.map((item, i) => {
        const isActive = i === selectedIndex;
        const id = item.id ?? String(i);
        return (
          <article
            key={id}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            className={`student-panel${isActive ? " student-panel--active" : ""}`}
            style={{ borderRadius: radius }}
            onMouseEnter={() => {
              if (trigger === "hover") setActive(i);
            }}
            onFocusCapture={() => setActive(i)}
            role="listitem"
          >
            <div className="student-panel__frame" aria-hidden="true">
              <div
                ref={(el) => {
                  mediaRefs.current[i] = el;
                }}
                className="student-panel__media"
              >
                {/* Original image element preserves the animated parallax crop. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.alt ?? item.label}
                  draggable={false}
                />
              </div>
              <div
                className={`student-panel__overlay${item.links?.length ? " student-panel__overlay--services" : ""}`}
                style={
                  item.links?.length ? undefined : { background: overlayBg }
                }
              />
            </div>
            <button
              type="button"
              ref={(el) => {
                triggerRefs.current[i] = el;
              }}
              className="student-panel__trigger"
              id={`student-trigger-${id}`}
              aria-expanded={isActive}
              aria-controls={`student-options-${id}`}
              onClick={() => setActive(i)}
              onKeyDown={(event) => handleKeyDown(i, event)}
            >
              <span className="student-panel__number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="student-panel__rail-title">{item.label}</span>
              <span className="student-panel__toggle" aria-hidden="true">
                {isActive ? "−" : "+"}
              </span>
            </button>
            <div
              id={`student-options-${id}`}
              className="student-panel__content"
              role="region"
              aria-labelledby={`student-trigger-${id}`}
              aria-hidden={!isActive}
              inert={!isActive}
            >
              {item.status && (
                <span className="student-panel__status">{item.status}</span>
              )}
              {showLabels && (
                <div className="student-panel__caption">
                  <span
                    ref={(el) => {
                      barRefs.current[i] = el;
                    }}
                    className="student-panel__bar"
                    aria-hidden="true"
                  />
                  <h2
                    ref={(el) => {
                      textRefs.current[i] = el;
                    }}
                  >
                    {item.title ?? item.label}
                  </h2>
                </div>
              )}
              {item.description && <p>{item.description}</p>}
              {item.links && (
                <ul className="student-panel__links">
                  {item.links.map((link) => (
                    <li key={link.href}>
                      <a href={link.href}>
                        <span>
                          <strong>{link.label}</strong>
                          <small>{link.detail}</small>
                        </span>
                        <span
                          className="student-panel__arrow"
                          aria-hidden="true"
                        >
                          ↗
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              {item.link && (
                <a className="student-panel__destination" href={item.link}>
                  Explore {item.label} ↗
                </a>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
export default AccordionGallery;
