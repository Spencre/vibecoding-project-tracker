import { useEffect, useRef, useState } from 'react';
import CopyButton from './CopyButton.jsx';
import TypeBadge, { TYPE_STYLES } from './TypeBadge.jsx';
import { AI_TOOLS, CONTEXT_TEMPLATE } from '../utils/context.js';
import { timeAgo } from '../utils/time.js';

const FIELD =
  'w-full rounded-md border border-text-muted/30 bg-surface-page px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-accent';
const LABEL = 'mb-1 block text-xs font-medium text-text-muted';

/**
 * Add / edit / delete modal. Same form for both: `isNew` decides the title,
 * whether the Delete button shows, and whether Save creates or updates.
 */
export default function TaskModal({ task, isNew, stages, team, onSave, onDelete, onClose, onCopy }) {
  const [form, setForm] = useState(task);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const titleRef = useRef(null);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const titleMissing = form.title.trim() === '';

  useEffect(() => {
    titleRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = (e) => {
    e.preventDefault();
    if (titleMissing) return;
    // The timestamp is set automatically whenever the context text was edited.
    const contextEdited = form.context !== task.context;
    onSave({
      ...form,
      title: form.title.trim(),
      dueDate: form.dueDate || null,
      contextTool: form.contextTool || null,
      contextUpdatedAt: contextEdited ? new Date().toISOString() : form.contextUpdatedAt,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-surface-page/70 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        onSubmit={submit}
        className={`max-h-full w-full max-w-xl overflow-y-auto rounded-lg border border-l-4 border-text-muted/30 bg-surface-card p-5 shadow-2xl shadow-black/50 ${
          (TYPE_STYLES[form.type] ?? TYPE_STYLES.feature).stripe
        }`}
      >
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <h2 id="task-modal-title" className="text-lg font-semibold text-text-primary">
              {isNew ? 'New task' : 'Edit task'}
            </h2>
            <TypeBadge type={form.type} />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-text-muted hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="task-title" className={LABEL}>Title</label>
            <input
              id="task-title"
              ref={titleRef}
              value={form.title}
              onChange={set('title')}
              placeholder="What needs doing?"
              className={FIELD}
            />
          </div>

          <div>
            <label htmlFor="task-description" className={LABEL}>Description</label>
            <textarea
              id="task-description"
              rows={3}
              value={form.description}
              onChange={set('description')}
              className={FIELD}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-type" className={LABEL}>Type</label>
              <select id="task-type" value={form.type} onChange={set('type')} className={FIELD}>
                <option value="feature">Feature</option>
                <option value="bug">Bug</option>
              </select>
            </div>
            <div>
              <label htmlFor="task-status" className={LABEL}>Status</label>
              <select id="task-status" value={form.status} onChange={set('status')} className={FIELD}>
                {stages.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="task-assignee" className={LABEL}>Assignee</label>
              <select id="task-assignee" value={form.assignee} onChange={set('assignee')} className={FIELD}>
                {team.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="task-due" className={LABEL}>Due date</label>
              <input
                id="task-due"
                type="date"
                value={form.dueDate ?? ''}
                onChange={set('dueDate')}
                className={`${FIELD} [color-scheme:dark]`}
              />
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-end justify-between gap-2">
              <label htmlFor="task-context" className="text-xs font-medium text-text-muted">
                Context
              </label>
              <div className="flex items-center gap-3">
              {form.context.trim() === '' && (
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, context: CONTEXT_TEMPLATE }))}
                  className="rounded text-xs text-brand-accent hover:underline focus:outline-none focus:ring-2 focus:ring-brand-accent"
                >
                  Insert template
                </button>
              )}
              {/* Copies what is in the form right now, including unsaved edits. */}
              <CopyButton onClick={() => onCopy(form)} />
              </div>
            </div>
            <textarea
              id="task-context"
              rows={9}
              value={form.context}
              onChange={set('context')}
              placeholder="Background, constraints, what you've tried, where to pick up. Markdown works."
              className={`${FIELD} font-mono text-xs leading-relaxed`}
            />
            {/* TODO stretch (M9): live Markdown preview pane next to this textarea. Postponed on purpose. */}
            {form.contextUpdatedAt && (
              <p className="mt-1 font-mono text-xs text-text-muted">
                Last updated {timeAgo(form.contextUpdatedAt)}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="task-context-tool" className={LABEL}>AI tool (optional)</label>
            <select
              id="task-context-tool"
              value={form.contextTool ?? ''}
              onChange={set('contextTool')}
              className={FIELD}
            >
              <option value="">Not set</option>
              {AI_TOOLS.map((tool) => (
                <option key={tool} value={tool}>{tool}</option>
              ))}
            </select>
          </div>

          <p className="font-mono text-xs text-text-muted">Created {form.createdDate}</p>
        </div>

        {confirmingDelete ? (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-md border border-due-overdue/60 p-3">
            <p className="text-sm text-text-primary">Delete this task? You can't undo this.</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                className="rounded-md border border-text-muted/40 px-3 py-1.5 text-sm text-text-muted hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent"
              >
                Keep it
              </button>
              <button
                type="button"
                onClick={() => onDelete(task.id)}
                className="rounded-md bg-due-overdue px-3 py-1.5 text-sm font-medium text-white hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex items-center justify-between">
            {isNew ? (
              <span />
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                className="rounded-md border border-due-overdue/60 px-3 py-2 text-sm text-text-primary hover:bg-due-overdue/10 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              >
                Delete
              </button>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-text-muted/40 px-4 py-2 text-sm text-text-muted hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={titleMissing}
                className="rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-brand-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isNew ? 'Add task' : 'Save changes'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
