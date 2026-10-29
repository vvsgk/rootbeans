import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { resolveJournalImage, validateJournalEntries } from '../src/data/journalFeed.js';
import { validateBuiltSite } from '../scripts/validate-built-site.js';

const entry = {
  id: '004',
  slug: 'new-growing-notes',
  title: 'New growing notes',
  date: '2026-12-01',
  category: 'Growing',
  status: 'published',
  excerpt: 'A short introduction.',
  body: 'The story.',
  cover: '/images/journal/growing.webp',
  photos: ['/images/journal/growing.webp'],
  question: '',
  did: '',
  learned: '',
  next: '',
};

test('manual JSON accepts published entries and project image paths', () => {
  assert.deepEqual(validateJournalEntries([entry], { assetExists: (path) => path === '/images/journal/growing.webp' }), [entry]);
});

test('manual JSON rejects missing titles, invalid slugs, dates, and unpublished entries', () => {
  for (const patch of [
    { title: '' },
    { slug: 'Not a slug' },
    { date: '+046336-12' },
    { status: 'draft' },
  ]) {
    assert.throws(() => validateJournalEntries([{ ...entry, ...patch }]));
  }
});

test('manual JSON rejects duplicate slugs and missing photo files', () => {
  assert.throws(() => validateJournalEntries([entry, { ...entry, id: '005' }]), /duplicate slug/);
  assert.throws(() => validateJournalEntries([entry], { assetExists: () => false }), /does not exist/);
  assert.throws(() => validateJournalEntries([{ ...entry, cover: 'https://example.com/photo.jpg' }]), /under \/images\/journal\//);
});

test('image references resolve below the configured Vite base path', () => {
  assert.equal(resolveJournalImage('/images/journal/growing.webp', '/rootbeans/'), '/rootbeans/images/journal/growing.webp');
});

test('built-site check rejects a JSON entry without a prerendered route', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'root-beans-build-'));
  const write = (path, content) => {
    const filePath = join(directory, path);
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, content);
  };
  try {
    write('data/journal.json', JSON.stringify([{ ...entry, cover: '', photos: [] }]));
    for (const route of ['', 'story', 'journey', 'journey/coffee', 'journey/cacao']) {
      write(`${route ? `${route}/` : ''}index.html`, '<title>Static route</title>');
    }
    write('sitemap.xml', '<urlset></urlset>');
    write('robots.txt', 'Sitemap: /sitemap.xml');
    await assert.rejects(validateBuiltSite(directory), /Prerendered route is missing: \/journey\/new-growing-notes/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
