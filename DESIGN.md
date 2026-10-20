# Vibecoding Project Tracker — Design

**Status:** Design doc completed for `design-done`. Direction: **"Terminal Calm"** (dark, developer-flavoured).

**Why this file exists.** This tracker is your tool. It should look like *your* tool — not a generic Kanban with default Tailwind blue. Twenty minutes of design decisions here will be visible on every screen for the next six weeks of Module 5.

**Who owns this.** Spencer Snowden (solo build). The colors below are already in `tailwind.config.js`.

---

## 1. Mood / vibe

A focused developer tool: quiet, dark and calm, where the only things that shout are the things that need attention (bugs and overdue tasks).

References (the feel, not a copy):

- Linear — dark, dense, calm board with restrained accents.
- VS Code dark theme — slate surfaces with monospace used for code-like content.
- GitHub dark mode — readable muted text on layered dark surfaces.

Anti-references — what we are explicitly **not** trying to look like:

- A default Tailwind-blue Trello clone on a white page.
- Neon / gradient "gamer" dashboards, where colour is decoration instead of meaning.

## 2. Color palette

These are the colors the build milestones reference. The hex values are in `tailwind.config.js`, so use utility classes such as `bg-surface-card`, `text-text-muted` and `border-due-warning`.

Contrast was checked against `surface-card` (WCAG: 4.5:1 for text, 3:1 for borders and icons).

### Brand

| Token | Hex | Where it shows up |
|---|---|---|
| `brand-primary` | `#4F46E5` | "+" button, primary buttons (white text, 6.3:1), focus rings |
| `brand-accent` | `#A5B4FC` | Highlights, hover states, links (7.3:1) |
| `surface-page` | `#0F172A` | Page background |
| `surface-card` | `#1E293B` | Card, column and modal background |
| `text-primary` | `#E2E8F0` | Body text (11.9:1) |
| `text-muted` | `#94A3B8` | Captions, dates, counts (5.7:1) |

### Task type (M6 `tag-style`)

| Token | Hex | When used |
|---|---|---|
| `type-feature` | `#10B981` | Cards tagged `feature`: left stripe + sparkle icon + "Feature" label (5.8:1) |
| `type-bug` | `#FB7185` | Cards tagged `bug`: left stripe + bug icon + "Bug" label (5.4:1) |

### Due-date states (M8 `due-tint`)

| Token | Hex | When used |
|---|---|---|
| `due-safe` | `#14B8A6` | More than 2 days out |
| `due-warning` | `#F59E0B` | Less than 24 hours |
| `due-overdue` | `#EF4444` | Past due (border / tint only; text on it uses `text-primary`) |
| `due-neutral` | `#64748B` | Done (overrides date) |

**Keeping bug and overdue apart.** Both are red-ish. Type is shown by a **left stripe plus icon plus label**; due state is shown by a **card border and faint background tint plus a date label** (with an alert icon when overdue). Neither relies on colour alone.

## 3. Typography

| Role | Font | Why |
|---|---|---|
| Heading | Inter (semibold) | Clean and neutral; lets the colours do the talking. |
| Body | Inter | Highly readable at small sizes on dark surfaces. |
| Monospace (tags, badges, code) | JetBrains Mono | Signals "developer tool"; used for the Context field, IDs and tags. |

Suggested sizes (override only if the design demands it):

- Page title: 24 px / semibold
- Section header: 16 px / semibold uppercase
- Card title: 14 px / medium
- Body: 14 px / regular
- Caption: 12 px / regular muted

## 4. Component principles

- **Cards:** Flat slate surface with a 1px border, a 4px left stripe for task type, and no shadow except a subtle lift on hover.
- **Buttons:** Solid indigo fill, white text, no gradient, `rounded-md`; secondary buttons are outlined in `text-muted`.
- **Modal:** Centered, `max-w-lg`, `surface-card` on a `surface-page` backdrop at 70% opacity, closes with Esc.
- **Empty states:** Dashed border, muted text, never sad.
- **Drag affordance (if used):** None for now. We use a status dropdown; drag-and-drop is a possible secret-sauce feature.

## 5. Voice / microcopy

Plain, short, a little dry. Written for a developer at 11pm.

| Where | Text |
|---|---|
| "+" button label | `+ Task` |
| Empty column placeholder | `Nothing here yet.` |
| Toast after "Copy Context" | `Copied. Paste it into your AI.` |
| Confirm-delete message | `Delete this task? You can't undo this.` |
| Handoff toast (M7 `task-owner`) | `Handed off to {name}.` |

## 6. Logo / wordmark

- **Product name:** Vibecoding Project Tracker
- **Wordmark style:** The name in Inter semibold, `text-primary`, with no icon.

## 7. Out of scope (this hackathon)

To keep design tight, the following are explicitly not part of `design-done`:

- A dark mode toggle. We ship dark only.
- Multiple themes. One brand, applied consistently.
- Animations beyond a 200 ms fade on toast notifications.
- A custom icon set. Use [Lucide icons](https://lucide.dev) via Tailwind classes if you need any.

---

*DESIGN.md version: hackathon-starter v1*
