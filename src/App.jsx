import { useState, useEffect, useCallback } from 'react';
import AnchorBoard from './components/AnchorBoard.jsx';
import Board from './components/Board.jsx';
import TaskModal from './components/TaskModal.jsx';
import DueLegend from './components/DueLegend.jsx';
import TeamStrip from './components/TeamStrip.jsx';
import { buildBriefing } from './utils/briefing.js';
import { copyText } from './utils/clipboard.js';
import { CONTEXT_TEMPLATE } from './utils/context.js';
import Toast from './components/Toast.jsx';
import Login from './components/Login.jsx';

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
export const TEAM = ['Spencer Snowden', 'Harry Potter', 'Frodo Baggins'];

// Demo login (front-end only): lowercase username -> team member. The password is ignored.
const USERNAMES = { spencer: TEAM[0], harry: TEAM[1], frodo: TEAM[2] };

// Earlier names, mapped to the current ones so tasks saved in a browser keep a valid assignee.
const RENAMED = { 'Spencer Snowden1': 'Harry Potter', 'Spencer Snowden2': 'Frodo Baggins' };

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

// ISO timestamp `hours` ago, for the seed tasks' "last updated" hint.
function hoursAgo(hours) {
  return new Date(Date.now() - hours * 3600 * 1000).toISOString();
}

// Mock tasks shown on first load (PRD §5 task shape).
function seedTasks() {
  const base = { assignee: TEAM[0], createdDate: isoDay(0), context: '', contextTool: null, contextUpdatedAt: null };
  return [
    { ...base, id: 't-1', title: 'Design the board layout', description: 'Four columns, dark theme from DESIGN.md.', type: 'feature', status: 'done', dueDate: isoDay(-2) },
    { ...base, id: 't-2', title: 'Build the add / edit modal', description: 'Every task field, status dropdown, delete button.', type: 'feature', status: 'in-progress', dueDate: isoDay(0),
      context: `## Context

**Background**
The board needs add, edit and delete without leaving the page. Tasks live in localStorage.

**Constraints**
- React + Tailwind only, no extra libraries.
- Follow DESIGN.md colours and microcopy.

**Tried so far**
A single modal for both add and edit works well; a separate edit page felt slow.

**Pick up**
Check the delete confirmation wording and keyboard focus order.
`,
      contextTool: 'Claude', contextUpdatedAt: hoursAgo(2) },
    { ...base, id: 't-3', assignee: TEAM[1], title: 'Fix card text overflow', description: 'Long titles break the card layout.', type: 'bug', status: 'review', dueDate: isoDay(-1),
      context: `## Context

**Background**
Long task titles push the type badge off the card.

**Constraints**
Do not change the card width; the columns are a fixed grid.

**Tried so far**
\`truncate\` hid the title, which is worse. Wrapping the title next to the badge looks right.

**Pick up**
Test with a 120-character title and with no due date.
`,
      contextTool: 'ChatGPT', contextUpdatedAt: hoursAgo(26) },
    { ...base, id: 't-4', assignee: TEAM[2], title: 'Write the Copy Context template', description: 'Title, description and context as a clean briefing.', type: 'feature', status: 'todo', dueDate: isoDay(4) },
  ];
}

// The four pinned deliverable slots (PRD §5 `Anchor`). A url of null means "nothing linked yet".
const DEFAULT_ANCHORS = [
  { id: 'presentation', label: 'Presentation', url: null },
  { id: 'demo', label: 'Demo', url: null },
  { id: 'report', label: 'Report', url: null },
  { id: 'documentation', label: 'Documentation', url: null },
];

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
    context: CONTEXT_TEMPLATE,
    contextTool: null,
    contextUpdatedAt: null,
  };
}

export default function App() {
  const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', seedTasks());
  // The task open in the modal (null = closed). `id === ''` means a new task.
  const [editing, setEditing] = useState(null);
  const [anchors, setAnchors] = useLocalStorage('vibetracker.anchors', DEFAULT_ANCHORS);
  // Demo login: who is using the board. Front-end only, no real authentication.
  const [currentUser, setCurrentUser] = useLocalStorage('vibetracker.currentUser', null);
  // Short confirmation message (e.g. after a hand-off); clears itself.
  const [toast, setToast] = useState(null);
  // Re-render once a minute so due-date colours keep up with the clock (M8).
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((n) => n + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  // One-off clean-up of tasks saved under the earlier team names.
  useEffect(() => {
    setTasks((current) =>
      current.some((t) => RENAMED[t.assignee])
        ? current.map((t) => (RENAMED[t.assignee] ? { ...t, assignee: RENAMED[t.assignee] } : t))
        : current
    );
  }, [setTasks]);

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

  const setAnchorUrl = (id, url) =>
    setAnchors((current) => current.map((a) => (a.id === id ? { ...a, url } : a)));

  const copyContext = async (task) => {
    const copied = await copyText(buildBriefing(task, STAGES));
    setToast({
      text: copied ? 'Copied. Paste it into your AI.' : "Couldn't copy. Select the text and copy it yourself.",
      key: Date.now(),
    });
  };

  // Drag-and-drop (M12): the dropped card's id arrives from the column it was dropped on.
  const moveTask = (id, status) => {
    const task = tasks.find((t) => t.id === id);
    if (!task || task.status === status) return;
    setTasks((current) => current.map((t) => (t.id === id ? { ...t, status } : t)));
    const label = STAGES.find((stage) => stage.id === status)?.label ?? status;
    setToast({ text: `Moved to ${label}.`, key: Date.now() });
  };

  const handOff = (id, name) => {
    setTasks((current) => current.map((t) => (t.id === id ? { ...t, assignee: name } : t)));
    setToast({ text: `Handed off to ${name}.`, key: Date.now() });
  };

  if (!TEAM.includes(currentUser)) {
    return <Login users={USERNAMES} onLogin={setCurrentUser} />;
  }

  return (
    <div className="min-h-screen p-6">
      <header className="mb-6 flex items-end justify-between gap-4">
        <h1 className="text-2xl font-bold text-text-primary">
          Vibecoding Project Tracker
        </h1>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="current-user" className="text-sm text-text-muted">
              Signed in as
            </label>
            <select
              id="current-user"
              value={currentUser}
              onChange={(e) => setCurrentUser(e.target.value)}
              className="rounded-md border border-text-muted/40 bg-surface-page px-2 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent"
            >
              {TEAM.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => setCurrentUser(null)}
            className="rounded-md border border-text-muted/40 px-3 py-2 text-sm font-medium text-text-primary hover:bg-text-muted/10 focus:outline-none focus:ring-2 focus:ring-brand-accent"
          >
            Log out
          </button>
          <button
            type="button"
            onClick={() => setEditing(blankTask())}
            className="rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-brand-accent"
          >
            + Task
          </button>
        </div>
      </header>

      <AnchorBoard anchors={anchors} onChange={setAnchorUrl} />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <TeamStrip team={TEAM} tasks={tasks} />
        <DueLegend />
      </div>

      <Board
        stages={STAGES}
        tasks={tasks}
        team={TEAM}
        onOpen={setEditing}
        onHandOff={handOff}
        onCopy={copyContext}
        onMove={moveTask}
      />

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
          onCopy={copyContext}
        />
      )}
    </div>
  );
}
