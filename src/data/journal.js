/**
 * Root Beans journal data and browser-local persistence.
 *
 * Public pages read the same collection as the dashboard. Only entries whose
 * status is "published" are shown publicly. This prototype uses localStorage;
 * see README.md for the shared-database upgrade required before launch.
 */
export const JOURNAL_STORAGE_KEY = 'rb_entries';
export const EDITOR_DRAFT_KEY = 'rb_editor_draft';

export const JOURNAL_CATEGORIES = [
  'Growing',
  'Coffee',
  'Cacao',
  'Experiments',
  'Behind the scenes',
];

export const SEED_ENTRIES = [
  {
    id: '001',
    slug: 'day-one-the-beginning',
    title: 'Day One: The Beginning',
    date: '2026-10-28',
    category: 'Growing',
    status: 'published',
    excerpt:
      'Every journey has a starting point. Ours begins with a simple idea: to understand coffee and cacao from the ground up.',
    cover: '',
    body: 'We are two friends stepping into a world we want to explore more deeply. Instead of beginning with a finished product, we have chosen to begin with the plants themselves.\n\nWe are growing different varieties, observing their progress and learning through experimentation. We know there will be questions, mistakes and unexpected discoveries along the way. We intend to document all of them.\n\nOver the next two years, we want to build our understanding of cultivation, explore the craft behind coffee roasting and chocolate-making, and gradually shape our vision for Root Beans.\n\nThis is not a story about having everything figured out. It is a record of learning how to do things properly, one step at a time.',
    question: 'What does it mean to begin at the beginning?',
    did: 'Started our first growing experiments at home on 28 October 2026.',
    learned:
      'This is our baseline. We will record varieties, growing conditions and observations as the plants develop.',
    next: 'Document the first changes in the growing space.',
    photos: [],
  },
  {
    id: '002',
    slug: 'first-growing-observations',
    title: 'First growing observations',
    date: '2026-11-11',
    category: 'Growing',
    status: 'draft',
    excerpt:
      'A place to record the first real observations, what changed and what remains uncertain.',
    cover: '',
    body: '',
    question: 'What has changed since the first day?',
    did: '',
    learned: '',
    next: '',
    photos: [],
  },
  {
    id: '003',
    slug: 'comparing-our-first-varieties',
    title: 'Comparing our first varieties',
    date: '2026-11-18',
    category: 'Experiments',
    status: 'draft',
    excerpt:
      'A small experiment in observation: comparing varieties, conditions and the questions each plant raises.',
    cover: '',
    body: '',
    question: 'How do the varieties differ?',
    did: '',
    learned: '',
    next: '',
    photos: [],
  },
];

function readJson(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getJournalEntries() {
  if (typeof window === 'undefined') return SEED_ENTRIES;
  const saved = readJson(JOURNAL_STORAGE_KEY);
  if (Array.isArray(saved)) return saved;
  saveJournalEntries(SEED_ENTRIES);
  return SEED_ENTRIES;
}

export function saveJournalEntries(entries) {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(entries));
    return true;
  } catch (error) {
    console.error('Unable to save Root Beans journal entries.', error);
    return false;
  }
}

export function getWorkingDraft() {
  if (typeof window === 'undefined') return null;
  const draft = readJson(EDITOR_DRAFT_KEY);
  return draft && typeof draft === 'object' ? draft : null;
}

export function saveWorkingDraft(draft) {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(
      EDITOR_DRAFT_KEY,
      JSON.stringify({ ...draft, autosavedAt: new Date().toISOString() }),
    );
    return true;
  } catch (error) {
    console.error('Unable to autosave the Root Beans working draft.', error);
    return false;
  }
}

export function clearWorkingDraft() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(EDITOR_DRAFT_KEY);
  }
}

export function getPublishedEntries(entries) {
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

export function slugify(value = '') {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function createEntryTemplate(entries) {
  const maxId = entries.reduce((max, entry) => {
    const numeric = Number.parseInt(entry.id, 10);
    return Number.isFinite(numeric) ? Math.max(max, numeric) : max;
  }, 0);
  const id = String(maxId + 1).padStart(3, '0');
  return {
    id,
    slug: '',
    title: '',
    date: new Date().toISOString().slice(0, 10),
    category: 'Growing',
    status: 'draft',
    excerpt: '',
    cover: '',
    body: '',
    question: '',
    did: '',
    learned: '',
    next: '',
    photos: [],
  };
}
