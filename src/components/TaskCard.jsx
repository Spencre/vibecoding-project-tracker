/**
 * One task card on the board.
 * M4 shows title + assignee. Later milestones add the type stripe (M6),
 * hand-off (M7), due tint (M8) and Copy Context (M10).
 */
function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function TaskCard({ task }) {
  return (
    <article className="rounded-md border border-text-muted/20 bg-surface-card p-3 transition-shadow hover:shadow-lg hover:shadow-black/30">
      <h3 className="text-sm font-medium text-text-primary">{task.title}</h3>
      <div className="mt-3 flex items-center gap-2">
        <span
          className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary font-mono text-[10px] font-medium text-white"
          aria-hidden="true"
        >
          {initials(task.assignee)}
        </span>
        <span className="text-xs text-text-muted">{task.assignee}</span>
      </div>
    </article>
  );
}
