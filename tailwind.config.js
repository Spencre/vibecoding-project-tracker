/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Design tokens — see DESIGN.md §2 ("Terminal Calm")
        brand: {
          primary: '#4F46E5',
          accent: '#A5B4FC',
        },
        surface: {
          page: '#0F172A',
          card: '#1E293B',
        },
        text: {
          primary: '#E2E8F0',
          muted: '#94A3B8',
        },
        type: {
          feature: '#10B981', // emerald
          bug: '#FB7185',     // rose
        },
        stage: {
          todo: '#94A3B8',     // slate
          progress: '#38BDF8', // sky
          review: '#A78BFA',   // violet
          done: '#4ADE80',     // green
        },
        due: {
          safe: '#14B8A6',    // > 2 days out
          warning: '#F59E0B', // < 24 hours
          overdue: '#EF4444', // past due
          neutral: '#64748B', // done
        },
        // Kept so the starter's existing `feature` / `bug` utilities still work.
        feature: '#10B981',
        bug: '#FB7185',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
