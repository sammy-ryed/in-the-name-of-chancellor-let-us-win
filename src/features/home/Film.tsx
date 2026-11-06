"use client";

import { useRef, useState } from "react";
import { filmId, filmUrl } from "./content";
import { MotionPreview } from "./MotionPreview";

export function Film() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <div className="s-film">
      <MotionPreview label="campus film preview" poster="/home/campus-preview.webp"
        portraitPoster={{ small: "/home/campus-preview-portrait-480.avif", large: "/home/campus-preview-portrait-900.avif" }}
        mobileMp4="/home/campus-preview-mobile.mp4" webm="/home/campus-preview.webm" mp4="/home/campus-preview.mp4"
        loop priority suspended={open} />
      <button type="button" className="s-film-open" aria-label="Play full campus film" aria-haspopup="dialog"
        onClick={() => { dialog.current?.showModal(); setOpen(true); }}>
        <span className="s-film-mark" aria-hidden="true" />
      </button>
      <dialog ref={dialog} className="s-film-dialog" aria-label="SRM campus film"
        onClose={() => setOpen(false)} onClick={event => { if (event.target === dialog.current) dialog.current.close(); }}>
        <div>
          <div className="s-film-bar">
            <a href={filmUrl} target="_blank" rel="noreferrer">Watch on YouTube ↗</a>
            <button type="button" onClick={() => dialog.current?.close()}>Close film ×</button>
          </div>
          {open && <iframe title="SRM campus film" src={`https://www.youtube-nocookie.com/embed/${filmId}?autoplay=1&playsinline=1&rel=0`}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen />}
        </div>
      </dialog>
      <noscript><a className="s-film-direct" href={filmUrl}>Watch the campus film</a></noscript>
    </div>
  );
}
