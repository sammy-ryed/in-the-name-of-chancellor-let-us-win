import type { Shortlist } from "@/features/explore/shortlist";

export function eligibleFinderSlots(slots: Shortlist, eligibleIds: ReadonlySet<string>): Shortlist {
  // Slot letters also appear in shared URLs. Keep the remaining courses in place.
  const keep = (id: string) => eligibleIds.has(id) ? id : "";
  return [keep(slots[0]), keep(slots[1]), keep(slots[2])];
}
