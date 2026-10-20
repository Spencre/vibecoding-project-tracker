/**
 * Initials badge for a team member. A trailing number is kept so that
 * "Spencer Snowden", "Spencer Snowden1" and "Spencer Snowden2" stay distinguishable
 * (SS, SS1, SS2).
 */
export function initials(name) {
  const letters = name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const trailingNumber = name.match(/\d+$/)?.[0] ?? '';
  return letters + trailingNumber;
}

export default function Avatar({ name }) {
  return (
    <span
      className="flex h-6 min-w-[1.5rem] shrink-0 items-center justify-center rounded-full bg-brand-primary px-1 font-mono text-[10px] font-medium text-white"
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}
