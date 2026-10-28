// Root font sizes: Tailwind's rem-based sizes all scale with these.
export const TEXT_SIZES = [
  { id: 'normal', label: 'A', name: 'normal', size: '100%' },
  { id: 'large', label: 'A+', name: 'large', size: '112.5%' },
  { id: 'largest', label: 'A++', name: 'largest', size: '125%' },
];

/** Three buttons that switch the page text size. The active one is marked with aria-pressed. */
export default function TextSizeControl({ value, onChange }) {
  return (
    <div role="group" aria-label="Text size" className="flex items-center gap-2">
      <span className="text-sm text-text-muted" aria-hidden="true">
        Text size
      </span>
      <div className="flex gap-1">
        {TEXT_SIZES.map((option) => {
          const active = option.id === value;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              aria-pressed={active}
              aria-label={`Text size: ${option.name}`}
              className={`min-w-[2.5rem] rounded-md border px-2 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-accent ${
                active
                  ? 'border-brand-primary bg-brand-primary text-white'
                  : 'border-text-muted/40 text-text-primary hover:bg-text-muted/10'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
