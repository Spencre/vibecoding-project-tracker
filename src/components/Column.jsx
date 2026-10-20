import { useState } from 'react';
import TaskCard from './TaskCard.jsx';

// Full class names so Tailwind can see them. Colours live in tailwind.config.js (stage.*).
const STAGE_STYLES = {
  todo: { column: 'border-t-stage-todo', dot: 'bg-stage-todo' },
  'in-progress': { column: 'border-t-stage-progress', dot: 'bg-stage-progress' },
  review: { column: 'border-t-stage-review', dot: 'bg-stage-review' },
  done: { column: 'border-t-stage-done', dot: 'bg-stage-done' },
};

/** One Kanban column: a stage header with a count, and its task cards. */
export default function Column({ stage, tasks, team, onOpen, onHandOff, onCopy, onMove }) {
  const style = STAGE_STYLES[stage.id];
  // True while a card is being dragged over this column, so it can show where it will land.
  const [dragOver, setDragOver] = useState(false);
  return (
    <section
      aria-label={stage.label}
      onDragOver={(e) => {
        e.preventDefault(); // allow dropping here
        e.dataTransfer.dropEffect = 'move';
        setDragOver(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setDragOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        onMove(e.dataTransfer.getData('text/plain'), stage.id);
      }}
      className={`flex min-h-[24rem] flex-col rounded-lg border border-t-4 border-text-muted/20 bg-surface-card/40 p-3 transition-shadow ${style.column} ${
        dragOver ? 'ring-2 ring-brand-accent' : ''
      }`}
    >
      <header className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold uppercase tracking-wide text-text-primary">
          <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} aria-hidden="true" />
          {stage.label}
        </h2>
        <span className="font-mono text-xs text-text-muted">{tasks.length}</span>
      </header>

      <div className="flex flex-col gap-2">
        {tasks.length === 0 ? (
          <p className="rounded-md border border-dashed border-text-muted/30 p-4 text-center text-sm text-text-muted">
            Nothing here yet.
          </p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              team={team}
              onOpen={onOpen}
              onHandOff={onHandOff}
              onCopy={onCopy}
            />
          ))
        )}
      </div>
    </section>
  );
}
