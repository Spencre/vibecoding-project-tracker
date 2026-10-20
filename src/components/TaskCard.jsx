import Avatar from './Avatar.jsx';
import TypeBadge, { TYPE_STYLES } from './TypeBadge.jsx';
import { DUE_STYLES, dueLabel, getDueState } from '../utils/due.js';

/**
 * One task card on the board. Clicking anywhere on it opens the edit modal.
 * The title is a real button (stretched over the card) so it works by keyboard too.
 * Anything else interactive on the card needs `relative z-10` so it sits above that
 * stretched title (the hand-off dropdown here; Copy Context in M10).
 * The card tint and date label come from the due date (M8, see utils/due.js); the left
 * stripe is the feature / bug colour (M6). Copy Context arrives in M10.
 */
export default function TaskCard({ task, team, onOpen, onHandOff }) {
  const others = team.filter((name) => name !== task.assignee);
  const dueState = getDueState(task);
  const due = DUE_STYLES[dueState];
  const label = dueLabel(task, dueState);

  return (
    <article
      className={`relative rounded-md border border-l-4 p-3 transition-shadow hover:shadow-lg hover:shadow-black/30 ${
        due.card
      } ${(TYPE_STYLES[task.type] ?? TYPE_STYLES.feature).stripe}`}
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

      {label && (
        <p className={`mt-2 flex items-center gap-1.5 font-mono text-[11px] ${due.text}`}>
          {dueState === 'overdue' && (
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 shrink-0 text-due-overdue"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01" />
            </svg>
          )}
          {label}
        </p>
      )}

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
