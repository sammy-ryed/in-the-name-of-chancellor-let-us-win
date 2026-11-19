export type Shortlist = [string, string, string];

const storageKey = "srm-course-shortlist-v1";
export const shortlistChanged = "srm-course-shortlist-change";
let lastSaved = "";

export function parseShortlist(value: string): Shortlist {
  const slots: Shortlist = ["", "", ""];
  const seen = new Set<string>();
  value.split(",").slice(0, 3).forEach((id, index) => {
    if (/^[a-f0-9]{11}$/.test(id) && !seen.has(id)) {
      slots[index] = id;
      seen.add(id);
    }
  });
  return slots;
}

export function readShortlistValue() {
  if (typeof window === "undefined") return "";
  try { return window.sessionStorage.getItem(storageKey) ?? lastSaved; }
  catch { return lastSaved; }
}

export function readShortlist(): Shortlist {
  return parseShortlist(readShortlistValue());
}

export function writeShortlist(slots: readonly string[]) {
  if (typeof window === "undefined") return;
  lastSaved = parseShortlist(slots.join(",")).join(",");
  try { window.sessionStorage.setItem(storageKey, lastSaved); } catch { /* Keep the in-memory selection. */ }
  window.dispatchEvent(new Event(shortlistChanged));
}

export function addToShortlist(slots: readonly string[], id: string): Shortlist {
  const next = parseShortlist(slots.join(","));
  const free = next.indexOf("");
  if (free !== -1 && /^[a-f0-9]{11}$/.test(id) && !next.includes(id)) next[free] = id;
  return next;
}

export function comparisonHref(slots: readonly string[]) {
  const query = parseShortlist(slots.join(",")).join(",").replace(/,+$/, "");
  return query ? "/programmes/compare?compare=" + encodeURIComponent(query) : "/programmes/compare";
}
