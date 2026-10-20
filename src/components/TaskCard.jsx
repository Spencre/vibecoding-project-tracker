import TypeBadge, { TYPE_STYLES } from './TypeBadge.jsx';

/**
 * One task card on the board. Clicking anywhere on it opens the edit modal.
 * The title is a real button (stretched over the card) so it works by keyboard too.
 * Later milestones add the type stripe (M6), hand-off (M7), due tint (M8) and
 * Copy Context (M10; give that button `relative z-10` so it sits above the stretched title).
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

export default function TaskCard({ task, onOpen }) {
  return (
    <article
      className={`relative rounded-md border border-l-4 border-text-muted/20 bg-surface-card p-3 transition-shadow hover:shadow-lg hover:shadow-black/30 ${
        (TYPE_STYLES[task.type] ?? TYPE_STYLES.feature).stripe
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium text-text-primary">
          <button
            type="button"
            onClick={() => onOpen(task)}
            className="text-left after:absolute after:inset-0 after:rounded-md focus:outline-none focus-visible:after:ring-2 focus-visible:after:ring-brand-accent"
          >
            {task.title}
          </button>
        </h3>
        <TypeBadge type={task.type} />
      </div>
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
