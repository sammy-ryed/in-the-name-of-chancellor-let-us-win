"use client";

import { useMemo, useSyncExternalStore } from "react";
import { parseShortlist, readShortlistValue, shortlistChanged } from "./shortlist";

function subscribe(listener: () => void) {
  window.addEventListener(shortlistChanged, listener);
  return () => window.removeEventListener(shortlistChanged, listener);
}

export function useShortlist() {
  const value = useSyncExternalStore(subscribe, readShortlistValue, () => "");
  return useMemo(() => parseShortlist(value), [value]);
}
