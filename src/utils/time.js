/** "just now", "5 min ago", "2 h ago", "3 d ago" for an ISO timestamp. */
export function timeAgo(isoTimestamp, now = Date.now()) {
  const minutes = Math.floor((now - new Date(isoTimestamp).getTime()) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return `${Math.floor(hours / 24)} d ago`;
}
