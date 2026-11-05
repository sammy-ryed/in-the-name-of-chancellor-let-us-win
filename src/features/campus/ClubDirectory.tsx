"use client";

import { useRef, useState } from "react";
import { clubContacts, clubProfiles, clubs, studentAffairs } from "./clubs";

type Club = (typeof clubs)[number];
const interests = [...new Set(clubs.map((c) => c.type))];

/**
 * Find your people: compact club tiles with search and interest filters.
 * Details open in a drawer (a bottom sheet on phones) instead of on the tile.
 */
export function ClubDirectory() {
  const [q, setQ] = useState("");
  const [interest, setInterest] = useState("");
  const [open, setOpen] = useState<Club | null>(null);
  const drawer = useRef<HTMLDialogElement>(null);

  const query = q.trim().toLowerCase();
  const found = clubs.filter(
    (c) => (!interest || c.type === interest) && (!query || `${c.name} ${c.type}`.toLowerCase().includes(query)),
  );
  const show = (club: Club) => {
    setOpen(club);
    if (!drawer.current?.open) drawer.current?.showModal();
  };
  const related = open ? clubs.filter((c) => c.type === open.type && c.name !== open.name) : [];

  return (
    <div className="cl-dir">
      <div className="cl-dir-tools">
        <label className="cl-dir-search">
          <span className="cl-sr">Search clubs</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="M16 16l4.5 4.5" />
          </svg>
          <input
            type="search"
            value={q}
            placeholder="Search by club or interest"
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <div className="cl-dir-filters" role="group" aria-label="Filter by interest">
          {["", ...interests].map((t) => (
            <button key={t || "all"} type="button" aria-pressed={interest === t} onClick={() => setInterest(t)}>
              {t || "All interests"}
            </button>
          ))}
        </div>
      </div>
      <p className="cl-dir-count" role="status">
        {found.length} {found.length === 1 ? "club" : "clubs"}
        {interest && ` in ${interest}`}
      </p>

      {found.length ? (
        <ul className="cl-dir-grid">
          {found.map((club) => (
            <li key={club.name}>
              <button
                type="button"
                className="cl-tile"
                data-type={club.type}
                aria-haspopup="dialog"
                aria-controls="cl-drawer"
                onClick={() => show(club)}
              >
                <span className="cl-tile-type">{club.type}</span>
                <span className="cl-tile-name">{club.name}</span>
                <span className="cl-tile-more" aria-hidden="true">
                  How to join <b>+</b>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="cl-dir-empty">
          No club matches “{q.trim()}”.{" "}
          <button
            type="button"
            onClick={() => {
              setQ("");
              setInterest("");
            }}
          >
            Show all clubs
          </button>
        </p>
      )}

      <dialog
        id="cl-drawer"
        ref={drawer}
        className="cl-drawer"
        aria-labelledby="cl-drawer-title"
        onClick={(e) => e.target === drawer.current && drawer.current.close()}
        onClose={() => setOpen(null)}
      >
        {open && (
          <div className="cl-drawer-body" data-type={open.type}>
            <button type="button" className="cl-drawer-close" onClick={() => drawer.current?.close()}>
              Close <span aria-hidden="true">×</span>
            </button>
            <span className="cl-tile-type">{open.type}</span>
            <h3 id="cl-drawer-title">{open.name}</h3>
            <p className="cl-drawer-note">
              Recruitment dates and weekly commitment aren’t published yet. The club’s coordinator can tell you about
              the next intake.
            </p>
            <h4>How to join</h4>
            <ol className="cl-steps">
              <li>
                <strong>Find the coordinator.</strong> Look up {open.name} in Student Affairs’ club contact directory.
                <a href={clubContacts}>Club contact directory (PDF) ↗</a>
              </li>
              <li>
                <strong>Ask about the next intake.</strong> Check meeting times, weekly commitment and how to apply.
              </li>
              <li>
                <strong>Confirm with Student Affairs.</strong> The Directorate of Student Affairs oversees all clubs.
                <a href={studentAffairs}>Directorate of Student Affairs ↗</a>
              </li>
            </ol>
            {related.length > 0 && (
              <>
                <h4>More in {open.type}</h4>
                <ul className="cl-related">
                  {related.map((c) => (
                    <li key={c.name}>
                      <button type="button" onClick={() => show(c)}>
                        {c.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <a className="cl-drawer-profiles" href={clubProfiles}>
              Official club profiles ↗
            </a>
          </div>
        )}
      </dialog>
    </div>
  );
}
