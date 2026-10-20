import Avatar from './Avatar.jsx';

/** Optional M7 strip: what each team member is currently driving. */
export default function TeamStrip({ team, tasks }) {
  return (
    <section aria-label="Team workload" className="flex flex-wrap gap-3">
      {team.map((name) => {
        const mine = tasks.filter((task) => task.assignee === name);
        const inProgress = mine.filter((task) => task.status === 'in-progress').length;
        const open = mine.filter((task) => task.status !== 'done').length;
        return (
          <div
            key={name}
            className="flex items-center gap-2 rounded-md border border-text-muted/20 bg-surface-card/40 px-3 py-1.5"
          >
            <Avatar name={name} />
            <span className="text-sm text-text-primary">{name}</span>
            <span className="font-mono text-xs text-text-muted">
              {inProgress} in progress · {open} open
            </span>
          </div>
        );
      })}
    </section>
  );
}
