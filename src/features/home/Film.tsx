"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { filmId, filmUrl } from "./content";

type Player = {
  playVideo(): void;
  pauseVideo(): void;
  mute(): void;
  unMute(): void;
  seekTo(s: number, ahead: boolean): void;
  destroy(): void;
};
type Options = {
  host: string;
  videoId: string;
  width: string;
  height: string;
  playerVars: Record<string, string | number>;
  events: {
    onReady(event: { target: Player }): void;
    onStateChange(e: { data: number }): void;
    onError(): void;
    onAutoplayBlocked(): void;
  };
};
type PlayerHandle = Pick<Player, "destroy">;
type API = { Player: new (el: HTMLElement, opts: Options) => PlayerHandle };
declare global {
  interface Window {
    YT?: API;
    onYouTubeIframeAPIReady?: () => void;
  }
}
let apiPromise: Promise<API> | undefined;
function youtube() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!apiPromise)
    apiPromise = new Promise<API>((resolve, reject) => {
      const timer = window.setTimeout(
        () => reject(Error("Player unavailable")),
        12000,
      );
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        clearTimeout(timer);
        if (window.YT) resolve(window.YT);
      };
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.onerror = () => {
        clearTimeout(timer);
        reject(Error("Player blocked"));
      };
      document.head.append(tag);
    });
  return apiPromise;
}
export function Film() {
  const root = useRef<HTMLDivElement>(null),
    mount = useRef<HTMLDivElement>(null),
    readyPlayer = useRef<Player | null>(null);
  const active = useRef(false),
    inView = useRef(true),
    stopped = useRef(false),
    soundEnabled = useRef(false),
    tried = useRef(false);
  const [mode, setMode] = useState<"preview" | "reel">("preview"),
    [playing, setPlaying] = useState(false),
    [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false),
    [muted, setMuted] = useState(true),
    [previewPaused, setPreviewPaused] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const previewChoice = useRef<boolean | null>(null);
  useEffect(() => {
    const container = mount.current!,
      element = root.current!,
      section = element.closest<HTMLElement>(".s-stage")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let playerHandle: PlayerHandle | undefined;
    let dead = false,
      watchdog = 0;
    const hero = section.querySelector<HTMLElement>(".s-hero")!;
    const shouldPlay = () =>
      inView.current &&
      !hero.inert &&
      !document.hidden &&
      !stopped.current &&
      (!reduce.matches || active.current || previewChoice.current === true);
    const sync = () => {
      if (dead || !readyPlayer.current) return;
      if (shouldPlay()) readyPlayer.current.playVideo();
      else readyPlayer.current.pauseVideo();
    };
    const pref = () => {
      if (!active.current && previewChoice.current === null) {
        stopped.current = reduce.matches;
        setPreviewPaused(reduce.matches);
      }
      sync();
    };
    const maskObserver = new MutationObserver(sync);
    maskObserver.observe(hero, {
      attributes: true,
      attributeFilter: ["inert"],
    });
    queueMicrotask(() => {
      if (!dead) pref();
    });
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (dead) return;
        inView.current = entry.isIntersecting;
        sync();
      },
      { threshold: 0.05 },
    );
    obs.observe(element);
    reduce.addEventListener("change", pref);
    document.addEventListener("visibilitychange", sync);
    youtube()
      .then((api) => {
        if (dead) return;
        const target = document.createElement("div");
        container.append(target);
        playerHandle = new api.Player(target, {
          host: "https://www.youtube-nocookie.com",
          videoId: filmId,
          width: "100%",
          height: "100%",
          playerVars: {
            controls: 0,
            disablekb: 1,
            playsinline: 1,
            rel: 0,
            loop: 1,
            playlist: filmId,
            origin: location.origin,
            autoplay: 0,
            mute: 1,
          },
          events: {
            onReady({ target }) {
              if (dead) return;
              // YouTube installs the playback methods when the iframe is ready.
              readyPlayer.current = target;
              if (soundEnabled.current) target.unMute();
              else target.mute();
              sync();
            },
            onStateChange(e) {
              if (dead) return;
              if (e.data === 1) {
                tried.current = true;
                setBlocked(false);
                setStarted(true);
                setPlaying(true);
              }
              if (e.data === 2 || e.data === 0) setPlaying(false);
            },
            onAutoplayBlocked() {
              if (!dead) {
                setPlaying(false);
                setBlocked(true);
              }
            },
            onError() {
              if (!dead) {
                setFailed(true);
                setPlaying(false);
              }
            },
          },
        });
        const frame = container.querySelector("iframe");
        if (frame) {
          frame.title = "SRM campus film";
          frame.tabIndex = -1;
        }
        watchdog = window.setTimeout(() => {
          if (!dead && !tried.current && !reduce.matches) setBlocked(true);
        }, 9000);
      })
      .catch(() => {
        if (!dead) setFailed(true);
      });
    return () => {
      dead = true;
      clearTimeout(watchdog);
      obs.disconnect();
      maskObserver.disconnect();
      reduce.removeEventListener("change", pref);
      document.removeEventListener("visibilitychange", sync);
      delete section.dataset.viewing;
      readyPlayer.current = null;
      playerHandle?.destroy();
    };
  }, []);
  function exitFilm() {
    active.current = false;
    soundEnabled.current = false;
    stopped.current = previewPaused;
    delete root.current!.closest<HTMLElement>(".s-stage")!.dataset.viewing;
    setMode("preview");
    setMuted(true);
    readyPlayer.current?.mute();
    if (previewPaused) readyPlayer.current?.pauseVideo();
    else readyPlayer.current?.playVideo();
  }
  function toggle() {
    if (mode === "preview") {
      active.current = true;
      soundEnabled.current = true;
      stopped.current = false;
      setMode("reel");
      setMuted(false);
      root.current!.closest<HTMLElement>(".s-stage")!.dataset.viewing = "true";
      readyPlayer.current?.seekTo(0, true);
      readyPlayer.current?.unMute();
      readyPlayer.current?.playVideo();
    } else if (playing) {
      stopped.current = true;
      readyPlayer.current?.pauseVideo();
    } else {
      stopped.current = false;
      readyPlayer.current?.playVideo();
    }
  }
  const label = mode === "reel" && playing ? "Pause" : "Play";
  return (
    <div
      className="s-film"
      ref={root}
      data-mode={mode}
      data-failed={failed || undefined}
      onKeyDown={(e) => {
        if (e.key === "Escape" && mode === "reel") {
          exitFilm();
          root.current?.querySelector("button")?.focus();
        }
      }}
    >
      <Image
        className="s-film-poster"
        src="/home/film.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        unoptimized
      />
      <div className="s-yt" ref={mount} data-visible={started && !failed} />
      <button
        className="s-film-hit"
        type="button"
        aria-label={
          failed
            ? "Watch the SRM campus film on YouTube"
            : label + " campus film"
        }
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty("--mx", e.clientX - r.left + "px");
          e.currentTarget.style.setProperty("--my", e.clientY - r.top + "px");
        }}
        onClick={() => {
          if (failed) {
            window.open(filmUrl, "_blank", "noopener,noreferrer");
          } else toggle();
        }}
      >
        <span className="s-cursor">
          <b>{label === "Pause" ? "Ⅱ" : "▶"}</b>
          <small>{label}</small>
        </span>
      </button>
      <noscript>
        <a className="s-film-tools" href={filmUrl}>
          Watch the campus film on YouTube
        </a>
      </noscript>
      <div className="s-film-tools">
        {mode === "reel" && (
          <>
            <button onClick={exitFilm}>Close film ×</button>
            <button
              onClick={() => {
                soundEnabled.current = muted;
                if (muted) readyPlayer.current?.unMute();
                else readyPlayer.current?.mute();
                setMuted(!muted);
              }}
            >
              {muted ? "Sound on" : "Mute"}
            </button>
          </>
        )}
        {mode === "preview" && !failed && (!blocked || started) && (
          <button
            onClick={() => {
              const next = !stopped.current;
              stopped.current = next;
              previewChoice.current = !next;
              setPreviewPaused(next);
              if (next) readyPlayer.current?.pauseVideo();
              else readyPlayer.current?.playVideo();
            }}
          >
            {previewPaused ? "Resume preview" : "Pause preview"}
          </button>
        )}
        {(mode === "reel" || failed || blocked) && (
          <a href={filmUrl} target="_blank" rel="noreferrer">
            Watch on YouTube ↗
          </a>
        )}
      </div>
    </div>
  );
}
