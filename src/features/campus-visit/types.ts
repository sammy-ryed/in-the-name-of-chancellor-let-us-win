export type Visitor = { name: string; email: string; phone: string; category: string; purpose: string; accompanying: number };
export type Slot = { id: string; campusId: string; date: string; start: string; end: string; capacity: number; remaining: number; guide: string; venue: string; coordinator: string; itinerary: { time: string; title: string; text: string }[] };
export type Availability = { today: string; maxDate: string; days: { date: string; reason: string | null }[]; slots: Slot[] };
export type Booking = { id: string; token: string; pass: string; requestId: string; visitor: Visitor; slot: Slot; status: "confirmed" | "cancelled"; createdAt: string };
