# Vibecoding Project Tracker — PRD

**Status:** Hackathon starter PRD · review and fill in the **`<TODO>`** sections before you tag `prd-done`.

---

## 1. Problem

Vibecoding teams have two recurring pains with large projects:

1. **They lose track of tasks.** Three teammates, a hundred small things, no shared view. Nothing tells them what state each task is actually in.
2. **They lose track of prompts.** The AI gave them working code two days ago but no one remembers the prompt that produced it. When they need to iterate, they start from scratch.

A spreadsheet doesn't solve this. A real project tool (Linear, Jira, Notion) is overkill, doesn't know about prompts, and takes hours to set up.

## 2. Target users

- **Primary:** the team members, for the remaining weeks of the summer semester.
- **Secondary:** future cohorts of vibecoders taking the same class.

We are designing the tool we ourselves will use. The pitch demo is also our first real user test.

## 3. Product overview

A single-page web app with two persistent surfaces:

- A **Kanban board** where vibecoding tasks move through four states.
- An **Anchor Board** above it that pins the four final-project deliverables (Presentation, Demo, Report, Documentation).

Each task carries the prompt context that produced it, so any teammate can click a button and copy the task + prompt history back into an AI chat to continue work.

## 4. Primary user flow

1. Open the Webapp. The board loads from local storage.
2. Click "+" to add a task. Fill in title, type, assignee, due date, prompt context.
3. Move the task across columns as you work.
4. When stuck, click "Copy as Prompt Context" on a task and paste it into Claude/ChatGPT/Cursor to continue.
5. Hand off a task to a teammate with one dropdown.
6. Drop final deliverable links into the Anchor Board as you produce them.

## 5. Data model

Locked. Do not change without team agreement.

```js
// A single vibecoding task.
Task = {
  id: string,                    // uuid or timestamp string
  title: string,
  description: string,
  type: 'feature' | 'bug',       // visual color coding
  status: 'todo' | 'in-progress' | 'review' | 'done',
  assignee: string,              // one of the three teammate names from §8
  dueDate: string | null,        // ISO date 'YYYY-MM-DD'
  createdDate: string,           // ISO date 'YYYY-MM-DD'

  // Added in later milestones:
  context: string,               // M9 context — curated briefing for the next AI / teammate
  contextTool: string | null,    // M9 context — 'Claude' | 'ChatGPT' | 'Cursor' | 'Lovable' | 'Replit' | 'Other'
  contextUpdatedAt: string|null, // M9 context — ISO timestamp set automatically on save
}

// One of four pinned deliverable slots.
Anchor = {
  id: 'presentation' | 'demo' | 'report' | 'documentation',
  label: string,                 // human-readable
  url: string | null,            // the link the team pastes in
}
```

## 6. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React (via Vite) | What the scaffold ships with. Don't migrate. |
| Styling | Tailwind | Already configured. Use utility classes; no separate CSS files. |
| State | React `useState` + a `useLocalStorage` hook | Simple, no library needed. |
| Persistence | **localStorage** | Zero infra. Pick this. Do not switch to a backend mid-hackathon. |
| Deploy | Vercel | One-click deploy from GitHub. |

> **Decision:** localStorage, not a shared backend. If you want a shared backend later, that's M14 — out of scope for the hackathon.

## 7. Stage names

Four columns, in this order, with these exact labels in the UI:

1. **To Do**
2. **In Progress**
3. **Review**
4. **Done**

## 8. Team

Fill these in before tagging `prd-done`:

| Slot | Name | Email | GitHub handle |
|---|---|---|---|
| Teammate A | `Spencer Snowden` | `spencer.snowden@cardiff.com` | `Spencre` |
| Teammate B | `Harry Potter` | `harry.potter@cardiff.com` | demo teammate, no real account |
| Teammate C | `Frodo Baggins` | `frodo.baggins@cardiff.com` | demo teammate, no real account |

This is a solo, individual project. Teammates B and C are fictional demo personas, so the board can show hand-offs and a second and third user logging in. All real work is by Spencer Snowden.

These three names become the **only** allowed values for `Task.assignee`. No auth — just a dropdown.

## 9. Milestone ownership

Fill in the owner column. Recommended default in **bold**; change if your team has different strengths.

| # | Tag | Title | Suggested owner | Final owner |
|---|---|---|---|---|
| 3 | `design-done` | Design system + voice (DESIGN.md) | **B** | `Spencer Snowden` |
| 4 | `data-model` | Task model + board view | **A** | `Spencer Snowden` |
| 5 | `crud-modal` | Add / edit / delete modal | **A** | `Spencer Snowden` |
| 6 | `tag-style` | Feature / bug colors | **B** | `Spencer Snowden` |
| 7 | `task-owner` | Owner indicator + handoff | **A** | `Spencer Snowden` |
| 8 | `due-tint` | Due-date color tinting | **B** | `Spencer Snowden` |
| 9 | `context` | Context field on the task modal | **C** | `Spencer Snowden` |
| 10 | `copy-prompt` | "Copy as Prompt Context" button | **C** | `Spencer Snowden` |
| 11 | `anchors` | Deliverable Anchor Board | **B** | `Spencer Snowden` |
| 12 | `secret-sauce` | The one thing that makes it yours | **C / All** | `Spencer Snowden` |
| 13 | `pitch-ready` | Demo + pitch rehearsal | **All** | `Spencer Snowden` |


Track A owns the state model and task ownership. Track B owns the visuals (and design — M3 runs parallel to M2 so the team starts Phase 3 with the palette already chosen). Track C owns the differentiator features (M9 + M10 — the context field and the Copy-as-Prompt button) and usually leads on M12 secret-sauce. Put your strongest prompter on Track C.

**Dependency note.** M3 (`design-done`) runs **in parallel with M2** — Person B drafts DESIGN.md and pastes the colors into `tailwind.config.js` while the rest of the team reviews the PRD. M6 / M7 / M8 / M11 all depend on M4 + M5 being done first. While Person A builds M4+M5 (first ~60 min of Phase 3), Person C should draft the Markdown template for the "Copy as Prompt Context" output (M10). M12 `secret-sauce` is open-ended — pick whatever makes the tracker uniquely yours; constraint is "must be visible in the demo and must not break anything else."

## 10. AI / vibe coding angle

Where AI will be heavily used:
- M4, M5: scaffold the board and the modal from a single prompt each.
- M9, M10: write the Markdown serialization helper for the Context field.
- M7: animation polish for the handoff toast.

Where AI will **not** save you time:
- M2 (this PRD review) — read it yourself.
- M3 (DESIGN.md) — design taste is yours, not the model's.
- M12 (secret-sauce) — the whole point is that AI can't predict it.
- M13 (pitch) — write the script in your own voice.

Keep the Context field of each real task up to date as you work. By the end of the hackathon you should have a handful of curated context blocks — those become part of your Module 5 "Vibe Coding History" deliverable.

## 11. Team identity

Fill in:

- **Team name:** `Spencer Snowden`
- **Tagline (one sentence):** `Track your vibecoding tasks, and never lose the prompt that built them.`
- **Tracker URL after deploy:** https://vibecoding-project-tracker-nine.vercel.app/

## 12. Out of scope (do not build)

- Real authentication (passwords, accounts, a login backend). A front-end demo login is in scope, see §15 item 14. *(Client Q&A; lecturer guidance)*
- Real GitHub integration.
- A real backend / shared database.
- Mobile responsive — desktop only is fine.
- Multi-team support.
- Real-time collaboration.

## 13. Definition of done

The hackathon is "done" when all 13 milestone tags are pushed to your repo and visible on the dashboard. The pitch is "done" when:

- The board loads on Vercel without errors.
- The "Copy as Prompt Context" demo works on stage.
- 5 min pitch is rehearsed.

## 14. Data requirements

Source tags: *Client* = kickoff session and Q&A, *Mn slide* = milestone slides, *Assessment* = module proforma.

- Each task is a story/card with an id, title, description, type (feature / bug), status, assignee, due date and created date (see §5). *(Client; M4 slide)*
- Each task stores **AI context**: sub-requirements for a feature, or the error output for a bug, so it can be handed to an AI tool as-is. This is the differentiator versus GitLab / Trello / Jira. *(Client)*
- Each task also stores the **AI tool** used (Claude, ChatGPT, Cursor, Lovable, Replit or Other) and a **last-updated timestamp** that is set automatically when the context is edited. *(M9 slide)*
- User info: **name, email and GitHub account** per team member, held in a front-end team record (demo data). `Task.assignee` stays the name only. *(Client Q&A)*
- Four deliverable slots (Presentation, Demo, Report, Documentation), each holding one URL. *(M11 slide; see `Anchor` in §5)*
- 3–4 mock tasks are loaded on first use so the board is never empty. *(M4 slide)*
- All data persists between sessions in localStorage (see §6). *(M5 slide)*

## 15. Functional requirements

1. Kanban board with columns **To Do, In Progress, Review, Done**; tasks are categorised by column. *(Client)*
2. Add a task with a "+" button. *(Client; M5 slide)*
3. Click a card to open the same form pre-filled, to edit or delete the task. *(Client; M5 slide)*
4. Change a task's status from the dropdown in that form, which is also the keyboard alternative to dragging a card (item 12). *(M5 slide)*
5. Optional due date on a task. *(Client)*
6. Due-date colour tint, updating automatically: more than 24 hours left is calm, less than 24 hours is a warning, past due is an alarm, done is neutral. The slides only define "more than 2 days", so 24–48 hours out is treated as calm (decision made with the project owner). A due date means the end of that day. *(M8 slide)*
7. Features and bugs are visually distinct by colour (e.g. bug = red, feature = green) and a small corner icon, used consistently on the board, in the form and anywhere else a task appears. *(Client; M6 slide)*
8. Task owner shown on each card with initials or an avatar, plus a "Hand off to…" dropdown that reassigns the task and acknowledges it visually. *(M7 slide)*
9. A Markdown **Context** field on each task, pre-filled with a template (Background / Constraints / Tried so far / Pick up), an optional AI tool dropdown, and a "last updated" hint. *(Client; M9 slide)*
10. A **Copy Context** button on every card and inside the form. It copies the title, description and full context to the clipboard, formatted so it reads as a clean briefing in any AI chat. A "Copied" toast confirms the copy. *(M10 slide)*
11. An **Anchor Board** pinned above the Kanban with four cards (Presentation, Demo, Report, Documentation). Each has one URL field and a status dot that changes when a link is added, and the links survive a reload. *(M11 slide)*
12. One original "secret sauce" feature chosen by the team, visible in the demo (examples from the slide: drag-and-drop, collapsible content, sounds). *(M12 slide)*
    - **Chosen: drag a card to another column to change its status.** Why: moving a task is the most frequent action on a Kanban board, and the status dropdown in the modal takes four steps (open, change, save, close); dragging takes one. It supports the core problem of keeping a shared, current view of task state (§1). The dropdown stays as the keyboard-accessible alternative, and a toast ("Moved to Review.") confirms the move.
13. Team panel: the team strip shows each member's name and workload, and a "Team details" dropdown shows each member's email and GitHub account. *(Client Q&A)*
14. **Demo login (MVP).** On first load a login form shows the app name, a labelled Username field, a labelled Password field and a "Log in" button. The fields are prefilled (`spencer` and a demo password) so a marker can just press Log in, and a hint says "Demo only: no real accounts or passwords. Try: spencer, harry or frodo. Any password works." Demo usernames map to the team members in §8 (`spencer` = Spencer Snowden, `harry` = Harry Potter, `frodo` = Frodo Baggins), matched case-insensitively and ignoring spaces. The password is ignored but must not be empty. An unknown username or empty password shows an inline error and keeps what was typed. The signed-in user is stored in localStorage (`vibetracker.currentUser`), so a reload keeps them signed in. Once in, the header shows a "Signed in as" user selector, which changes user in one step, and a "Log out" button that returns to the login screen. This is a **front-end demo login with no real authentication**: no backend, no registration, and the Task data model is unchanged. It must be fully keyboard operable, with focus on the Username field when the screen appears. *(Client Q&A; lecturer guidance)*
15. Text-size control: header buttons switch between normal, large and largest text, and the choice is remembered. *(Added; WCAG 2.2 criterion 1.4.4 Resize Text)*

## 16. Non-functional requirements

- **Web-based**, built with a leading web framework (React + Vite + Tailwind, see §6). Any visual design is allowed. *(Client)*
- **Single team:** one instance serves one team and shows only that team's board; no multi-team support. *(Client Q&A)*
- **Security:** no cybersecurity requirements at this stage. There is **no real authentication and no backend**. Because the tool has more than one user, a login screen is included (§15 item 14), but it is a **front-end demo only**: it identifies who is using the board and protects nothing. *(Client Q&A; lecturer guidance)*
- **Deployment:** deploy to Vercel. The client said deploying is optional as long as the tool can be demonstrated on a laptop, but the assessment requires a link the marker can open. *(Client; Assessment)*
- **No registration or credentials** are needed to open and use the prototype: the demo login is prefilled, accepts any password, and says so on screen. *(Assessment)*
- **Desktop only:** mobile layouts are out of scope (see §12). *(Starter PRD)*
- **Reliability of data:** closing and reopening the browser keeps everything intact. *(M5 slide)*
- **Readability:** task type and due-date state must be understandable by icon or label as well as colour. *(Suggested UX principle, not a client requirement)*
- **Keyboard use:** the task form keeps keyboard focus inside it while open and returns focus to where the user was when it closes. *(Added; WCAG 2.2 criterion 2.4.3 Focus Order)*
- **Skip link:** a "Skip to board" link lets keyboard users jump past the header. *(Added; WCAG 2.2 criterion 2.4.1 Bypass Blocks)*

---

*PRD version: hackathon-starter v1 · maintained by Prof. Dr. Ignacio Alvarez*
