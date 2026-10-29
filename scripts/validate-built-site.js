import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { validateJournalEntries } from '../src/data/journalFeed.js';

const FIXED_ROUTES = ['/', '/story', '/journey', '/journey/coffee', '/journey/cacao'];

function htmlEscape(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function routeFile(outputDir, route) {
  return join(outputDir, route === '/' ? 'index.html' : `${route.slice(1)}/index.html`);
}

export async function validateBuiltSite(outputDir = resolve('dist')) {
  const feedPath = join(outputDir, 'data/journal.json');
  let entries;
  try {
    entries = JSON.parse(await readFile(feedPath, 'utf8'));
  } catch (error) {
    throw new Error(`Built journal feed is missing or invalid at ${feedPath}.`, { cause: error });
  }
  validateJournalEntries(entries, {
    assetExists: (imagePath) => existsSync(resolve(outputDir, imagePath.replace(/^\//, ''))),
  });

  const routes = [...FIXED_ROUTES, ...entries.map((entry) => `/journey/${entry.slug}`)];
  for (const route of routes) {
    const htmlPath = routeFile(outputDir, route);
    let html;
    try {
      html = await readFile(htmlPath, 'utf8');
    } catch (error) {
      throw new Error(`Prerendered route is missing: ${route}`, { cause: error });
    }
    if (route.startsWith('/journey/') && !FIXED_ROUTES.includes(route)) {
      const entry = entries.find((item) => route === `/journey/${item.slug}`);
      if (!html.includes(`<title>${htmlEscape(entry.title)} | Root Beans Journal</title>`) || !html.includes('"@type":"BlogPosting"')) {
        throw new Error(`Prerendered journal route is missing its title or article data: ${route}`);
      }
    }
  }

  const sitemap = await readFile(join(outputDir, 'sitemap.xml'), 'utf8');
  const robots = await readFile(join(outputDir, 'robots.txt'), 'utf8');
  if (!sitemap.includes('<urlset') || !robots.includes('Sitemap:')) {
    throw new Error('Built sitemap.xml or robots.txt is incomplete.');
  }
  for (const entry of entries) {
    if (!sitemap.includes(`/journey/${entry.slug}`)) {
      throw new Error(`Published entry is missing from sitemap.xml: ${entry.slug}`);
    }
  }
  return { entryCount: entries.length, routeCount: routes.length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const result = await validateBuiltSite(resolve(process.argv[2] || 'dist'));
  console.log(`Build verified: ${result.entryCount} published entries across ${result.routeCount} prerendered routes.`);
}
