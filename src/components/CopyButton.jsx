/** The "Copy Context" button, used on every card and inside the modal (M10). */
export default function CopyButton({ onClick, className = '', label = 'Copy Context' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded border border-brand-accent/40 px-2 py-1 text-xs font-medium text-brand-accent hover:bg-brand-accent/10 focus:outline-none focus:ring-2 focus:ring-brand-accent ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      {label}
    </button>
  );
}
