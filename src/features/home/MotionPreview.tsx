"use client";

import Image from "next/image";
import { preload } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";

const phoneScreen = "(max-width: 760px), (max-width: 1000px) and (pointer: coarse)";
const portraitPhone = "(max-width: 760px) and (orientation: portrait)";
type PortraitPoster = { small: string; large: string };
type Connection = EventTarget & { saveData?: boolean; effectiveType?: string; downlink?: number };

type Props = {
  label: string;
  poster: string;
  mp4: string;
  webm?: string;
  mobileMp4?: string;
  portraitPoster?: PortraitPoster;
  loop?: boolean;
  suspended?: boolean;
  priority?: boolean;
};

export function MotionPreview({ label, poster, mp4, webm, mobileMp4, portraitPoster, loop, suspended = false, priority = false }: Props) {
  const video = useRef<HTMLVideoElement>(null);
  const choice = useRef<"play" | "pause" | null>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [failed, setFailed] = useState(false);
  const portraitSet = portraitPoster && `${portraitPoster.small} 480w, ${portraitPoster.large} 900w`;

  if (priority) {
    if (portraitPoster) {
      preload(portraitPoster.large, { as: "image", type: "image/avif", imageSrcSet: portraitSet,
        imageSizes: "100vw", media: portraitPhone, fetchPriority: "high" });
    }
    preload(poster, { as: "image", media: portraitPoster ? "not all and (max-width: 760px) and (orientation: portrait)" : undefined,
      fetchPriority: "high" });
  }

  const play = useCallback((player: HTMLVideoElement) => {
    // Leave the video element source-free until it can play. Assigning sources and
    // calling play in the same gesture also supports touch browsers with autoplay limits.
    if (player.dataset.preview !== mp4) {
      const candidates = mobileMp4 && matchMedia(phoneScreen).matches ? [mobileMp4] : [webm, mp4];
      player.replaceChildren(...candidates.filter((src): src is string => !!src).map(src => {
        const source = document.createElement("source");
        source.type = src.endsWith(".webm") ? "video/webm" : "video/mp4";
        source.src = src;
        return source;
      }));
      player.dataset.preview = mp4;
      player.load();
    }
    void player.play().catch(() => {});
  }, [mobileMp4, mp4, webm]);

  useEffect(() => {
    const player = video.current;
    if (!player) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const phone = matchMedia(phoneScreen);
    const connection = (navigator as Navigator & { connection?: Connection }).connection;
    const section = player.closest("section");
    let visible = false;
    let pageSettled = false;
    let settleTimer: number | undefined;

    function sync() {
      if (!player) return;
      const fastPhone = connection?.effectiveType === "4g" && (connection.downlink ?? 0) >= 5;
      const automatic = !motion.matches && !document.documentElement.hasAttribute("data-quiet-motion") &&
        !connection?.saveData && (!phone.matches || (pageSettled && fastPhone));
      if (visible && !document.hidden && !section?.inert && !suspended && !player.ended &&
          (choice.current === "play" || (choice.current === null && automatic))) {
        play(player);
      } else {
        player.pause();
      }
    }

    // Let the document and responsive poster finish before fast phones start a preview.
    function afterLoad() {
      settleTimer = window.setTimeout(() => { pageSettled = true; sync(); }, 1000);
    }
    function preferenceChanged() { choice.current = null; sync(); }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.intersectionRatio >= 0.25;
      sync();
    }, { threshold: [0, 0.25] });
    observer.observe(player);
    const mask = new MutationObserver(sync);
    if (section) mask.observe(section, { attributes: true, attributeFilter: ["inert"] });
    if (document.readyState === "complete") afterLoad();
    else window.addEventListener("load", afterLoad, { once: true });
    motion.addEventListener("change", preferenceChanged);
    phone.addEventListener("change", sync);
    connection?.addEventListener("change", sync);
    window.addEventListener("srm-reading-change", preferenceChanged);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      mask.disconnect();
      window.clearTimeout(settleTimer);
      window.removeEventListener("load", afterLoad);
      motion.removeEventListener("change", preferenceChanged);
      phone.removeEventListener("change", sync);
      connection?.removeEventListener("change", sync);
      window.removeEventListener("srm-reading-change", preferenceChanged);
      document.removeEventListener("visibilitychange", sync);
      player.pause();
    };
  }, [play, suspended]);

  function toggle() {
    const player = video.current;
    if (!player) return;
    if (player.paused || player.ended) {
      choice.current = "play";
      if (player.ended) player.currentTime = 0;
      play(player);
    } else {
      choice.current = "pause";
      player.pause();
    }
  }
  const action = playing ? "Pause" : ended ? "Replay" : "Play";
  return (
    <>
      <picture>
        {portraitSet && <source media={portraitPhone} type="image/avif" srcSet={portraitSet} sizes="100vw" />}
        <Image src={poster} alt="" fill unoptimized loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "low"} className="s-preview-poster" />
      </picture>
      <video ref={video} muted playsInline loop={loop} preload="none" aria-hidden="true"
        className="s-preview-video" data-visible={started && !failed}
        onPlaying={() => { setStarted(true); setPlaying(true); setEnded(false); }}
        onPause={() => setPlaying(false)} onEnded={() => { setEnded(true); setPlaying(false); }}
        onError={() => setFailed(true)} />
      {!failed && <button type="button" className="s-preview-toggle" data-playing={playing || undefined}
        aria-label={action + " " + label} title={action + " " + label} onClick={toggle}>
        <span className="s-preview-symbol" aria-hidden="true" />{" "}
        <span className="s-preview-label">{action} preview</span>
      </button>}
    </>
  );
}
