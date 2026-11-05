"use client";

import { useState } from "react";
import TiltedCard, { TiltedCardLayer } from "@/components/TiltedCard";
import { clubContacts, clubProfiles, clubs, studentAffairs } from "./clubs";

const types = [...new Set(clubs.map((c) => c.type))];

export function ClubCards() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const query = q.trim().toLowerCase();
  const found = clubs.filter(
    (c) => (!type || c.type === type) && (!query || `${c.name} ${c.type}`.toLowerCase().includes(query)),
  );
  const clear = () => {
    setQ("");
    setType("");
  };

  return (
    <div className="cl-clubs">
      <div className="cl-club-tools">
        <label className="cl-search">
          <span>Search by club or interest</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="e.g. music, sport or service"
          />
        </label>
        <div className="cl-chips" role="group" aria-label="Filter by interest">
          {["", ...types].map((t) => (
            <button key={t || "all"} type="button" aria-pressed={type === t} onClick={() => setType(t)}>
              {t || "All"}
            </button>
          ))}
        </div>
        <p role="status" className="cl-count">
          {found.length} {found.length === 1 ? "club" : "clubs"} · tap a card to see how to join
        </p>
      </div>

      {found.length ? (
        <ul className="cl-club-grid">
          {found.map((club, i) => (
            <li key={club.name}>
              <TiltedCard
                altText={club.name}
                captionText={`${club.name}: how to join`}
                containerHeight="360px"
                imageHeight="360px"
                imageWidth="100%"
                rotateAmplitude={10}
                scaleOnHover={1.04}
                radius={6}
                glare={0.45}
                shadow={0.45}
                introDelay={Math.min(i, 8) * 60}
                backContent={
                  <div className="cl-card-back">
                    <small>{club.type}</small>
                    <h3>{club.name}</h3>
                    <p>
                      Recruitment dates and weekly commitment are unconfirmed. Ask the club coordinator about the next
                      intake, meeting time and how to apply.
                    </p>
                    <a href={clubContacts} onClick={(e) => e.stopPropagation()}>
                      Coordinator contacts (PDF) ↗
                    </a>
                    <a href={studentAffairs} onClick={(e) => e.stopPropagation()}>
                      Confirm with Student Affairs ↗
                    </a>
                    <span className="cl-card-hint" aria-hidden="true">
                      Tap to flip back
                    </span>
                  </div>
                }
              >
                <div className="cl-card-bg s-lines" data-type={club.type} aria-hidden="true" />
                <TiltedCardLayer depth={30}>
                  <div className="cl-card-front" data-type={club.type}>
                    <div className="cl-card-top">
                      <small>{club.type}</small>
                      <span aria-hidden="true">{String(clubs.indexOf(club) + 1).padStart(2, "0")}</span>
                    </div>
                    <h3>{club.name}</h3>
                  </div>
                </TiltedCardLayer>
              </TiltedCard>
            </li>
          ))}
        </ul>
      ) : (
        <p className="cl-empty">
          No club matches.{" "}
          <button type="button" onClick={clear}>
            Clear search
          </button>
        </p>
      )}

      <p className="cl-source">
        <a href={clubProfiles}>Official club profiles ↗</a>
      </p>
    </div>
  );
}
