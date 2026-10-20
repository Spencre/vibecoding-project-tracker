import { isHttpUrl, normalizeUrl } from '../utils/url.js';

/**
 * The Anchor Board (M11): four pinned cards for the final-project deliverables, each with
 * one URL field and a status dot (hollow = empty, filled = a valid link is saved).
 * Anchor shape is in PRD §5: { id, label, url }.
 */
export default function AnchorBoard({ anchors, onChange }) {
  return (
    <section aria-label="Deliverables" className="mb-4">
      <h2 className="mb-2 text-base font-semibold uppercase tracking-wide text-text-primary">
        Deliverables
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {anchors.map((anchor) => {
          const linked = isHttpUrl(anchor.url);
          const invalid = Boolean(anchor.url) && !linked;
          const inputId = `anchor-${anchor.id}`;
          const errorId = `${inputId}-error`;

          return (
            <div
              key={anchor.id}
              className="rounded-lg border border-text-muted/20 bg-surface-card/40 p-3"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
                  {anchor.label}
                </label>
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-text-muted">
                  <span
                    className={`h-2.5 w-2.5 rounded-full border-2 ${
                      linked ? 'border-brand-accent bg-brand-accent' : 'border-text-muted/60'
                    }`}
                    aria-hidden="true"
                  />
                  {linked ? 'Linked' : 'Empty'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id={inputId}
                  type="url"
                  inputMode="url"
                  value={anchor.url ?? ''}
                  onChange={(e) => onChange(anchor.id, e.target.value || null)}
                  onBlur={(e) => onChange(anchor.id, normalizeUrl(e.target.value))}
                  placeholder="Paste link…"
                  aria-invalid={invalid}
                  aria-describedby={invalid ? errorId : undefined}
                  className="min-w-0 flex-1 rounded-md border border-text-muted/30 bg-surface-page px-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
                {linked && (
                  <a
                    href={anchor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${anchor.label} link in a new tab`}
                    className="shrink-0 rounded-md border border-brand-accent/40 px-2 py-1.5 text-xs font-medium text-brand-accent hover:bg-brand-accent/10 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  >
                    Open
                  </a>
                )}
              </div>

              {invalid && (
                <p id={errorId} className="mt-1.5 text-xs text-text-primary">
                  Use a full link, starting with https://
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
