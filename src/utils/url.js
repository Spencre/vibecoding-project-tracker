// Link helpers for the Anchor Board (M11).

/** True only for http(s) links, so a pasted `javascript:` URL can never become a clickable link. */
export function isHttpUrl(value) {
  if (!value) return false;
  try {
    const { protocol } = new URL(value);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Tidy a pasted link: trim it, and add https:// when it looks like a bare domain
 * ("example.com/demo"). Empty input becomes null. Anything else is left as typed.
 */
export function normalizeUrl(value) {
  const trimmed = (value ?? '').trim();
  if (trimmed === '') return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return trimmed;
  if (/^[^\s/]+\.[^\s]+$/.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
}
