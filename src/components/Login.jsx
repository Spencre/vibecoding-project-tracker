import { useEffect, useRef } from 'react';

/**
 * Demo login screen. One "Continue as <name>" button per team member; no passwords,
 * no backend. It only records who is using the board (PRD §15 item 14).
 */
export default function Login({ team, onSelect }) {
  const firstButton = useRef(null);

  // Keyboard and screen-reader users land on the first choice straight away.
  useEffect(() => {
    firstButton.current?.focus();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-lg border border-text-muted/20 bg-surface-card p-6">
        <h1 className="text-2xl font-bold text-text-primary">Vibecoding Project Tracker</h1>
        <p className="mt-2 text-sm text-text-muted">
          Choose who you are to open the board. This is a demo sign-in: there are no passwords.
        </p>

        <ul className="mt-6 flex flex-col gap-3">
          {team.map((name, index) => (
            <li key={name}>
              <button
                type="button"
                ref={index === 0 ? firstButton : undefined}
                onClick={() => onSelect(name)}
                className="w-full rounded-md border border-brand-accent/40 px-4 py-2 text-left text-sm font-medium text-text-primary hover:bg-brand-accent/10 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              >
                Continue as {name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
