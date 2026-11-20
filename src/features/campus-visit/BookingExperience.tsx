"use client";

import Image from "next/image";
import { BookingProgress, useBookingMotion } from "./BookingMotion";
import { BookingConfirmation } from "./BookingConfirmation";
import { useCallback, useEffect, useRef, useState } from "react";
import { categories, prettyDate, prettyTime, purposes, visitConfig } from "./config";
import type { Availability, Booking, Slot, Visitor } from "./types";

const emptyVisitor: Visitor = { name: "", email: "", phone: "", category: "", purpose: "", accompanying: 0 };
const endpoint = "/api/campus-visits";
async function readResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}
function remember(token: string) { try { sessionStorage.setItem("srm-visit-token", token); } catch { /* Booking remains usable without storage. */ } }
function Summary({ slot, visitor }: { slot: Slot; visitor: Visitor }) {
  const c = visitConfig.campuses.find(c => c.id === slot.campusId)!;
  return <dl className="cv-summary">
    <div><dt>Campus</dt><dd>{c.name}<small>{c.location}</small></dd></div>
    <div><dt>Your visit</dt><dd>{prettyDate(slot.date)}<small>{prettyTime(slot.start)} – {prettyTime(slot.end)} · India Standard Time</small></dd></div>
    <div><dt>Meeting point</dt><dd>{slot.venue}</dd></div>
    <div><dt>Visitors</dt><dd>{visitor.accompanying + 1} {visitor.accompanying === 0 ? "person" : "people"}<small>{visitor.name} · {visitor.category}</small></dd></div>
    <div><dt>Contact details</dt><dd>{visitor.email}<small>{visitor.phone}</small></dd></div>
    <div><dt>Purpose</dt><dd>{visitor.purpose}</dd></div>
  </dl>;
}

export function BookingExperience() {
  const [step, setStep] = useState(0);
  const [campusId, setCampusId] = useState("");
  const [date, setDate] = useState("");
  const [month, setMonth] = useState("");
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [visitor, setVisitor] = useState<Visitor>(emptyVisitor);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [rescheduling, setRescheduling] = useState(false);
  const [cancelPrompt, setCancelPrompt] = useState(false);
  const [error, setError] = useState("");
  const [availabilityError, setAvailabilityError] = useState("");
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [restoring, setRestoring] = useState(true);
  const [retry, setRetry] = useState(0);
  const [requestId, setRequestId] = useState("");
  const focusNext = useRef(false);
  const inFlight = useRef(false);
  const focusHeading = useCallback((node: HTMLHeadingElement | null) => {
    if (node && focusNext.current) { node.focus(); focusNext.current = false; }
  }, []);
  const motionRoot = useRef<HTMLDivElement>(null);
  useBookingMotion(motionRoot, { step, restoring, month, date, slotId: slot?.id, campusId, status: booking?.status, loading, busy, error });

  useEffect(() => {
    let active = true;
    let token: string | null = null;
    try { token = sessionStorage.getItem("srm-visit-token"); } catch { /* Storage is optional. */ }
    async function restore() {
      try {
        if (token) {
          const { booking: b } = await readResponse<{ booking: Booking }>(await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }));
          if (active) { setBooking(b); setVisitor(b.visitor); setCampusId(b.slot.campusId); setSlot(b.slot); setDate(b.slot.date); setStep(4); }
        }
      } catch (e) { if (active) setError(e instanceof Error ? e.message : "Unable to restore your demo booking."); }
      finally { if (active) setRestoring(false); }
    }
    void restore();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!campusId) return;
    const controller = new AbortController();
    async function load() {
      setLoading(true); setAvailabilityError("");
      try {
        const data = await readResponse<Availability>(await fetch(`${endpoint}?campus=${campusId}${date ? `&date=${date}` : ""}`, { signal: controller.signal, cache: "no-store" }));
        if (!controller.signal.aborted) { setAvailability(data); setMonth(m => m || data.today.slice(0, 7)); }
      } catch (e) { if (!controller.signal.aborted) setAvailabilityError(e instanceof Error ? e.message : "Unable to load tour times."); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    }
    void load();
    return () => controller.abort();
  }, [campusId, date, retry]);

  const total = visitor.accompanying + 1;
  const selectedLive = availability?.slots.find(s => s.id === slot?.id);
  const canFit = !!selectedLive && selectedLive.remaining >= total;
  const campus = visitConfig.campuses.find(c => c.id === campusId);
  function changeStep(next: number) { focusNext.current = true; setError(""); setStep(next); }
  function newBooking() {
    focusNext.current = true;
    setBooking(null); setStep(0); setSlot(null); setDate(""); setRescheduling(false); setCancelPrompt(false); setVisitor(emptyVisitor); setRequestId(""); setError("");
    try { sessionStorage.removeItem("srm-visit-token"); } catch { /* Optional. */ }
  }
  async function save(action: "book" | "reschedule" | "cancel") {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true); setError("");
    const key = requestId || crypto.randomUUID();
    if (action === "book") setRequestId(key);
    try {
      const payload = action === "book" ? { action, requestId: key, visitor, slotId: slot?.id } : { action, token: booking?.token, slotId: slot?.id };
      const { booking: saved } = await readResponse<{ booking: Booking }>(await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }));
      focusNext.current = true;
      setBooking(saved); setSlot(saved.slot); remember(saved.token); setRescheduling(false); setCancelPrompt(false); setStep(4);
    } catch (e) { setError(e instanceof Error ? e.message : "We could not save your booking. Please retry."); setRetry(r => r + 1); }
    finally { inFlight.current = false; setBusy(false); }
  }
  function moveMonth(delta: number) {
    const d = new Date(`${month}-01T12:00:00Z`); d.setUTCMonth(d.getUTCMonth() + delta); setMonth(d.toISOString().slice(0, 7));
  }
  const firstDay = month ? new Date(`${month}-01T12:00:00Z`) : null;
  const calendarDays = firstDay ? new Date(Date.UTC(firstDay.getUTCFullYear(), firstDay.getUTCMonth() + 1, 0)).getUTCDate() : 0;
  const nextStep = rescheduling ? 3 : 2;
  const field = (name: keyof Visitor, value: string | number) => { setVisitor(v => ({ ...v, [name]: value })); setRequestId(""); };

  const isConfirmation = step === 4 && booking?.status === "confirmed";

  return <div ref={motionRoot} className={`cv-booking${isConfirmation ? " cv-confirmation" : ""}`} aria-busy={busy || restoring}><div className="cv-busy-bar" aria-hidden="true"/>
    <BookingProgress step={step}/>
    {isConfirmation && booking ? <BookingConfirmation booking={booking} busy={busy} error={error} cancelPrompt={cancelPrompt} focusHeading={focusHeading}
      onReschedule={() => { setRescheduling(true); setDate(""); setSlot(null); setMonth(""); changeStep(1); }}
      onCancelPrompt={setCancelPrompt} onCancel={() => void save("cancel")} onNewBooking={newBooking}/>
      : <div className="cv-booking-body">
      <aside className="cv-booking-aside">
        <figure className="cv-booking-portrait"><Image src="/campus/tech-park.webp" alt="Students arriving at SRM Tech Park" fill sizes="25vw"/><figcaption>On campus / SRM Tech Park</figcaption></figure>
        <p className="cv-eyebrow">Your visit</p>
        <h3>A guided introduction<br/>to campus life.</h3>
        <dl className="cv-visit-facts">
          <div><dt>Duration</dt><dd>Approximately one hour</dd></div>
          <div><dt>Tour format</dt><dd>A shared batch with a campus guide</dd></div>
          <div><dt>Your group</dt><dd>{total} {total === 1 ? "visitor" : "visitors"}, including you</dd></div>
        </dl>
        {campus && <p className="cv-selection-note">Selected campus<br/><strong>{campus.name}</strong>{date && <><br/>{prettyDate(date)}</>}{slot && <><br/>{prettyTime(slot.start)} – {prettyTime(slot.end)} IST</>}</p>}
      </aside>
      <div className="cv-form-panel">
        {restoring ? <p role="status">Checking for an existing demo booking…</p> : <div className="cv-step-content" key={step}>
          <h3 ref={focusHeading} tabIndex={-1} className="cv-step-title">{["Choose your campus", "Choose your date & time", "Visitor information", "Review your visit", booking?.status === "cancelled" ? "Your visit is cancelled." : "See you on campus."][step]}</h3>
          {step === 0 && <><p>Select a campus to see its available tour batches.</p><div className="cv-campus-options" role="group" aria-label="Choose your campus">{visitConfig.campuses.map(c => <button type="button" className={`cv-campus-option ${campusId === c.id ? "is-selected" : ""}`} key={c.id} aria-pressed={campusId === c.id} onClick={() => { setCampusId(c.id); setSlot(null); setDate(""); setRequestId(""); }}><div className={`cv-campus-image${c.image ? "" : " cv-campus-identity"}`}>{c.image ? <Image src={c.image} alt={c.imageAlt} fill sizes="(max-width: 600px) 75vw, 25vw"/> : <div aria-hidden="true"><span>SRM</span><small>{c.name}</small></div>}</div><div className="cv-campus-label"><strong>{c.name}</strong><small>{c.location}</small>{c.id === "408" && <small>Image: agricultural learning at SRM</small>}</div></button>)}</div><div className="cv-form-actions"><span>{campus ? `${campus.name} selected` : "Select a campus to continue"}</span><button className="cv-button" disabled={!campusId} onClick={() => changeStep(1)}>Choose date & time</button></div></>}
          {step === 1 && <><p>Tours run Monday to Saturday. All times are in IST (UTC +05:30).</p><div className="cv-group-size"><label htmlFor="cv-group">Your group, including you</label><input id="cv-group" type="number" min="1" max="25" disabled={rescheduling} value={total} onChange={e => { field("accompanying", Math.min(24, Math.max(0, Number(e.target.value) - 1))); setSlot(null); }}/><span>Maximum {visitConfig.capacity} per batch</span></div>
            {availabilityError ? <div className="cv-error" role="alert">{availabilityError} <button type="button" onClick={() => setRetry(r => r + 1)}>Retry availability</button></div> : !availability || !month ? <p role="status">Loading the visit calendar…</p> : <div className="cv-schedule-grid"><div className="cv-calendar"><div className="cv-month"><button type="button" aria-label="Previous month" disabled={month <= availability.today.slice(0, 7)} onClick={() => moveMonth(-1)}>Prev</button><strong aria-live="polite">{firstDay?.toLocaleDateString("en-IN", { month: "long", year: "numeric", timeZone: "UTC" })}</strong><button type="button" aria-label="Next month" disabled={month >= availability.maxDate.slice(0, 7)} onClick={() => moveMonth(1)}>Next</button></div><div className="cv-weekdays" aria-hidden="true">{["M", "T", "W", "T", "F", "S", "S"].map((day, i) => <span key={i}>{day}</span>)}</div><div className="cv-calendar-days" role="group" aria-label="Available visit dates">{Array.from({ length: ((firstDay?.getUTCDay() ?? 1) + 6) % 7 }, (_, i) => <span key={`blank-${i}`}/>)}{Array.from({ length: calendarDays }, (_, i) => { const day = `${month}-${String(i + 1).padStart(2, "0")}`; const found = availability.days.find(d => d.date === day); const reason = found?.reason ?? (!found ? "Outside booking window" : ""); return <button type="button" key={day} disabled={!!reason} aria-label={`${prettyDate(day)}${reason ? `, ${reason}` : ""}`} title={reason || undefined} aria-pressed={date === day} onClick={() => { setDate(day); setSlot(null); setRequestId(""); }}>{i + 1}</button>; })}</div><p className="cv-fine">Unavailable dates are greyed out. Booking opens {visitConfig.horizonDays} days ahead. Holidays follow the sample schedule.</p></div>
            <div className="cv-slots" aria-busy={loading}><h4>{date ? prettyDate(date) : "Choose a date to begin"}</h4>{loading ? <p role="status">Checking live capacity…</p> : !date ? <p>Pick an available date on the calendar to explore tour times.</p> : availability.slots.length === 0 ? <p>No tours on this date. Please choose another day.</p> : <div role="group" aria-label="Available tour batches">{availability.slots.map(s => { const unavailable = s.remaining < total; return <button type="button" key={s.id} className="cv-slot" disabled={unavailable} aria-pressed={slot?.id === s.id} onClick={() => { setSlot(s); setRequestId(""); }}><strong>{prettyTime(s.start)} – {prettyTime(s.end)}</strong><span>{s.remaining === 0 ? "Unavailable / full or started" : unavailable ? `Only ${s.remaining} places · Group too large` : `${s.remaining} of ${s.capacity} places available`}</span><small>{s.venue}</small></button>; })}</div>}{date && !loading && availability.slots.length > 0 && availability.slots.every(s => s.remaining < total) && <p className="cv-fine">No batch can fit your group. Choose another date or a smaller group.</p>}</div></div>}
            <div className="cv-form-actions"><button className="cv-text-button" onClick={() => rescheduling ? (setRescheduling(false), setSlot(booking!.slot), changeStep(4)) : changeStep(0)}>{rescheduling ? "Keep current visit" : "Campus"}</button><button className="cv-button" disabled={!slot || !canFit || loading || !!availabilityError} onClick={() => changeStep(nextStep)}>{rescheduling ? "Review new time" : "Your details"}</button></div></>}
          {step === 2 && <form onSubmit={e => { e.preventDefault(); changeStep(3); }}><p>Enter the lead visitor’s details and include everyone coming with you.</p><div className="cv-fields"><label>Full name<input autoComplete="name" name="name" required minLength={2} maxLength={100} value={visitor.name} onChange={e => field("name", e.target.value)}/></label><label>Email address<input autoComplete="email" name="email" type="email" required maxLength={254} value={visitor.email} onChange={e => field("email", e.target.value)}/></label><label>Phone number<input autoComplete="tel" name="phone" type="tel" required pattern="\+?[0-9 ()\-]{7,24}" maxLength={24} value={visitor.phone} onChange={e => field("phone", e.target.value)}/></label><label>Visitor category<select required value={visitor.category} onChange={e => field("category", e.target.value)}><option value="">Select category</option>{categories.map(c => <option key={c}>{c}</option>)}</select></label><label>Purpose of visit<select required value={visitor.purpose} onChange={e => field("purpose", e.target.value)}><option value="">Select purpose</option>{purposes.map(p => <option key={p}>{p}</option>)}</select></label><label>Accompanying visitors<input type="number" required min="0" max="24" value={visitor.accompanying} onChange={e => field("accompanying", Number(e.target.value))}/><small>Excluding you · Total group: {total}</small></label></div>{!canFit && <p className="cv-error">Your group is too large for the selected batch, or availability changed. Go back to choose another time.</p>}<div className="cv-form-actions"><button type="button" className="cv-text-button" onClick={() => changeStep(1)}>Date & time</button><button className="cv-button" disabled={!canFit}>Review your visit</button></div></form>}
          {step === 3 && slot && <><p>{rescheduling ? "Your existing reservation stays in place until the new time is saved." : "Your group will join a scheduled batch with its assigned campus guide."}</p><Summary slot={slot} visitor={visitor}/><div className="cv-form-actions"><button className="cv-text-button" disabled={busy} onClick={() => changeStep(rescheduling ? 1 : 2)}>Edit details</button><button className="cv-button" disabled={busy} onClick={() => void save(rescheduling ? "reschedule" : "book")}>{busy ? "Saving your visit…" : rescheduling ? "Confirm new time" : "Confirm your visit"}</button></div>{error && <button className="cv-text-button" disabled={busy} onClick={() => { changeStep(1); }}>Choose another date or time</button>}</>}
          {step === 4 && booking && <><p>Your places have been released for other visitors. Your QR pass is no longer valid.</p><div className="cv-booking-id"><span>Booking reference</span><strong>{booking.id}</strong></div><Summary slot={booking.slot} visitor={booking.visitor}/><button className="cv-text-button" disabled={busy} onClick={newBooking}>Schedule another visit</button></>}
        </div>}
        {error && <p className="cv-error" role="alert">{error}</p>}
      </div>
    </div>}
    <noscript><p className="cv-demo">Please enable JavaScript to use the interactive booking calendar, or <a href="/admissions#enquiry">contact Admissions</a> about a campus visit.</p></noscript>
  </div>;
}
