import { useState, useEffect, useCallback } from 'react';
import Board from './components/Board.jsx';
import TaskModal from './components/TaskModal.jsx';
import DueLegend from './components/DueLegend.jsx';
import TeamStrip from './components/TeamStrip.jsx';
import Toast from './components/Toast.jsx';

/**
 * Vibecoding Project Tracker — starter scaffold.
 *
 * This file is intentionally almost empty. The boilerplate (Vite, React,
 * Tailwind) is configured for you, plus a few shared constants and a
 * localStorage helper. Everything visible on screen, you build.
 *
 * Where to start (build sequence in Phase 3):
 *   - M4  data-model    : render the four columns and the task cards below.
 *   - M5  crud-modal    : add the "+" button modal and the edit-on-click modal.
 *   - M6  tag-style     : feature vs. bug color coding (uses DESIGN.md §2 colors).
 *   - M7  task-owner    : assignee badge + "Hand off to..." dropdown.
 *   - M8  due-tint      : color cards by due date (uses DESIGN.md §2 due-state colors).
 *   - M9  context       : a curated Context briefing field on the modal.
 *   - M10 copy-prompt   : a "Copy as Prompt Context" button that serializes the task + context.
 *   - M11 anchors       : the Anchor Board above the Kanban.
 *   - M12 secret-sauce  : the one open-ended thing that makes your tracker yours.
 *
 * Search the file for `TODO M<n>` to find the right hook for each milestone.
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {'feature'|'bug'} type
 * @property {'todo'|'in-progress'|'review'|'done'} status
 * @property {string} assignee
 * @property {string|null} dueDate     ISO 'YYYY-MM-DD'
 * @property {string} createdDate      ISO 'YYYY-MM-DD'
 */

// The four columns of the board, in render order.
// Use these IDs everywhere — do not invent new ones.
export const STAGES = [
  { id: 'todo',        label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review',      label: 'Review' },
  { id: 'done',        label: 'Done' },
];

// The three names from PRD §8. They are the only valid values for `Task.assignee`.
export const TEAM = ['Spencer Snowden', 'Spencer Snowden1', 'Spencer Snowden2'];

/**
 * A tiny localStorage hook — survives reloads, no library needed.
 *
 * Usage:
 *   const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', []);
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota or private-mode error — silently ignore for hackathon */
    }
  }, [key, value]);

  return [value, setValue];
}

// ISO date 'YYYY-MM-DD', `offset` days from today (so the demo data never goes stale).
function isoDay(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Mock tasks shown on first load (PRD §5 task shape).
function seedTasks() {
  const base = { assignee: TEAM[0], createdDate: isoDay(0), context: '', contextTool: null, contextUpdatedAt: null };
  return [
    { ...base, id: 't-1', title: 'Design the board layout', description: 'Four columns, dark theme from DESIGN.md.', type: 'feature', status: 'done', dueDate: isoDay(-2) },
    { ...base, id: 't-2', title: 'Build the add / edit modal', description: 'Every task field, status dropdown, delete button.', type: 'feature', status: 'in-progress', dueDate: isoDay(0) },
    { ...base, id: 't-3', assignee: TEAM[1], title: 'Fix card text overflow', description: 'Long titles break the card layout.', type: 'bug', status: 'review', dueDate: isoDay(-1) },
    { ...base, id: 't-4', assignee: TEAM[2], title: 'Write the Copy Context template', description: 'Title, description and context as a clean briefing.', type: 'feature', status: 'todo', dueDate: isoDay(4) },
  ];
}

// A blank task for the "+ Task" form (PRD §5 task shape).
function blankTask() {
  return {
    id: '',
    title: '',
    description: '',
    type: 'feature',
    status: 'todo',
    assignee: TEAM[0],
    dueDate: null,
    createdDate: isoDay(0),
    context: '',
    contextTool: null,
    contextUpdatedAt: null,
  };
}

export default function App() {
  const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', seedTasks());
  // The task open in the modal (null = closed). `id === ''` means a new task.
  const [editing, setEditing] = useState(null);
  // Short confirmation message (e.g. after a hand-off); clears itself.
  const [toast, setToast] = useState(null);
  // Re-render once a minute so due-date colours keep up with the clock (M8).
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((n) => n + 1), 60000);
    return () => clearInterval(timer);
  }, []);
  //
  // TODO M11 anchors:
  //   const [anchors, setAnchors] = useLocalStorage('vibetracker.anchors', [...]);

  const closeModal = useCallback(() => setEditing(null), []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const saveTask = (task) => {
    setTasks((current) =>
      task.id
        ? current.map((t) => (t.id === task.id ? task : t))
        : [...current, { ...task, id: `t-${Date.now()}` }]
    );
    setEditing(null);
  };

  const deleteTask = (id) => {
    setTasks((current) => current.filter((t) => t.id !== id));
    setEditing(null);
  };

  const handOff = (id, name) => {
    setTasks((current) => current.map((t) => (t.id === id ? { ...t, assignee: name } : t)));
    setToast({ text: `Handed off to ${name}.`, key: Date.now() });
  };

  return (
    <div className="min-h-screen p-6">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Vibecoding Project Tracker
          </h1>
          <p className="text-sm text-text-muted">
            Spencer Snowden
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(blankTask())}
          className="rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-brand-accent"
        >
          + Task
        </button>
      </header>

      {/* TODO M11 anchors: render the Anchor Board (Presentation / Demo / Report / Documentation) above the board. */}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <TeamStrip team={TEAM} tasks={tasks} />
        <DueLegend />
      </div>

      <Board stages={STAGES} tasks={tasks} team={TEAM} onOpen={setEditing} onHandOff={handOff} />

      {toast && <Toast key={toast.key} message={toast.text} />}

      {editing && (
        <TaskModal
          key={editing.id || 'new'}
          task={editing}
          isNew={!editing.id}
          stages={STAGES}
          team={TEAM}
          onSave={saveTask}
          onDelete={deleteTask}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
