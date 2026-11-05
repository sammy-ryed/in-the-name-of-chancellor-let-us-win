"use client";
import { useState } from "react";
const clubs = [
  ["Rotaract Club", "Service"],
  ["Astrophilia", "Science"],
  ["Fashion", "Arts"],
  ["Music", "Arts"],
  ["Literature Club", "Arts"],
  ["Festival", "Culture"],
  ["Dance Club", "Arts"],
  ["Movies and Dramatics", "Arts"],
  ["Sports", "Sport"],
  ["Creative Arts & Media", "Arts"],
  ["Women Empowerment", "Service"],
  ["Self Defense Club", "Sport"],
  ["Social Club", "Community"],
  ["Gaming", "Games"],
  ["Quiz", "Games"],
];
export default function Clubs() {
  const [q, setQ] = useState("");
  const found = clubs.filter((c) =>
    c.join(" ").toLowerCase().includes(q.trim().toLowerCase()),
  );
  return (
    <>
      <label className="search-label">
        Search by club or interest
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="e.g. music, sport or service"
        />
      </label>
      <p role="status">{found.length} clubs</p>
      <div className="clubs">
        {found.map(([name, type]) => (
          <details key={name}>
            <summary>
              {name}
              <small>{type}</small>
            </summary>
            <p>
              Recruitment dates and weekly commitment are unconfirmed. Ask the
              club coordinator about the next intake, meeting time and how to
              apply.
            </p>
            <p>
              <a href="https://webstor.srmist.edu.in/web_assets/downloads/2023/sa-club-contact-details.pdf">
                Find the {name} contact in SRM’s directory (PDF)
              </a>{" "}
              ·{" "}
              <a href="https://www.srmist.edu.in/directorate-of-student-affairs/">
                Confirm with Student Affairs
              </a>
            </p>
          </details>
        ))}
      </div>
      {!found.length && (
        <p>
          No club matches.{" "}
          <button onClick={() => setQ("")}>Clear search</button>
        </p>
      )}
      <p className="source-note">
        <a href="https://www.srmist.edu.in/life-at-srm/student-life/clubs/">
          Official club profiles ↗
        </a>
      </p>
    </>
  );
}
