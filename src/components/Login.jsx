import { useEffect, useRef, useState } from 'react';

/**
 * Demo login form (PRD §15 item 14). `users` maps a lowercase username to a team member's
 * name. The password is ignored (it only has to be filled in), and nothing is sent anywhere.
 */
export default function Login({ users, onLogin }) {
  const usernames = Object.keys(users);
  const [username, setUsername] = useState(usernames[0]);
  const [password, setPassword] = useState('demo');
  const [error, setError] = useState(false);
  const usernameInput = useRef(null);

  // Keyboard and screen-reader users land in the first field straight away.
  useEffect(() => {
    usernameInput.current?.focus();
  }, []);

  const tryList = usernames.join(', ');

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = users[username.trim().toLowerCase()];
    if (!name || !password) {
      setError(true);
      return;
    }
    onLogin(name);
  };

  const fieldClass = (invalid) =>
    `mt-1 w-full rounded-md border bg-surface-page px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-accent ${
      invalid ? 'border-due-overdue' : 'border-text-muted/30'
    }`;

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-lg border border-text-muted/20 bg-surface-card p-6">
        <h1 className="text-2xl font-bold text-text-primary">Vibecoding Project Tracker</h1>
        <p className="mt-2 text-sm text-text-muted">Log in to open your team's board.</p>

        <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="login-username" className="text-sm font-medium text-text-primary">
              Username
            </label>
            <input
              id="login-username"
              ref={usernameInput}
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-invalid={error}
              aria-describedby={error ? 'login-hint login-error' : 'login-hint'}
              className={fieldClass(error)}
            />
          </div>

          <div>
            <label htmlFor="login-password" className="text-sm font-medium text-text-primary">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={error && !password}
              aria-describedby={error && !password ? 'login-error' : undefined}
              className={fieldClass(error && !password)}
            />
          </div>

          {error && (
            <p id="login-error" role="alert" className="text-sm text-text-primary">
              <span className="font-semibold">Error: </span>
              We don't recognise that username. Try {tryList}.
            </p>
          )}

          <button
            type="submit"
            className="rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-brand-accent"
          >
            Log in
          </button>
        </form>

        <p id="login-hint" className="mt-4 text-xs text-text-muted">
          Demo only: no real accounts or passwords. Try: {tryList}. Any password works.
        </p>
      </div>
    </main>
  );
}
