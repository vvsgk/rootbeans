import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const SITE_URL = (process.env.VITE_SITE_URL || 'https://lab.rootbeans.in').replace(/\/$/, '');
const BASE_URL = process.env.BASE_URL || '/';

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function safeScriptJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function imageUrl(source) {
  if (!source) return '';
  if (/^https?:\/\//i.test(source)) return source;
  return `${SITE_URL}${BASE_URL.replace(/\/?$/, '/')}${source.replace(/^\/+/, '')}`;
}

function routeInfo(path, entries) {
  const entry = path.startsWith('/journey/') && !['/journey/coffee', '/journey/cacao'].includes(path)
    ? entries.find((item) => item.slug === path.slice('/journey/'.length))
    : null;
  if (entry) {
    return {
      title: `${entry.title} | Root Beans Journal`,
      description: entry.excerpt || entry.body.slice(0, 160),
      image: imageUrl(entry.cover || entry.photos?.[0]),
      type: 'article',
      entry,
    };
  }

  const routes = {
    '/': ['Root Beans | Rooted in flavour', 'Two friends. Two beans. One journey worth growing.'],
    '/story': ['Our Story | Root Beans', 'Two friends learning coffee and cacao from the ground up.'],
    '/journey': ['The Journey | Root Beans', 'Follow the Root Beans growing journal, experiments and field notes.'],
    '/journey/coffee': ['Coffee | Root Beans', 'Follow Root Beans as we learn the craft behind coffee.'],
    '/journey/cacao': ['Cacao | Root Beans', 'Follow Root Beans as we learn the craft behind cacao.'],
  };
  const [title, description] = routes[path] || ['Root Beans | Rooted in flavour', 'Two friends. Two beans. One journey worth growing.'];
  const featured = entries.find((item) => item.cover || item.photos?.length);
  return { title, description, image: imageUrl(featured?.cover || featured?.photos?.[0]), type: 'website' };
}

function replaceHead(html, path, entries) {
  const info = routeInfo(path, entries);
  const canonical = `${SITE_URL}${BASE_URL.replace(/\/$/, '')}${path === '/' ? '/' : path}`;
  const setMeta = (markup, key, value, attribute = 'name') => {
    const pattern = new RegExp(`<meta ${attribute}="${key}" content="[^"]*"\\s*\\/>`);
    return markup.replace(pattern, `<meta ${attribute}="${key}" content="${escapeHtml(value)}" />`);
  };

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(info.title)}</title>`);
  html = setMeta(html, 'description', info.description);
  html = setMeta(html, 'og:type', info.type, 'property');
  html = setMeta(html, 'og:title', info.title, 'property');
  html = setMeta(html, 'og:description', info.description, 'property');
  html = setMeta(html, 'og:url', canonical, 'property');
  html = setMeta(html, 'twitter:card', info.image ? 'summary_large_image' : 'summary');
  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${escapeHtml(canonical)}" />`);
  if (info.image) {
    html = html.replace('</head>', `  <meta property="og:image" content="${escapeHtml(info.image)}" />\n  <meta name="twitter:image" content="${escapeHtml(info.image)}" />\n</head>`);
  } else {
    html = html.replace(/\s*<meta property="og:image"[^>]*\/>/g, '').replace(/\s*<meta name="twitter:image"[^>]*\/>/g, '');
  }

  const schemas = [];
  if (info.entry) {
    const entry = info.entry;
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: entry.title,
      description: info.description,
      datePublished: entry.date || undefined,
      image: info.image || undefined,
      mainEntityOfPage: canonical,
      author: { '@type': 'Organization', name: 'Root Beans' },
      publisher: { '@type': 'Organization', name: 'Root Beans' },
    });
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}${BASE_URL}` },
        { '@type': 'ListItem', position: 2, name: 'Journey', item: `${SITE_URL}${BASE_URL}journey` },
        { '@type': 'ListItem', position: 3, name: entry.title, item: canonical },
      ],
    });
  }
  const schemaHtml = schemas.map((schema) => `<script type="application/ld+json">${safeScriptJson(schema)}</script>`).join('\n');
  const feedHash = createHash('sha256').update(safeScriptJson(entries)).digest('hex').slice(0, 12);
  const feedUrl = `${BASE_URL.replace(/\/?$/, '/')}data/journal.json?v=${feedHash}`;
  const entriesHtml = `<script>window.__JOURNAL_ENTRIES__=${safeScriptJson(entries)};window.__JOURNAL_FEED_URL__=${safeScriptJson(feedUrl)};</script>`;
  return html.replace('</head>', `${schemaHtml}\n${entriesHtml}\n</head>`);
}

export async function prerenderSite({ serverOutDir = resolve('.ssr-build') } = {}) {
  const { renderPage } = await import(pathToFileURL(resolve(serverOutDir, 'entry-server.js')).href);
  const entries = JSON.parse(await readFile(resolve('public/data/journal.json'), 'utf8'));
  const template = await readFile(resolve('dist/index.html'), 'utf8');
  const paths = ['/', '/story', '/journey', '/journey/coffee', '/journey/cacao', ...entries.map((entry) => `/journey/${entry.slug}`)];

  await rm(resolve('dist/.gitkeep'), { force: true });
  await rm(resolve('dist/404.html.before-404'), { force: true });
  await rm(resolve('dist/images/journal/.gitkeep'), { force: true });

  for (const path of paths) {
    const html = replaceHead(template.replace('<div id="root"></div>', `<div id="root">${renderPage(path, entries)}</div>`), path, entries);
    const outputPath = resolve('dist', path === '/' ? 'index.html' : `${path.slice(1)}/index.html`);
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, html);
  }

  const urls = paths.map((path) => `<url><loc>${escapeHtml(`${SITE_URL}${BASE_URL.replace(/\/$/, '')}${path === '/' ? '/' : path}`)}</loc></url>`).join('\n');
  await writeFile(resolve('dist/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  await writeFile(resolve('dist/robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}${BASE_URL}sitemap.xml\n`);
}
