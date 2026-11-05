"use client";

import { useSearchParams } from "next/navigation";
import { ProgrammeFinder } from "./ProgrammeFinder";
import type { FinderData, Filters } from "./types";

/**
 * Seeds the finder from the URL so links like /programmes?college=9812 (the nav menu's
 * faculty links) open pre-filtered. Supported: college, campus, department, level, q.
 * Keyed on the query so picking another faculty from the menu re-applies the filter.
 */
export function FinderFromURL({ data }: { data: FinderData }) {
  const params = useSearchParams();
  const has = (list: { value: string }[], v: string | null) => (v && list.some((o) => o.value === v) ? v : "");
  const initial: Partial<Filters> = {
    college: has(data.colleges, params.get("college")),
    campus: has(data.campuses, params.get("campus")),
    department: has(data.departments, params.get("department")),
    levels: params.getAll("level").filter((v) => data.levels.some((o) => o.value === v)),
    query: params.get("q") ?? "",
  };
  return <ProgrammeFinder key={params.toString()} data={data} initial={initial} areaId={params.get("area")} browseAll={params.get("view") === "all"} />;
}
