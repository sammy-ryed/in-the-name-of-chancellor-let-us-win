export interface Option {
  value: string;
  label: string;
  /** Programmes listed under this option on the source site. */
  count?: number;
}

export interface Programme {
  id: number;
  /** Full title as published by SRMIST. */
  name: string;
  /** Title without the degree prefix, e.g. "English" for "B.A. English". */
  subject: string;
  /** Degree / qualification, e.g. "B.A.", "Ph.D.", "M.Tech". */
  certification: string;
  url: string;
  duration?: string;
  level: string[];
  mode: string[];
  type: string[];
  college: string[];
  department: string[];
}

export interface FinderData {
  source: string;
  fetched: string;
  levels: Option[];
  modes: Option[];
  types: Option[];
  campuses: (Option & { colleges: string[] })[];
  colleges: (Option & { departments: string[] })[];
  departments: Option[];
  programmes: Programme[];
}

export interface Filters {
  levels: string[];
  modes: string[];
  types: string[];
  campus: string;
  college: string;
  department: string;
  query: string;
}

export const emptyFilters: Filters = {
  levels: [],
  modes: [],
  types: [],
  campus: "",
  college: "",
  department: "",
  query: "",
};

export type SortKey = "relevance" | "name-asc" | "name-desc" | "level" | "duration";

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "relevance", label: "Best match" },
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
  { value: "level", label: "Level" },
  { value: "duration", label: "Shortest duration" },
];

/** Filter groups that can be counted and cleared one at a time. */
export type Group = "levels" | "modes" | "types" | "campus" | "college" | "department";

