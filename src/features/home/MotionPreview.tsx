"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
  label: string;
  poster: string;
  mp4: string;
  webm?: string;
  loop?: boolean;
  suspended?: boolean;
  priority?: boolean;
};

export function MotionPreview({ label, poster, mp4, webm, loop, suspended = false, priority = false }: Props) {
  const video = useRef<HTMLVideoElement>(null);
  const choice = useRef<"play" | "pause" | null>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const player = video.current;
    if (!player) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const section = player.closest("section");
    let visible = false;
    function sync() {
      if (!player) return;
      const automatic = !motion.matches && !document.documentElement.hasAttribute("data-quiet-motion") && !connection?.saveData;
      if (visible && !document.hidden && !section?.inert && !suspended && !player.ended &&
          (choice.current === "play" || (choice.current === null && automatic))) {
        void player.play().catch(() => {});
      } else {
        player.pause();
      }
    }
    function preferenceChanged() { choice.current = null; sync(); }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.intersectionRatio >= 0.25;
      sync();
    }, { threshold: [0, 0.25] });
    observer.observe(player);
    const mask = new MutationObserver(sync);
    if (section) mask.observe(section, { attributes: true, attributeFilter: ["inert"] });
    motion.addEventListener("change", preferenceChanged);
    window.addEventListener("srm-reading-change", preferenceChanged);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      mask.disconnect();
      motion.removeEventListener("change", preferenceChanged);
      window.removeEventListener("srm-reading-change", preferenceChanged);
      document.removeEventListener("visibilitychange", sync);
      player.pause();
    };
  }, [suspended]);

  function toggle() {
    const player = video.current;
    if (!player) return;
    if (player.paused || player.ended) {
      choice.current = "play";
      if (player.ended) player.currentTime = 0;
      void player.play().catch(() => {});
    } else {
      choice.current = "pause";
      player.pause();
    }
  }
  const action = playing ? "Pause" : ended ? "Replay" : "Play";
  return (
    <>
      <Image src={poster} alt="" fill unoptimized priority={priority} className="s-preview-poster" />
      <video ref={video} muted playsInline loop={loop} preload="none" aria-hidden="true"
        className="s-preview-video" data-visible={started && !failed}
        onPlaying={() => { setStarted(true); setPlaying(true); setEnded(false); }}
        onPause={() => setPlaying(false)} onEnded={() => { setEnded(true); setPlaying(false); }}
        onError={() => setFailed(true)}>
        {webm && <source src={webm} type="video/webm" />}
        <source src={mp4} type="video/mp4" />
      </video>
      {!failed && <button type="button" className="s-preview-toggle" data-playing={playing || undefined}
        aria-label={action + " " + label} title={action + " " + label} onClick={toggle}>
        <span className="s-preview-symbol" aria-hidden="true" />{" "}
        <span className="s-preview-label">{action} preview</span>
      </button>}
    </>
  );
}
