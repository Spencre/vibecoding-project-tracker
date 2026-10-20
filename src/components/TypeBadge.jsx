/**
 * Feature / bug styling, shared by the board and the modal so a task looks the same
 * everywhere (M6). Colours come from tailwind.config.js (type.*); full class names are
 * spelled out so Tailwind can see them. Type is shown by icon + label + stripe, never
 * by colour alone.
 */
export const TYPE_STYLES = {
  feature: {
    label: 'Feature',
    stripe: 'border-l-type-feature',
    badge: 'bg-type-feature/15 text-type-feature',
  },
  bug: {
    label: 'Bug',
    stripe: 'border-l-type-bug',
    badge: 'bg-type-bug/15 text-type-bug',
  },
};

function FeatureIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
    </svg>
  );
}

function BugIcon() {
  return (
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
      <path d="m8 2 1.88 1.88M14.12 3.88 16 2M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
      <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6M12 20v-9" />
      <path d="M6.53 9C4.6 8.8 3 7.1 3 5M6 13H2M3 21c0-2.1 1.7-3.9 3.8-4M20.97 5c0 2.1-1.6 3.8-3.5 4M22 13h-4M17.2 17c2.1.1 3.8 1.9 3.8 4" />
    </svg>
  );
}

/** Small pill: icon + "Feature" / "Bug". */
export default function TypeBadge({ type }) {
  const style = TYPE_STYLES[type] ?? TYPE_STYLES.feature;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[11px] font-medium ${style.badge}`}
    >
      {type === 'bug' ? <BugIcon /> : <FeatureIcon />}
      {style.label}
    </span>
  );
}
