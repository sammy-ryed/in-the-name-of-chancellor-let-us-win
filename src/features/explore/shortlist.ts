export type Shortlist = [string, string, string];

export type ShortlistScope = "directory" | "finder";

export function shortlistScope(from: string | null | undefined): ShortlistScope {
  return from === "finder" ? "finder" : "directory";
}

const storageKey: Record<ShortlistScope, string> = {
  directory: "srm-course-shortlist-v1", finder: "srm-course-finder-shortlist-v1",
};
export const shortlistChanged = "srm-course-shortlist-change";
const lastSaved = { directory: "", finder: "" };
const memoryOnly = { directory: false, finder: false };

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

export function readShortlistValue(scope: ShortlistScope = "directory") {
  if (typeof window === "undefined") return "";
  if (memoryOnly[scope]) return lastSaved[scope];
  try { return window.sessionStorage.getItem(storageKey[scope]) ?? ""; }
  catch { return lastSaved[scope]; }
}

export function readShortlist(scope: ShortlistScope = "directory"): Shortlist {
  return parseShortlist(readShortlistValue(scope));
}

export function writeShortlist(slots: readonly string[], scope: ShortlistScope = "directory") {
  if (typeof window === "undefined") return;
  lastSaved[scope] = parseShortlist(slots.join(",")).join(",");
  try {
    window.sessionStorage.setItem(storageKey[scope], lastSaved[scope]);
    memoryOnly[scope] = false;
  } catch {
    memoryOnly[scope] = true;
  }
  window.dispatchEvent(new Event(shortlistChanged));
}

export function addToShortlist(slots: readonly string[], id: string): Shortlist {
  const next = parseShortlist(slots.join(","));
  const free = next.indexOf("");
  if (free !== -1 && /^[a-f0-9]{11}$/.test(id) && !next.includes(id)) next[free] = id;
  return next;
}

export function comparisonHref(slots: readonly string[], scope: ShortlistScope = "directory") {
  const query = parseShortlist(slots.join(",")).join(",").replace(/,+$/, "");
  if (scope === "finder") return "/programmes/compare?compare=" + encodeURIComponent(query) + "&from=finder";
  return query ? "/programmes/compare?compare=" + encodeURIComponent(query) : "/programmes/compare";
}
