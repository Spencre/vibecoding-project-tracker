import TaskCard from './TaskCard.jsx';

// Full class names so Tailwind can see them. Colours live in tailwind.config.js (stage.*).
const STAGE_STYLES = {
  todo: { column: 'border-t-stage-todo', dot: 'bg-stage-todo' },
  'in-progress': { column: 'border-t-stage-progress', dot: 'bg-stage-progress' },
  review: { column: 'border-t-stage-review', dot: 'bg-stage-review' },
  done: { column: 'border-t-stage-done', dot: 'bg-stage-done' },
};

/** One Kanban column: a stage header with a count, and its task cards. */
export default function Column({ stage, tasks, team, onOpen, onHandOff }) {
  const style = STAGE_STYLES[stage.id];
  return (
    <section
      aria-label={stage.label}
      className={`flex min-h-[24rem] flex-col rounded-lg border border-t-4 border-text-muted/20 bg-surface-card/40 p-3 ${style.column}`}
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
          tasks.map((task) => <TaskCard
              key={task.id}
              task={task}
              team={team}
              onOpen={onOpen}
              onHandOff={onHandOff}
            />)
        )}
      </div>
    </section>
  );
}
