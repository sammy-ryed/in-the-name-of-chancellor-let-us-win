"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
type Item = {
  id: string;
  name: string;
  degree: string;
  faculty: string;
  campus: string;
  level: string;
  duration: string;
  fee: string;
  period: string;
};
export default function Finder({
  initialFaculty,
  records,
  faculties,
}: {
  initialFaculty: string;
  records: Item[];
  faculties: Record<string, string>;
}) {
  const [query, setQuery] = useState(""),
    [faculty, setFaculty] = useState(initialFaculty),
    [campus, setCampus] = useState(""),
    [level, setLevel] = useState(""),
    [limit, setLimit] = useState(12),
    [picked, setPicked] = useState<string[]>([]);
  const matches = useMemo(
    () =>
      records.filter(
        (c) =>
          (!faculty || faculty === c.faculty) &&
          (!campus || campus === c.campus) &&
          (!level || level === c.level) &&
          query
            .toLowerCase()
            .trim()
            .split(/\s+/)
            .every((w) =>
              (
                c.name +
                " " +
                c.degree +
                " " +
                faculties[c.faculty] +
                " " +
                c.campus
              )
                .toLowerCase()
                .includes(w),
            ),
      ),
    [records, faculty, campus, level, query, faculties],
  );
  const selected = picked.map((id) => records.find((c) => c.id === id)!);
  function clear() {
    setQuery("");
    setFaculty("");
    setCampus("");
    setLevel("");
    setLimit(12);
  }
  const select = (
    label: string,
    val: string,
    update: (s: string) => void,
    options: [string, string][],
  ) => (
    <label>
      {label}
      <select
        value={val}
        onChange={(e) => {
          update(e.target.value);
          setLimit(12);
        }}
      >
        <option value="">All {label.toLowerCase()}</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
  const options = (key: "campus" | "level") =>
    Array.from(new Set(records.map((c) => c[key])))
      .sort()
      .map((s) => [s, s] as [string, string]);
  return (
    <>
      <div className="filter-bar">
        <label>
          Search courses
          <input
            type="search"
            value={query}
            placeholder="e.g. DevSecOps or Psychology"
            onChange={(e) => {
              setQuery(e.target.value);
              setLimit(12);
            }}
          />
        </label>
        {select("Faculties", faculty, setFaculty, Object.entries(faculties))}
        {select("Campuses", campus, setCampus, options("campus"))}
        {select("Study levels", level, setLevel, options("level"))}
      </div>
      <div className="result-meta">
        <strong role="status">
          {matches.length} course and campus options
        </strong>
        <button onClick={clear}>Clear filters</button>
      </div>
      {selected.length > 0 && (
        <div className="comparison">
          <h3>Compare programmes</h3>
          <div className="compare-grid">
            {selected.map((c) => (
              <div key={c.id}>
                <strong>
                  {c.degree} · {c.name}
                </strong>
                <p>
                  {c.campus} · {c.duration}
                </p>
                <p>
                  {c.period}: {c.fee}
                </p>
                <button
                  onClick={() => setPicked(picked.filter((id) => id !== c.id))}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="course-grid">
        {matches.slice(0, limit).map((c) => (
          <article className="course-card" key={c.id}>
            <small>
              {c.degree} / {c.campus}
            </small>
            <h3>
              <Link href={"/programmes/" + c.id}>{c.name}</Link>
            </h3>
            <p>
              {c.duration || "Duration on faculty page"} · {c.level}
            </p>
            <div className="fee">
              <small>{c.period}</small>
              <strong>{c.fee}</strong>
            </div>
            <div className="card-actions">
              <Link
                className="guide-action yellow-action"
                href={"/programmes/" + c.id}
              >
                View course ↗
              </Link>
              <label>
                <input
                  type="checkbox"
                  checked={picked.includes(c.id)}
                  disabled={!picked.includes(c.id) && picked.length >= 3}
                  onChange={(e) =>
                    setPicked(
                      e.target.checked
                        ? [...picked, c.id]
                        : picked.filter((id) => id !== c.id),
                    )
                  }
                />{" "}
                Compare
              </label>
            </div>
          </article>
        ))}
      </div>
      {!matches.length && (
        <p className="empty">
          No courses match. Try a broader search or clear your filters.
        </p>
      )}
      {matches.length > limit && (
        <button
          className="guide-action yellow-action"
          onClick={() => setLimit(limit + 12)}
        >
          Show more courses ↓
        </button>
      )}
    </>
  );
}
