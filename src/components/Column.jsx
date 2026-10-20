import TaskCard from './TaskCard.jsx';

/** One Kanban column: a stage header with a count, and its task cards. */
export default function Column({ stage, tasks }) {
  return (
    <section
      aria-label={stage.label}
      className="flex min-h-[24rem] flex-col rounded-lg border border-text-muted/20 bg-surface-card/40 p-3"
    >
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold uppercase tracking-wide text-text-primary">
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
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </section>
  );
}
