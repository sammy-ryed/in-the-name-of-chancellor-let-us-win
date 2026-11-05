export type IconName = "search" | "close" | "arrow";
const drawings: Record<IconName, React.ReactNode> = {
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.3" />
      <path d="m15.2 15.2 4.6 4.6" />
    </>
  ),
  close: <path d="m6 6 12 12M18 6 6 18" />,
  arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
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
