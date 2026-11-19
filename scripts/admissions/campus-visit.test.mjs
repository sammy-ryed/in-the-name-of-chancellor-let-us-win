import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";

// Run against one local demo server: node --test scripts/admissions/campus-visit.test.mjs
const base = process.env.SRM_TEST_URL || "http://127.0.0.1:3000";
const api = `${base}/api/campus-visits`;
const nonce = randomUUID();
const visitor = (tag, accompanying = 0) => ({ name: "Campus Test Visitor", email: `${nonce}-${tag}@example.com`, phone: "+91 90000 00000", category: "Prospective student", purpose: "Explore programmes", accompanying });
const post = body => fetch(api, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
const available = (date, campus = "78") => fetch(`${api}?campus=${campus}${date ? `&date=${date}` : ""}`).then(r => r.json());
const book = (slotId, tag, accompanying = 0, requestId = randomUUID()) => post({ action: "book", slotId, visitor: visitor(tag, accompanying), requestId });

test("automated visit lifecycle, live passes, validation and concurrent capacity", async t => {
  const initial = await available();
  const days = initial.days.filter(d => !d.reason && d.date > initial.today).slice(-12);
  assert.ok(days.length >= 6);
  const date = days[0].date;
  const slots = (await available(date)).slots;
  const cleanup = [];
  try {
    await t.test("page and Admissions integration render with existing campus assets", async () => {
      const page = await (await fetch(`${base}/admissions/campus-visit`)).text();
      assert.match(page, /Your future/);
      assert.match(page, /begins with/);
      assert.match(page, /Schedule Your Visit/);
      assert.match(page, /id="book-visit"/);
      assert.match(page, /id="faq-title"/);
      const admissions = await (await fetch(`${base}/admissions`)).text();
      assert.match(admissions, /Schedule a Campus Visit/);
      assert.match(admissions, /Take the course finder quiz/);
      for (const asset of ["/campus/green-walkway.webp", "/campus/srm-university-lake.webp", "/home/subjects/agriculture.webp", "/research/laboratory.webp", "/home/clubs.webp"]) assert.equal((await fetch(`${base}${asset}`)).status, 200);
    });
    await t.test("server validates dates, campus, origin, body and personal information", async () => {
      assert.equal((await available("2020-01-01")).slots.length, 0);
      assert.equal((await available("2026-02-31")).slots.length, 0);
      assert.equal((await fetch(`${api}?campus=unknown`)).status, 422);
      assert.equal((await post({ action: "book", slotId: slots[0].id, requestId: randomUUID(), visitor: { ...visitor("invalid"), accompanying: 0.5 } })).status, 422);
      assert.equal((await post({ action: "book", slotId: slots[0].id, requestId: randomUUID(), visitor: { ...visitor("invalid"), email: "not-email" } })).status, 422);
      assert.equal((await book("78/2020-01-01/10:00", "past")).status, 409);
      assert.equal((await fetch(api, { method: "POST", headers: { "Content-Type": "application/json", Origin: "https://unrelated.example", "Sec-Fetch-Site": "cross-site" }, body: "{}" })).status, 403);
      assert.equal((await fetch(api, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" })).status, 400);
      const closed = initial.days.find(d => d.reason && d.reason !== "No available batches");
      if (closed) assert.equal((await available(closed.date)).slots.length, 0);
    });

    let booking;
    await t.test("save before confirmation, idempotent retry and duplicate prevention", async () => {
      const requestId = randomUUID();
      const response = await book(slots[0].id, "lead", 2, requestId);
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("cache-control"), "no-store");
      booking = (await response.json()).booking;
      cleanup.push(booking.token);
      assert.equal(booking.status, "confirmed");
      assert.equal(booking.slot.guide, slots[0].guide);
      assert.equal((await available(date)).slots[0].remaining, 22);
      const retry = (await (await book(slots[0].id, "lead", 2, requestId)).json()).booking;
      assert.equal(retry.id, booking.id);
      assert.equal((await available(date)).slots[0].remaining, 22);
      assert.equal((await book(slots[1].id, "lead")).status, 409);
      const restored = await (await fetch(api, { headers: { Authorization: `Bearer ${booking.token}` } })).json();
      assert.equal(restored.booking.id, booking.id);
      assert.equal((await fetch(api, { headers: { Authorization: "Bearer invalid" } })).status, 404);
    });

    await t.test("real QR, downloadable pass, calendar and private verification", async () => {
      const pass = `${api}/pass?token=${booking.token}`;
      const qr = await fetch(`${pass}&qr=1`);
      assert.equal(qr.status, 200);
      assert.match(qr.headers.get("content-type"), /svg/);
      assert.match(await qr.text(), /<path/);
      const download = await fetch(pass);
      assert.match(download.headers.get("content-disposition"), /attachment/);
      assert.match(await download.text(), /Campus Test Visitor/);
      const calendar = await (await fetch(`${pass}&format=ics`)).text();
      assert.match(calendar, /BEGIN:VCALENDAR/);
      assert.match(calendar, /DTSTART:\d{8}T043000Z/);
      const verification = await (await fetch(`${base}/admissions/campus-visit/verify?pass=${booking.pass}`)).text();
      assert.match(verification, /Pass verified/);
      assert.ok(!verification.includes(booking.visitor.email));
      assert.match(await (await fetch(`${base}/admissions/campus-visit/verify?pass=invalid`)).text(), /Pass unavailable/);
    });

    await t.test("rescheduling is atomic and cancellation releases places and revokes passes", async () => {
      assert.equal((await post({ action: "reschedule", token: booking.token, slotId: "78/2020-01-01/10:00" })).status, 409);
      assert.equal((await available(date)).slots[0].remaining, 22);
      const moved = (await (await post({ action: "reschedule", token: booking.token, slotId: slots[1].id })).json()).booking;
      assert.equal(moved.slot.id, slots[1].id);
      assert.equal((await available(date)).slots[0].remaining, 25);
      assert.equal((await available(date)).slots[1].remaining, 22);
      const cancelled = (await (await post({ action: "cancel", token: booking.token })).json()).booking;
      assert.equal(cancelled.status, "cancelled");
      assert.equal((await available(date)).slots[1].remaining, 25);
      assert.equal((await fetch(`${api}/pass?token=${booking.token}`)).status, 410);
      assert.match(await (await fetch(`${base}/admissions/campus-visit/verify?pass=${booking.pass}`)).text(), /Visit cancelled/);
    });

    await t.test("30 simultaneous single-person requests reserve exactly 25 places", async () => {
      const target = (await available(days[1].date)).slots[0];
      const responses = await Promise.all(Array.from({ length: 30 }, (_, i) => book(target.id, `concurrent-${i}`)));
      assert.equal(responses.filter(r => r.status === 200).length, 25);
      assert.equal(responses.filter(r => r.status === 409).length, 5);
      for (const response of responses.filter(r => r.status === 200)) cleanup.push((await response.json()).booking.token);
      assert.equal((await available(days[1].date)).slots[0].remaining, 0);
      const original = (await available(days[3].date)).slots[0];
      const mover = (await (await book(original.id, "reschedule-full", 1)).json()).booking;
      cleanup.push(mover.token);
      assert.equal((await post({ action: "reschedule", token: mover.token, slotId: target.id })).status, 409);
      assert.equal((await available(days[3].date)).slots[0].remaining, 23);
      const unchanged = await (await fetch(api, { headers: { Authorization: `Bearer ${mover.token}` } })).json();
      assert.equal(unchanged.booking.slot.id, original.id);
    });

    await t.test("whole groups cannot overflow a batch and full dates become unavailable", async () => {
      const groupDate = days[2].date;
      const groupSlots = (await available(groupDate)).slots;
      const first = await book(groupSlots[0].id, "large", 23);
      assert.equal(first.status, 200);
      cleanup.push((await first.json()).booking.token);
      assert.equal((await book(groupSlots[0].id, "too-many", 1)).status, 409);
      const last = await book(groupSlots[0].id, "last");
      assert.equal(last.status, 200);
      cleanup.push((await last.json()).booking.token);
      for (const slot of groupSlots.slice(1)) {
        const r = await book(slot.id, `full-${slot.start}`, 24);
        assert.equal(r.status, 200);
        cleanup.push((await r.json()).booking.token);
      }
      const full = await available(groupDate);
      assert.equal(full.days.find(d => d.date === groupDate).reason, "No available batches");
      assert.ok(full.slots.every(s => s.remaining === 0));
      assert.equal((await available(groupDate, "408")).slots[0].remaining, 25);
    });
  } finally {
    for (const token of cleanup) await post({ action: "cancel", token });
  }
});
