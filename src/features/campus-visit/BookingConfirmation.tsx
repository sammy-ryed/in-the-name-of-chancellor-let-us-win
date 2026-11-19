"use client";

import Image from "next/image";
import { useState, type RefCallback } from "react";
import { prettyDate, prettyTime, visitConfig } from "./config";
import type { Booking } from "./types";
import "./confirmation.css";

type Props = {
  booking: Booking;
  busy: boolean;
  error: string;
  cancelPrompt: boolean;
  focusHeading: RefCallback<HTMLHeadingElement>;
  onReschedule: () => void;
  onCancelPrompt: (open: boolean) => void;
  onCancel: () => void;
  onNewBooking: () => void;
};

export function BookingConfirmation({ booking, busy, error, cancelPrompt, focusHeading, onReschedule, onCancelPrompt, onCancel, onNewBooking }: Props) {
  const [qrError, setQrError] = useState(false);
  const [qrAttempt, setQrAttempt] = useState(0);
  const campus = visitConfig.campuses.find(c => c.id === booking.slot.campusId)!;
  const visitors = booking.visitor.accompanying + 1;
  const passUrl = `/api/campus-visits/pass?token=${booking.token}`;
  const guide = booking.slot.guide.replace(`${campus.name} / `, "");
  const coordinator = booking.slot.coordinator.replace(/^Demo\s+/i, "");

  return <>
    <div className="cv-confirmation-layout">
      <aside className="cv-booking-aside cv-confirmation-campus" aria-label="About your campus visit">
        <figure className="cv-booking-portrait"><Image src="/campus/tech-park.webp" alt="Students arriving at SRM Tech Park" fill sizes="(max-width: 680px) 100vw, 25vw"/><figcaption>On campus / SRM Tech Park</figcaption></figure>
        <h3>A guided introduction<br/>to campus life.</h3>
        <dl className="cv-visit-facts">
          <div><dt>Duration</dt><dd>Approximately one hour</dd></div>
          <div><dt>Tour format</dt><dd>A shared batch with a campus guide</dd></div>
          <div><dt>Visitor count</dt><dd>{visitors} {visitors === 1 ? "visitor" : "visitors"}, including you</dd></div>
        </dl>
        <p className="cv-confirmation-location">{campus.location}</p>
      </aside>

      <section className="cv-confirmation-details cv-step-content" aria-labelledby="cv-confirmation-title">
        <header className="cv-confirmation-heading">
          <svg className="cv-confirmed-mark" viewBox="0 0 48 48" aria-hidden="true"><path d="M7 25 18 36 41 12"/></svg>
          <p className="cv-confirmation-status">Visit confirmed</p>
          <h3 id="cv-confirmation-title" className="cv-step-title" ref={focusHeading} tabIndex={-1}>See you on campus.</h3>
          <p>Your campus visit has been scheduled. Your visit details and entry pass are below.</p>
        </header>
        <dl className="cv-confirmation-summary">
          <div><dt>Campus</dt><dd>{campus.name}</dd></div>
          <div><dt>Visit date</dt><dd>{prettyDate(booking.slot.date)}</dd></div>
          <div><dt>Visit time</dt><dd>{prettyTime(booking.slot.start)} – {prettyTime(booking.slot.end)} <span className="cv-confirmation-timezone">IST</span></dd></div>
          <div><dt>Reporting venue</dt><dd>{booking.slot.venue}</dd></div>
          <div><dt>Lead visitor</dt><dd>{booking.visitor.name}<small>{visitors} {visitors === 1 ? "person" : "people"} in your group · {booking.visitor.category}</small></dd></div>
          <div><dt>Contact</dt><dd>{booking.visitor.email}<small>{booking.visitor.phone}</small></dd></div>
          <div><dt>Purpose</dt><dd>{booking.visitor.purpose}</dd></div>
          <div><dt>Campus guide</dt><dd>{guide}</dd></div>
          {coordinator && <div><dt>Visit coordinator</dt><dd>{coordinator}</dd></div>}
        </dl>
        <div className="cv-confirmation-manage" aria-label="Manage your visit">
          <button type="button" disabled={busy} onClick={onReschedule}>Reschedule visit</button>
          <button type="button" disabled={busy} onClick={() => onCancelPrompt(true)}>Cancel visit</button>
          <button type="button" disabled={busy} onClick={onNewBooking}>Book for another visitor</button>
        </div>
        {cancelPrompt && <div className="cv-confirmation-cancel" role="group" aria-label="Confirm cancellation"><p>Cancel this visit and release all {visitors} {visitors === 1 ? "place" : "places"}? Your pass will become invalid.</p><button type="button" className="cv-button" disabled={busy} onClick={onCancel}>{busy ? "Cancelling…" : "Yes, cancel visit"}</button><button type="button" className="cv-text-button" disabled={busy} onClick={() => onCancelPrompt(false)}>Keep my visit</button></div>}
        {error && <p className="cv-error" role="alert">{error}</p>}
      </section>

      <aside className="cv-entry-ticket" aria-labelledby="cv-entry-pass-title">
        <span className="cv-ticket-separator" aria-hidden="true"/>
        <h4 id="cv-entry-pass-title">Campus Entry Pass</h4>
        <p className="cv-entry-campus">SRM · {campus.name}</p>
        <div className="cv-entry-qr">
          <Image key={qrAttempt} unoptimized src={`${passUrl}&qr=1`} width={256} height={256} alt={`QR entry pass for booking ${booking.id}`} onError={() => setQrError(true)}/>
        </div>
        {qrError && <p className="cv-entry-error" role="alert">Your QR pass could not load. <button type="button" onClick={() => { setQrError(false); setQrAttempt(n => n + 1); }}>Try again</button> or download your entry pass below.</p>}
        <div className="cv-entry-reference"><span>Booking reference</span><strong>{booking.id}</strong></div>
        <p className="cv-entry-instructions">Keep this pass and a photo ID ready at your reporting venue. Please arrive 15 minutes before your tour.</p>
        <div className="cv-entry-actions"><a className="cv-pass-button" href={passUrl} download>Download entry pass</a><a className="cv-pass-button cv-pass-button-secondary" href={`${passUrl}&format=ics`} download>Add to calendar</a></div>
      </aside>
    </div>
  </>;
}
