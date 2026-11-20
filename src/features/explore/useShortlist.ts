"use client";

import { useMemo, useSyncExternalStore } from "react";
import { parseShortlist, readShortlistValue, shortlistChanged, type ShortlistScope } from "./shortlist";

function subscribe(listener: () => void) {
  window.addEventListener(shortlistChanged, listener);
  return () => window.removeEventListener(shortlistChanged, listener);
}

export function useShortlist(scope: ShortlistScope = "directory") {
  const value = useSyncExternalStore(subscribe, () => readShortlistValue(scope), () => "");
  return useMemo(() => parseShortlist(value), [value]);
}
