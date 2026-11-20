import { randomBytes, randomUUID } from "node:crypto";
import { addDays, categories, indiaDate, itinerary, purposes, visitConfig } from "./config";
import type { Availability, Booking, Slot, Visitor } from "./types";

// Single-process demo adapter. All capacity checks and writes are synchronous:
// no asynchronous boundary may be added inside a mutation. A production adapter
// must replace this with a shared database transaction and unique constraints.
const globalStore = globalThis as typeof globalThis & { campusVisitBookings?: Map<string, Booking> };
const bookings = globalStore.campusVisitBookings ??= new Map<string, Booking>();
export class VisitError extends Error {
  constructor(message: string, public status = 422) { super(message); }
}
function prune() {
  const today = indiaDate();
  for (const [key, booking] of bookings) if (booking.slot.date < today) bookings.delete(key);
}
function closure(date: string, now = new Date()) {
  const today = indiaDate(now);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)) || new Date(`${date}T12:00:00Z`).toISOString().slice(0, 10) !== date) return "Invalid date";
  if (date < today || date > addDays(today, visitConfig.horizonDays)) return "Outside booking window";
  if (!visitConfig.weekdays.includes(new Date(`${date}T12:00:00Z`).getUTCDay())) return "No tours scheduled";
  if (visitConfig.holidays.includes(date.slice(5))) return "Demo holiday · No tours";
  if (visitConfig.exceptions[date]?.closed) return "Tours unavailable";
  return null;
}
function campus(id: string) {
  const result = visitConfig.campuses.find(c => c.id === id);
  if (!result) throw new VisitError("Choose a supported campus.");
  return result;
}
export function availability(campusId: string, date: string, now = new Date(), exclude?: string): Availability {
  prune();
  const c = campus(campusId);
  const today = indiaDate(now);
  const occupancy = new Map<string, number>();
  for (const b of bookings.values()) if (b.id !== exclude && b.status === "confirmed") occupancy.set(b.slot.id, (occupancy.get(b.slot.id) ?? 0) + 1 + b.visitor.accompanying);
  const slotsFor = (day: string): Slot[] => closure(day, now) ? [] : visitConfig.times.map(time => {
    const id = `${campusId}/${day}/${time.start}`;
    const capacity = visitConfig.exceptions[day]?.capacity ?? visitConfig.capacity;
    return { ...time, id, date: day, campusId, guide: `${c.name} / ${time.guide}`, itinerary, venue: c.venue, coordinator: c.coordinator, capacity, remaining: new Date(`${day}T${time.start}:00+05:30`) <= now ? 0 : Math.max(0, capacity - (occupancy.get(id) ?? 0)) };
  });
  return { today, maxDate: addDays(today, visitConfig.horizonDays), days: Array.from({ length: visitConfig.horizonDays + 1 }, (_, i) => { const day = addDays(today, i); return { date: day, reason: closure(day, now) || (slotsFor(day).every(s => s.remaining === 0) ? "No available batches" : null) }; }), slots: slotsFor(date) };
}
function object(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new VisitError("Invalid booking request.");
  return input as Record<string, unknown>;
}
function text(input: unknown, max = 160) {
  if (typeof input !== "string" || !input.trim() || input.length > max || /[\u0000-\u001f<>]/.test(input)) throw new VisitError("Please check your visitor details.");
  return input.trim();
}
export function validateVisitor(input: unknown): Visitor {
  const v = object(input);
  const name = text(v.name, 100), email = text(v.email, 254).toLowerCase(), phone = text(v.phone, 24);
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\+?[\d\s()-]{7,24}$/.test(phone) || phone.replace(/\D/g, "").length < 7 || phone.replace(/\D/g, "").length > 15) throw new VisitError("Enter a valid name, email and phone number.");
  if (!categories.includes(String(v.category)) || !purposes.includes(String(v.purpose))) throw new VisitError("Choose your visitor category and visit purpose.");
  if (typeof v.accompanying !== "number" || !Number.isInteger(v.accompanying) || v.accompanying < 0 || v.accompanying >= visitConfig.capacity) throw new VisitError("Choose between 0 and 24 accompanying visitors.");
  return { name, email, phone, category: String(v.category), purpose: String(v.purpose), accompanying: v.accompanying };
}
function chooseSlot(data: Record<string, unknown>, visitor: Visitor, exclude?: string) {
  const id = text(data.slotId);
  const [campusId, date] = id.split("/");
  const slot = availability(campusId, date, new Date(), exclude).slots.find(s => s.id === id);
  if (!slot || new Date(`${slot.date}T${slot.start}:00+05:30`) <= new Date()) throw new VisitError("This tour is no longer available. Choose another time.", 409);
  if (slot.remaining < 1 + visitor.accompanying) throw new VisitError("This batch no longer has enough places for your group. Choose another time.", 409);
  if ([...bookings.values()].some(b => b.id !== exclude && b.status === "confirmed" && b.visitor.email === visitor.email && b.slot.date === slot.date)) throw new VisitError("This email already has a visit on that date. Manage your existing booking instead.", 409);
  return slot;
}
export function findBooking(token: string) {
  prune();
  const b = bookings.get(token);
  if (!b) throw new VisitError("Booking unavailable. This temporary demo may have restarted or the pass has expired.", 404);
  return b;
}
export function verifiedPass(pass: string) {
  prune();
  const b = [...bookings.values()].find(b => b.pass === pass);
  if (!b) throw new VisitError("Pass not found or expired. Demo passes are temporary.", 404);
  return { id: b.id, status: b.status, slot: b.slot, visitors: 1 + b.visitor.accompanying };
}
export function mutateBooking(input: unknown): Booking {
  prune();
  const data = object(input);
  if (data.action === "cancel") {
    const booking = findBooking(text(data.token));
    if (new Date(`${booking.slot.date}T${booking.slot.start}:00+05:30`) <= new Date()) throw new VisitError("This tour has already started.", 409);
    booking.status = "cancelled";
    return booking;
  }
  if (data.action === "reschedule") {
    const booking = findBooking(text(data.token));
    if (booking.status !== "confirmed" || new Date(`${booking.slot.date}T${booking.slot.start}:00+05:30`) <= new Date()) throw new VisitError("Only an upcoming confirmed visit can be rescheduled.", 409);
    const slot = chooseSlot(data, booking.visitor, booking.id);
    booking.slot = slot;
    return booking;
  }
  if (data.action !== "book") throw new VisitError("Unknown booking action.");
  const visitor = validateVisitor(data.visitor);
  const requestId = text(data.requestId, 80);
  if (!/^[a-f\d-]{36}$/i.test(requestId)) throw new VisitError("Invalid booking request identifier.");
  const existing = [...bookings.values()].find(b => b.requestId === requestId);
  if (existing) {
    if (JSON.stringify(existing.visitor) !== JSON.stringify(visitor) || existing.slot.id !== data.slotId) throw new VisitError("Request already used. Start a new booking.", 409);
    return existing;
  }
  if (bookings.size >= 5000) throw new VisitError("The demo is at capacity. Please try again later.", 503);
  const slot = chooseSlot(data, visitor);
  const booking: Booking = { id: `SRM-${randomUUID().toUpperCase()}`, token: randomBytes(32).toString("hex"), pass: randomBytes(24).toString("hex"), requestId, visitor, slot, status: "confirmed", createdAt: new Date().toISOString() };
  bookings.set(booking.token, booking);
  return booking;
}
