import Avatar from './Avatar.jsx';

/**
 * Team panel: each member's workload as a card, plus a "Team details" dropdown with
 * their email and GitHub account. The dropdown is a native <details>, so it is keyboard
 * operable (Enter or Space on the summary) and announces its open or closed state.
 */
export default function TeamStrip({ members, tasks }) {
  return (
    <div>
      <section aria-label="Team workload" className="flex flex-wrap gap-3">
        {members.map(({ name }) => {
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

      <details className="group mt-2">
        <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-md border border-text-muted/40 px-3 py-1.5 text-sm text-text-primary hover:bg-text-muted/10 focus:outline-none focus:ring-2 focus:ring-brand-accent [&::-webkit-details-marker]:hidden">
          Team details
          <span className="text-xs text-text-muted transition-transform group-open:rotate-180" aria-hidden="true">
            ▼
          </span>
        </summary>
        <div className="mt-2 overflow-x-auto rounded-md border border-text-muted/20 bg-surface-card/40">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs text-text-muted">
                <th scope="col" className="px-3 py-2 font-medium">Name</th>
                <th scope="col" className="px-3 py-2 font-medium">Email</th>
                <th scope="col" className="px-3 py-2 font-medium">GitHub</th>
              </tr>
            </thead>
            <tbody>
              {members.map(({ name, email, github }) => (
                <tr key={name} className="border-t border-text-muted/20">
                  <th scope="row" className="px-3 py-2 font-normal text-text-primary">{name}</th>
                  <td className="px-3 py-2 font-mono text-xs text-text-muted">{email}</td>
                  <td className="px-3 py-2 font-mono text-xs text-text-muted">{github}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
