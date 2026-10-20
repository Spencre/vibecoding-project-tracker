import { useEffect, useState } from 'react';

/** Short confirmation message with a 200 ms fade-in (the only animation DESIGN.md allows). */
export default function Toast({ message }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-md border border-brand-accent/40 bg-surface-card px-4 py-2 text-sm text-text-primary shadow-lg shadow-black/40 transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {message}
    </div>
  );
}
