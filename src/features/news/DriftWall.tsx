"use client";

// Adapted from React Bits Drift Wall by David Haz (user-supplied source).
// https://reactbits.dev/components/drift-wall
// License: third-party/react-bits-LICENSE.md.
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import Image from "next/image";

export interface DriftItem { image: string; title: string; href: string; }
interface DriftWallProps {
  items: DriftItem[];
  columns?: number; tileWidth?: number; tileHeight?: number; gap?: number;
  tilt?: number; turn?: number; perspective?: number; depth?: number;
  speed?: number; direction?: "up" | "down"; variance?: number;
  parallax?: number; lift?: number; fade?: number; dim?: number;
  overlayColor?: string; radius?: number; roll?: number;
  pauseOnHover?: boolean; grayscale?: boolean;
}
function subscribeMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  window.addEventListener("srm-reading-change", callback);
  return () => { query.removeEventListener("change", callback); window.removeEventListener("srm-reading-change", callback); };
}
function quietMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.hasAttribute("data-quiet-motion");
}
export default function DriftWall({
  items, columns = 5, tileWidth = 200, tileHeight = 132, gap = 18,
  tilt = 16, turn = -14, perspective = 1200, depth = 120, speed = 42,
  direction = "up", variance = 0.45, parallax = 0.6, lift = 64,
  fade = 0.6, dim = 0.55, overlayColor = "var(--navy)", radius = 14,
  roll = 0, pauseOnHover = false, grayscale = false,
}: DriftWallProps) {
  const container = useRef<HTMLDivElement>(null);
  const plane = useRef<HTMLDivElement>(null);
  const tracks = useRef<(HTMLDivElement | null)[]>([]);
  const pointer = useRef({ x: 0, y: 0 });
  const hovering = useRef(false);
  const hoveredColumn = useRef(-1);
  const visible = useRef(false);
  const [paused, setPaused] = useState(false);
  const pauseRef = useRef(false);
  const reduced = useSyncExternalStore(subscribeMotion, quietMotion, () => false);
  const [height, setHeight] = useState(800);
  const count = Math.max(1, Math.min(columns, items.length || 1));
  const columnItems = useMemo(() => {
    const groups: DriftItem[][] = Array.from({ length: count }, () => []);
    items.forEach((item, index) => groups[index % count].push(item));
    return groups;
  }, [items, count]);
  const meta = useMemo(() => columnItems.map(column => {
    const copyHeight = Math.max(1, column.length * (tileHeight + gap));
    return { copyHeight, copies: Math.max(3, Math.ceil(height * 2.4 / copyHeight) + 2) };
  }), [columnItems, tileHeight, gap, height]);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const showcase = element.parentElement;
    const resize = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.target === element) setHeight(entry.contentRect.height);
        else showcase?.style.setProperty("--dw-showcase-height", `${entry.borderBoxSize[0]?.blockSize ?? entry.contentRect.height}px`);
      }
    });
    const visibility = new IntersectionObserver(([entry]) => { visible.current = entry.isIntersecting; });
    resize.observe(element);
    if (showcase) resize.observe(showcase);
    visibility.observe(element);
    return () => { resize.disconnect(); visibility.disconnect(); };
  }, []);

  useEffect(() => {
    if (reduced || !items.length) return;
    let frame = 0, previous = 0, dampX = 0, dampY = 0;
    const offsets = meta.map((column, index) => column.copyHeight * ((index * 0.37) % 1));
    const velocities = meta.map(() => 0);
    const animate = (timestamp: number) => {
      const dt = previous ? Math.min(0.05, (timestamp - previous) / 1000) : 0;
      previous = timestamp;
      if (visible.current && !document.hidden) {
        const still = pauseRef.current || (hovering.current && pauseOnHover);
        const damp = 1 - Math.exp(-dt / 0.12);
        dampX += ((still ? 0 : pointer.current.x * parallax * 8) - dampX) * damp;
        dampY += ((still ? 0 : -pointer.current.y * parallax * 8) - dampY) * damp;
        if (plane.current) plane.current.style.transform = `translate(-50%, -50%) scale(1.18) rotateX(${tilt + dampY}deg) rotateY(${turn + dampX}deg) rotateZ(${roll}deg) translateZ(${-depth}px)`;
        tracks.current.forEach((track, index) => {
          if (!track || !meta[index]) return;
          const factor = 1 + variance * ((((index * 0.6180339887 + 0.35) % 1) * 2) - 1);
          const target = still || hoveredColumn.current === index ? 0 : speed * factor * (direction === "up" ? 1 : -1) * (index % 2 ? -1 : 1);
          velocities[index] += (target - velocities[index]) * (1 - Math.exp(-dt / 0.2));
          // Pause is immediate; hover deceleration stays soft.
          if (!pauseRef.current) offsets[index] = ((offsets[index] + velocities[index] * dt) % meta[index].copyHeight + meta[index].copyHeight) % meta[index].copyHeight;
          track.style.transform = `translate3d(0, ${-offsets[index]}px, 0)`;
        });
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [reduced, pauseOnHover, items.length, meta, parallax, tilt, turn, roll, depth, speed, direction, variance]);

  if (!items.length) return null;
  const variables = {
    "--dw-tile-w": `${tileWidth}px`, "--dw-tile-h": `${tileHeight}px`,
    "--dw-gap": `${gap}px`, "--dw-radius": `${radius}px`,
    "--dw-lift": `${lift}px`, "--dw-dim": dim, "--dw-gray": grayscale ? 1 : 0,
    "--dw-overlay": overlayColor, "--dw-edge": `${Math.max(0, (1 - fade) * 100)}%`,
    perspective: `${perspective}px`,
  } as CSSProperties;
  return <div className="drift-showcase" data-still={reduced || undefined}>
    <div ref={container} className="drift-wall" style={variables}
      onPointerMove={event => {
        if (event.pointerType !== "mouse" || reduced) return;
        const box = event.currentTarget.getBoundingClientRect();
        pointer.current = { x: (event.clientX - box.left) / box.width - 0.5, y: (event.clientY - box.top) / box.height - 0.5 };
      }}
      onPointerEnter={() => { hovering.current = true; }}
      onPointerLeave={() => { hovering.current = false; hoveredColumn.current = -1; pointer.current = { x: 0, y: 0 }; }}>
      {reduced ? <div className="drift-static">{items.map(item => <a href={item.href} key={item.href} aria-label={item.title}>
        <Image src={item.image} alt="" width={360} height={240} sizes="(max-width: 700px) 45vw, 25vw" unoptimized />
        <span>{item.title}</span>
      </a>)}</div> : <div className="drift-plane" ref={plane} aria-hidden="true">
        {columnItems.map((column, index) => <div className="drift-column" key={index}>
          <div className="drift-track" ref={element => { tracks.current[index] = element; }}>
            {Array.from({ length: meta[index].copies }, (_, copy) => column.map((item, itemIndex) =>
              <a className="drift-tile" href={item.href} tabIndex={-1} key={`${copy}-${itemIndex}`}
                onPointerEnter={() => { hoveredColumn.current = index; }} onPointerLeave={() => { hoveredColumn.current = -1; }}>
                <span className="drift-tile-inner"><Image src={item.image} alt="" width={tileWidth} height={tileHeight} sizes="220px" unoptimized draggable={false} />
                  <span className="drift-tile-shade" /><span className="drift-tile-label">{item.title}<b>↗</b></span>
                </span>
              </a>))}
          </div>
        </div>)}
      </div>}
    </div>
    <div className="drift-controls"><span>{reduced ? "SRM STORIES / IN PICTURES" : "HOVER A FRAME TO EXPLORE"}</span>{!reduced && <button type="button" aria-pressed={paused} onClick={() => { pauseRef.current = !paused; setPaused(!paused); }}>{paused ? "Resume motion ▶" : "Pause motion Ⅱ"}</button>}</div>
    {!reduced && <p className="drift-sr-only">Animated photographs link to SRM articles. All stories are also available in the newsroom list.</p>}
  </div>;
}
