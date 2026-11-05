"use client";
import { useEffect, useState } from "react";
import events from "./events.json";
const format = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso + "T12:00:00Z"));
const todayIST = () =>
  new Date(Date.now() + 19800000).toISOString().slice(0, 10);
export default function EventList() {
  const [date, setDate] = useState(""),
    [range, setRange] = useState("Upcoming"),
    [q, setQ] = useState("");
  useEffect(() => {
    const refreshDate = () => setDate(todayIST());
    refreshDate();
    const timer = setInterval(() => setDate(todayIST()), 60000);
    return () => clearInterval(timer);
  }, []);
  const week = date
    ? new Date(Date.parse(date) + 6 * 86400000).toISOString().slice(0, 10)
    : "";
  const rows = events.filter(
    (e) =>
      e.title.toLowerCase().includes(q.toLowerCase()) &&
      (range === "Past"
        ? e.end < date
        : e.end >= date && (range !== "Next 7 days" || e.start <= week)),
  );
  return (
    <>
      <div className="filter-bar">
        <label>
          Search events
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="e.g. coding or alumni"
          />
        </label>
        <label>
          Date range
          <select value={range} onChange={(e) => setRange(e.target.value)}>
            {["Upcoming", "Next 7 days", "Past"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <p role="status">{rows.length} events</p>
      <div className="event-list">
        {rows.map((e) => (
          <a href={e.url} key={e.url}>
            <time dateTime={e.start}>
              {format(e.start)}
              {e.start !== e.end && " – " + format(e.end)}
            </time>
            <strong>{e.title}</strong>
            <b aria-hidden="true">↗</b>
          </a>
        ))}
      </div>
      {!rows.length && (
        <p>No matching events. Try a different time range or search.</p>
      )}
      <p className="source-note">
        Check registration status and deadlines on the organiser’s event page.{" "}
        <a href="https://www.srmist.edu.in/events/">Full SRM calendar ↗</a>
      </p>
    </>
  );
}
