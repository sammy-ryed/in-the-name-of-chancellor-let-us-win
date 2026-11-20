import type { Filters, SortKey } from "./types";

const positionKey = "srm-directory-return-v1";
export type BrowsePosition = {
  search: string;
  filters: Filters;
  sort?: SortKey;
  limit: number;
  scroll: number;
  focus: string;
};

export function rememberPosition(position: BrowsePosition) {
  const value = JSON.stringify(position);
  // The history entry handles browser Back. Session storage handles the return link.
  window.history.replaceState({ ...window.history.state, [positionKey]: value }, "");
  try { sessionStorage.setItem(positionKey, value); } catch { /* History still works. */ }
}

export function positionValue(resume: boolean): string {
  try {
    return (resume ? sessionStorage.getItem(positionKey) : window.history.state?.[positionKey]) || "";
  } catch { return ""; }
}

export function parsePosition(value: string): BrowsePosition | undefined {
  try {
    const saved = JSON.parse(value) as BrowsePosition;
    if (typeof saved.search !== "string" || !saved.filters || typeof saved.filters.query !== "string"
        || ![saved.filters.levels, saved.filters.types, saved.filters.modes].every(Array.isArray)
        || !Number.isFinite(saved.scroll) || !Number.isFinite(saved.limit)) return;
    return saved;
  } catch { return; }
}
