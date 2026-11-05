"use client";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** "44 days to go", computed in the visitor's browser so a statically built page never shows a stale count. */
export function DaysToGo({ date }: { date: string }) {
  const days = useSyncExternalStore(
    subscribe,
    () => Math.ceil((new Date(date).getTime() - Date.now()) / 86_400_000),
    () => null,
  );
  if (days === null || days < 0) return null;
  return <p className="al-invite-count">{days === 0 ? "Today" : `${days} ${days === 1 ? "day" : "days"} to go`}</p>;
}
