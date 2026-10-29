/** Public journal display helpers. The entries themselves live in public/data/journal.json. */
export function getPublishedEntries(entries = []) {
  return entries
    .filter((entry) => entry.status === 'published')
    .sort((a, b) => {
      const dateDifference = new Date(b.date || 0) - new Date(a.date || 0);
      return dateDifference || String(b.id).localeCompare(String(a.id));
    });
}

export function formatDate(date) {
  if (!date) return 'DATE TO BE ADDED';
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return 'DATE TO BE ADDED';
  return parsed
    .toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .toUpperCase();
}
