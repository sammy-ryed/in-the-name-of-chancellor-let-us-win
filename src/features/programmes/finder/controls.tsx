"use client";

import type { Ref } from "react";
import type { Option } from "./types";

const fmt = (n: number) => n.toLocaleString("en-IN");

function Icon({ name }: { name: "search" | "close" | "check" | "chevron" | "arrow" | "filter" }) {
  const paths = {
    search: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="M16 16l4.5 4.5" />
      </>
    ),
    close: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
    check: <path d="M5.5 12.5l4 4 9-10" />,
    chevron: <path d="M7 10l5 5 5-5" />,
    arrow: <path d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5" />,
    filter: <path d="M4 7h16M7 12h10M10 17h4" />,
  };
  return (
    <svg className="pf-icon" viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
export { Icon };

/** The page's primary action: search across names, degrees, departments and faculties. */
export function SearchBox({
  value,
  onChange,
  inputRef,
}: {
  value: string;
  onChange: (v: string) => void;
  inputRef?: Ref<HTMLInputElement>;
}) {
  return (
    <div className="pf-search" role="search">
      <label htmlFor="pf-q" className="pf-sr">
        Search programmes
      </label>
      <Icon name="search" />
      <input
        ref={inputRef}
        id="pf-q"
        type="search"
        value={value}
        autoComplete="off"
        spellCheck={false}
        placeholder="Search by subject, degree or campus"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && value && onChange("")}
      />
      {value ? (
        <button type="button" className="pf-search-clear" onClick={() => onChange("")} aria-label="Clear search">
          <Icon name="close" />
        </button>
      ) : (
        <kbd className="pf-kbd" aria-hidden="true" title="Press / to search">
          /
        </kbd>
      )}
    </div>
  );
}

/** Checkbox or radio list with live counts; options that would return nothing are disabled. */
export function ChoiceList({
  legend,
  name,
  type,
  options,
  selected,
  counts,
  onChange,
  allLabel,
}: {
  legend: string;
  name: string;
  type: "checkbox" | "radio";
  options: Option[];
  selected: string[];
  counts: Map<string, number>;
  onChange: (next: string[]) => void;
  allLabel?: string;
}) {
  const rows = type === "radio" && allLabel ? [{ value: "", label: allLabel }, ...options] : options;
  return (
    <fieldset className="pf-group">
      <legend>{legend}</legend>
      <ul>
        {rows.map((o) => {
          const n = o.value ? (counts.get(o.value) ?? 0) : null;
          const on = o.value ? selected.includes(o.value) : selected.length === 0;
          return (
            <li key={o.value || "all"}>
              <label className="pf-choice" data-disabled={n === 0 && !on ? "" : undefined}>
                <input
                  type={type}
                  name={name}
                  checked={on}
                  disabled={n === 0 && !on}
                  onChange={() =>
                    type === "radio"
                      ? onChange(o.value ? [o.value] : [])
                      : onChange(on ? selected.filter((s) => s !== o.value) : [...selected, o.value])
                  }
                />
                <span className="pf-choice-mark" aria-hidden="true">
                  <Icon name="check" />
                </span>
                <span className="pf-choice-label">{o.label}</span>
                {n !== null && <span className="pf-count">{fmt(n)}</span>}
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

/** Long option lists (faculty, department) as a labelled native select — best on every device. */
export function SelectField({
  id,
  label,
  allLabel,
  options,
  counts,
  value,
  onChange,
}: {
  id: string;
  label: string;
  allLabel: string;
  options: Option[];
  counts: Map<string, number>;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="pf-field">
      <label htmlFor={id}>{label}</label>
      <div className="pf-select" data-active={value ? "" : undefined}>
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">{allLabel}</option>
          {options.map((o) => {
            const n = counts.get(o.value) ?? 0;
            return (
              <option key={o.value} value={o.value} disabled={n === 0 && o.value !== value}>
                {o.label} ({fmt(n)})
              </option>
            );
          })}
        </select>
        <Icon name="chevron" />
      </div>
    </div>
  );
}

export function SortSelect<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="pf-sort">
      <label htmlFor="pf-sort">Sort by</label>
      <div className="pf-select pf-select-quiet">
        <select id="pf-sort" value={value} onChange={(e) => onChange(e.target.value as T)}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Icon name="chevron" />
      </div>
    </div>
  );
}

export interface ActiveChip {
  key: string;
  label: string;
  remove: () => void;
}

/** Every active filter as a removable chip, plus Clear all. */
export function ActiveChips({ chips, onClear }: { chips: ActiveChip[]; onClear: () => void }) {
  if (!chips.length) return null;
  return (
    <div className="pf-chips" aria-label="Active filters" role="group">
      {chips.map((c) => (
        <button key={c.key} type="button" className="pf-chip" onClick={c.remove} aria-label={`Remove filter: ${c.label}`}>
          {c.label}
          <Icon name="close" />
        </button>
      ))}
      <button type="button" className="pf-clear" onClick={onClear}>
        Clear all
      </button>
    </div>
  );
}
