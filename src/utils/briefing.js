import { CONTEXT_TEMPLATE } from './context.js';

const squash = (text) => text.replace(/\s+/g, '');

// True when the Context is empty or still the untouched placeholder template, so the
// copied briefing is not padded with blank headings.
function hasRealContext(context) {
  const trimmed = (context ?? '').trim();
  return trimmed !== '' && squash(trimmed) !== squash(CONTEXT_TEMPLATE);
}

/**
 * The Markdown briefing that "Copy Context" puts on the clipboard (M10).
 * Written to read like a natural hand-over when pasted into any AI chat.
 */
export function buildBriefing(task, stages) {
  const status = stages.find((stage) => stage.id === task.status)?.label ?? task.status;
  const meta = [
    `- Type: ${task.type === 'bug' ? 'Bug' : 'Feature'}`,
    `- Status: ${status}`,
    `- Owner: ${task.assignee}`,
    task.dueDate ? `- Due: ${task.dueDate}` : null,
    task.contextTool ? `- AI tool: ${task.contextTool}` : null,
  ].filter(Boolean);

  const parts = [
    "Here is the briefing for a task I'm working on. Use it to help me pick up where I left off.",
    `# ${task.title}`,
    meta.join('\n'),
  ];

  if (task.description?.trim()) {
    parts.push(`## Description\n${task.description.trim()}`);
  }

  if (hasRealContext(task.context)) {
    const context = task.context.trim();
    // The template already starts with its own "## Context" heading; add one if it doesn't.
    parts.push(context.startsWith('#') ? context : `## Context\n${context}`);
  }

  return `${parts.join('\n\n')}\n`;
}
