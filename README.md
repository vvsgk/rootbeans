# Root Beans website prototype

A React + Vite prototype for the Root Beans brand and its evolving growing journal.

## Run locally

1. Install Node.js LTS from https://nodejs.org/.
2. Open a terminal in this folder.
3. Run `npm install`.
4. Run `npm run dev` and open the local URL Vite prints.

## Current experience

- The homepage hero and original editorial visual system are preserved.
- Craft Ahead is now the second section and distinguishes current coffee-growing work from future processes.
- Coffee and cacao are combined into the Journey page. Coffee is shown as the current focus; cacao is clearly labelled as the next exploration.
- The standalone Coffee & Cacao navigation/page has been removed.
- The founders' homepage section has been moved to the end and its copy preserved.
- The homepage journal preview shows the latest two published entries; the Journey archive lists all published entries, newest first.
- Draft entries stay out of public journal views.
- The motion system follows the supplied guide: a 600–900 ms hero entrance, restrained scroll reveals, subtle 1.04 image zoom and arrow nudges, timeline line reveal, and reduced-motion support.
- Responsive layout and keyboard focus styling are retained.

## Important prototype limitation

Journal entries currently use browser `localStorage`. This means entries are stored only in that browser and are not shared between devices or users. Before a public launch, connect the journal dashboard to a real database/CMS and add authentication. The follow form is also a front-end demo and does not collect or send subscriptions.

## Content and imagery

Use authentic photographs of your own plants, growing setup, notes and experiments in place of the labelled placeholders. Planned stages are intentionally not presented as completed work. Replace founder-name placeholders before publishing.
# rootbeans
