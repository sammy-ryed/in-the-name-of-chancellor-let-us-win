export type IconName =
  | "search"
  | "send"
  | "close"
  | "study"
  | "campus"
  | "service"
  | "arrow"
  | "link";
const drawings: Record<IconName, React.ReactNode> = {
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.3" />
      <path d="m15.2 15.2 4.6 4.6" />
    </>
  ),
  send: (
    <>
      <path d="M12 19V5m-6 6 6-6 6 6" />
    </>
  ),
  close: <path d="m6 6 12 12M18 6 6 18" />,
  study: (
    <>
      <path d="m2 9.5 10-5 10 5-10 5zM6 12v4c4 3.1 8 3.1 12 0v-4" />
    </>
  ),
  campus: (
    <>
      <path d="M4 20V9l8-5 8 5v11M2 20h20M10 20v-5h4v5" />
      <path d="M8 10h.01m4 0h.01m4 0h.01" />
    </>
  ),
  service: (
    <>
      <path d="M3 8.5c5.4-5 12.6-5 18 0M6 12c3.5-3.2 8.5-3.2 12 0m-9 3.4c1.6-1.5 4.4-1.5 6 0" />
      <circle cx="12" cy="19" r=".7" />
    </>
  ),
  arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
  link: (
    <>
      <path d="M9 15 15 9m-5-2 2-2a4.2 4.2 0 0 1 6 6l-2 2m-2 4-2 2a4.2 4.2 0 0 1-6-6l2-2" />
    </>
  ),
};
export function Icon({ name }: { name: IconName }) {
  return (
    <svg
      className="ask-icon"
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {drawings[name]}
    </svg>
  );
}
