/**
 * Due-date state for a task (M8). No new fields: it is worked out from `dueDate` and
 * `status` every time a card renders.
 *
 * A due date is a whole day, so a task is due at the END of that day.
 *   neutral — status is Done (overrides the date, even if it was overdue)
 *   none    — no due date set
 *   overdue — the due day has passed
 *   warning — less than 24 hours left (in practice: due today)
 *   safe    — everything else. The slides only define "more than 2 days" and
 *             "less than 24 hours", so 24–48 hours is treated as safe too.
 */
const DAY_MS = 24 * 60 * 60 * 1000;

function endOfDay(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day, 23, 59, 59, 999).getTime();
}

export function getDueState(task, now = Date.now()) {
  if (task.status === 'done') return 'neutral';
  if (!task.dueDate) return 'none';
  const remaining = endOfDay(task.dueDate) - now;
  if (remaining < 0) return 'overdue';
  if (remaining < DAY_MS) return 'warning';
  return 'safe';
}

export function formatDay(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
}

// Full class names so Tailwind can see them. Colours live in tailwind.config.js (due.*).
export const DUE_STYLES = {
  none: { card: 'border-text-muted/20 bg-surface-card', text: 'text-text-muted' },
  safe: { card: 'border-due-safe/50 bg-due-safe/10', text: 'text-due-safe' },
  warning: { card: 'border-due-warning/70 bg-due-warning/10', text: 'text-due-warning' },
  overdue: { card: 'border-due-overdue/80 bg-due-overdue/15', text: 'text-text-primary' },
  neutral: { card: 'border-due-neutral/40 bg-surface-card', text: 'text-text-muted' },
};

/** The short label shown on the card, or null when there is nothing to say. */
export function dueLabel(task, state) {
  if (!task.dueDate) return null;
  const day = formatDay(task.dueDate);
  if (state === 'overdue') return `Overdue · ${day}`;
  if (state === 'warning') return 'Due today';
  if (state === 'neutral') return `Was due ${day}`;
  return `Due ${day}`;
}
