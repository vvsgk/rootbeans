# Editing the Root Beans journal

The public journal lives in `public/data/journal.json`. Edit this file directly, then upload or commit it to the repository. When changes are committed to `main`, GitHub Actions validates the JSON, rebuilds the journal pages, and deploys the website to GitHub Pages.

## Entry format

The file is a JSON array. Add one object per public entry:

```json
{
  "id": "004",
  "slug": "new-growing-notes",
  "title": "New growing notes",
  "date": "2026-12-01",
  "category": "Growing",
  "status": "published",
  "excerpt": "A short introduction shown on journal cards.",
  "body": "The full story.\n\nA blank line starts a new paragraph.",
  "cover": "/images/journal/new-growing-notes.webp",
  "photos": ["/images/journal/new-growing-notes.webp"],
  "question": "What are we observing?",
  "did": "What we did.",
  "learned": "What we learned.",
  "next": "What comes next."
}
```

Use a unique lowercase hyphenated `slug`, a non-empty `title`, and an ISO date (`YYYY-MM-DD`) or an empty date. The JSON file is public, so include only entries ready to publish and set each entry’s `status` to `published`.

## Photos and publishing

1. Add image files to `public/images/journal/`.
2. Reference them in `cover` or the `photos` array with paths beginning `/images/journal/`.
3. Run `npm test` and `npm run build` to validate the data and generated pages.
4. Upload or commit the JSON and image files to the repository’s `main` branch. The Pages workflow publishes the update.

The build rejects invalid JSON, duplicate or malformed slugs, invalid dates, unpublished entries, and missing image files. It also verifies every entry has a prerendered route and appears in `sitemap.xml`.
