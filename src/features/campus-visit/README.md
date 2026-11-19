# Campus visits

The page at `/admissions/campus-visit` follows the site's global typography, colours, navigation rail, footer and accessibility preferences. The campus IDs and names match the existing programme catalogue. Acharapakkam uses an explicitly captioned agricultural learning image rather than claiming it is a campus photograph.

## Demo boundary

This is a functional **single-process, in-memory demonstration**, not an official booking integration. Reservations survive navigation and development module reloads in the same process, but disappear on server restart, process replacement or expiry after the visit date. There is no database, email delivery, SMS or administrator integration. A sessionStorage management token restores the latest booking in the same browser session. Public QR tokens are distinct from management tokens and reveal no visitor contact details.

Run with one Next.js process. Multiple replicas, independent serverless functions and separate workers do **not** share this store. Before production, replace `service.ts` with a persistent shared database adapter. Use a database transaction with a locked batch row (or conditional capacity update), a unique booking-request key, and an active email/date uniqueness constraint. Capacity reservation, cancellation and rescheduling must commit in the same transaction. Do not deploy the demo adapter as a durable reservation service.

## Schedule configuration

`config.ts` holds the campus catalogue, recurring weekdays, 90-day window, four batches, shared guides, 25-person capacity, sample holidays, date exceptions, visitor categories and tour itinerary. All schedule and visitor guidance content is illustrative and needs university confirmation. Dates and tour start checks use Asia/Kolkata, independent of the server/browser timezone. Guide assignments belong to the batch, not each visitor. Total visitors always includes the lead visitor.

The synchronous mutation boundary has no awaits between validation and writing. It prevents simultaneous requests in **one Node process** from overbooking. Retrying the same successful request returns the saved booking without consuming more capacity. Failed rescheduling leaves the existing visit untouched. Cancellation releases capacity and invalidates the live QR pass.

## Endpoints

- `GET /api/campus-visits?campus=78&date=YYYY-MM-DD`: closure calendar and current batch capacity, uncached.
- `GET /api/campus-visits` with `Authorization: Bearer <management token>`: restore one private booking.
- `POST /api/campus-visits`: `book`, `cancel`, or `reschedule`; validates same-origin JSON using the existing request reader.
- `GET /api/campus-visits/pass?token=...`: downloadable SVG visit pass; `qr=1` serves its real QR SVG, `format=ics` downloads an event in UTC. Credentials use no-store/no-referrer headers.
- `/admissions/campus-visit/verify?pass=...`: live, noindex verification. QR codes use a separate opaque token; cancelled/unknown/expired passes cannot verify as upcoming confirmed visits. Re-download passes and replace calendar events after rescheduling.

`qrcode` encodes scannable QR passes. `@gsap/react` supplies the page motion's React lifecycle helper; GSAP itself was already installed.

## Page motion

`VisitMotion.tsx` owns the page-scoped GSAP scene: SplitText masks, coordinated hero timelines, ScrollTrigger image treatments, an itinerary line drawn with DrawSVG, and precise-pointer CTA feedback. `BookingMotion.tsx` owns Flip progress transitions, month/selection feedback, step entrances, validation feedback and the saved-confirmation sequence. This route no longer uses Motion animation components. The static page still renders on the server; the client scene receives it as children.

All animations use `@gsap/react` contexts, with cleanup on unmount and on motion-preference changes. SplitText instances, image listeners, resize observers and pointer listeners are reverted/disconnected. Both OS reduced motion and the site's existing Reduce motion preference turn off the scene and booking effects immediately. Shared chrome, footer and backend handlers are outside the animation scopes. Keyboard focus moves directly to each step heading, without waiting for an animation. The QR is readable in the settled pass; success is conditional on the existing saved booking state. No scroll interception, cursor replacement or forced pinning is used.

## Validation commands

Run `npm run typecheck`, `npm run lint`, and `npm run build`. With a single local server running, run `node --test scripts/admissions/campus-visit.test.mjs` (or set `SRM_TEST_URL`). Integration tests exercise validation, holidays, idempotency, duplicates, QR/pass/calendar delivery, verification, restoration, cancellation, rescheduling, whole-group limits, campus isolation, full-date handling and 30 concurrent requests for 25 places. Tests release their reservations afterward.
