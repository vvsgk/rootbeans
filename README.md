# Root Beans website

A React and Vite website for Root Beans. The journal source is the editable JSON file at `public/data/journal.json`; no external service is queried for journal data.

## Run locally

1. Install dependencies with `npm ci`.
2. Edit `public/data/journal.json` and add any photos under `public/images/journal/`.
3. Run `npm test` and `npm run build`.
4. Run `npm run dev` to view the site.

See [README_JOURNAL_DATA.md](README_JOURNAL_DATA.md) for the entry format and publishing steps.

## Routes

- `/` — Home and recent journal entries
- `/story` — Our Story
- `/journey` — Public field journal
- `/journey/coffee` and `/journey/cacao` — Journal chapters
- `/journey/:slug` — Prerendered published entry
- `/admin` — Instructions for editing the JSON source

GitHub Actions tests and builds on pushes to `main` and manual workflow dispatches. It prerenders routes from the JSON file and deploys them to GitHub Pages.
