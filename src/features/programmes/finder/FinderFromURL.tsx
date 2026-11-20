"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { ProgrammeFinder } from "./ProgrammeFinder";
import { parsePosition, positionValue } from "./browse-position";
import type { FinderData, Filters } from "./types";

const subscribe = () => () => {};
export function FinderFromURL({ data }: { data: FinderData }) {
  const location = useSearchParams();
  const resume = location.get("resume") === "compare";
  const stored = useSyncExternalStore(subscribe, () => positionValue(resume), () => "");
  const position = useMemo(() => parsePosition(stored), [stored]);
  const saved = resume || (position && new URLSearchParams(position.search).toString() === location.toString()) ? position : undefined;
  const params = saved ? new URLSearchParams(saved.search) : location;
  const has = (options: { value: string }[], value: string | null) =>
    value && options.some(option => option.value === value) ? value : "";
  const initial: Partial<Filters> = saved?.filters ?? {
    college: has(data.colleges, params.get("college")),
    campus: has(data.campuses, params.get("campus")),
    department: has(data.departments, params.get("department")),
    levels: params.getAll("level").filter(value => data.levels.some(option => option.value === value)),
    query: params.get("q") ?? "",
  };
  return <ProgrammeFinder key={location.toString() + stored} data={data} initial={initial} saved={saved}
    areaId={params.get("area")} browseAll={params.get("view") === "all" || (resume && !saved)} />;
}
