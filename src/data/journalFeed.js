const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const IMAGE_PREFIX = '/images/journal/';

function isValidDate(value) {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function isValidImagePath(value) {
  return typeof value === 'string' && value.startsWith(IMAGE_PREFIX) && !value.includes('..') && !/[?#]/.test(value);
}

export function validateJournalEntries(entries, { assetExists = () => true } = {}) {
  if (!Array.isArray(entries)) throw new Error('Journal data must be a JSON array.');
  const slugs = new Set();

  for (const [index, entry] of entries.entries()) {
    const row = index + 1;
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      throw new Error(`Journal entry ${row} must be an object.`);
    }
    if (entry.id === undefined || String(entry.id).trim() === '') {
      throw new Error(`Journal entry ${row} is missing an id.`);
    }
    if (typeof entry.title !== 'string' || !entry.title.trim()) {
      throw new Error(`Journal entry ${row} is missing a title.`);
    }
    if (typeof entry.slug !== 'string' || !SLUG_PATTERN.test(entry.slug)) {
      throw new Error(`Journal entry ${row} has an invalid slug.`);
    }
    if (slugs.has(entry.slug)) throw new Error(`Journal data contains duplicate slug: ${entry.slug}`);
    slugs.add(entry.slug);
    if (entry.status !== 'published') {
      throw new Error(`Journal entry ${row} must have status "published" before it is added to the public JSON file.`);
    }
    if (!isValidDate(entry.date || '')) {
      throw new Error(`Journal entry ${row} date must use YYYY-MM-DD format.`);
    }

    const photos = entry.photos ?? [];
    if (!Array.isArray(photos)) throw new Error(`Journal entry ${row} photos must be an array.`);
    const images = [entry.cover || '', ...photos].filter(Boolean);
    for (const image of images) {
      if (!isValidImagePath(image)) {
        throw new Error(`Journal entry ${row} image paths must be under ${IMAGE_PREFIX}.`);
      }
      if (!assetExists(image)) throw new Error(`Journal image does not exist: ${image}`);
    }
  }

  return entries;
}

export function resolveJournalImage(source, baseUrl = import.meta.env.BASE_URL) {
  if (!source) return '';
  const relativePath = source.replace(/^\/+/, '');
  return `${baseUrl.replace(/\/?$/, '/')}${relativePath}`;
}

export async function fetchJournalFeed() {
  const defaultUrl = `${import.meta.env.BASE_URL.replace(/\/?$/, '/')}data/journal.json`;
  const url = typeof window !== 'undefined' && window.__JOURNAL_FEED_URL__
    ? window.__JOURNAL_FEED_URL__
    : defaultUrl;
  const response = await fetch(url, { method: 'GET', cache: 'no-store' });
  if (!response.ok) throw new Error(`Journal JSON request returned HTTP ${response.status}.`);
  return validateJournalEntries(await response.json());
}
