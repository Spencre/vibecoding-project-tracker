/** Key for the due-date colours, so nobody has to guess what a tint means. */
const ITEMS = [
  { label: 'Due later', dot: 'bg-due-safe' },
  { label: 'Due today', dot: 'bg-due-warning' },
  { label: 'Overdue', dot: 'bg-due-overdue' },
  { label: 'Done', dot: 'bg-due-neutral' },
];

export default function DueLegend() {
  return (
    <ul aria-label="Due date key" className="flex flex-wrap items-center gap-x-4 gap-y-1">
      {ITEMS.map((item) => (
        <li key={item.label} className="flex items-center gap-1.5 text-xs text-text-muted">
          <span className={`h-2.5 w-2.5 rounded-full ${item.dot}`} aria-hidden="true" />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
