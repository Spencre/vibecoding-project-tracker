import Avatar from './Avatar.jsx';
import TypeBadge, { TYPE_STYLES } from './TypeBadge.jsx';

/**
 * One task card on the board. Clicking anywhere on it opens the edit modal.
 * The title is a real button (stretched over the card) so it works by keyboard too.
 * Anything else interactive on the card needs `relative z-10` so it sits above that
 * stretched title (the hand-off dropdown here; Copy Context in M10).
 * Later milestones add the due tint (M8) and Copy Context (M10).
 */
export default function TaskCard({ task, team, onOpen, onHandOff }) {
  const others = team.filter((name) => name !== task.assignee);

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

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Avatar name={task.assignee} />
          <span className="text-xs text-text-muted">{task.assignee}</span>
        </div>

        {others.length > 0 && (
          <select
            aria-label={`Hand off "${task.title}" to…`}
            value=""
            onChange={(e) => e.target.value && onHandOff(task.id, e.target.value)}
            className="relative z-10 max-w-[7.5rem] shrink-0 rounded border border-text-muted/30 bg-surface-page px-1.5 py-1 text-xs text-text-muted hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent"
          >
            <option value="">Hand off to…</option>
            {others.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        )}
      </div>
    </article>
  );
}
