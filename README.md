# Root Beans website

A refactored React + Vite website for Root Beans, organized into small, purpose-specific files rather than one large JSX file. It follows the supplied Design and Motion Guide while preserving the core idea: two friends learning coffee and cacao from the ground up, documenting real work, and aiming toward an October 2028 launch.

## Project structure

```text
root-beans-app/
├── index.html
├── package.json
├── vite.config.js
├── public/
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── components/
    │   ├── SiteHeader.jsx
    │   ├── SiteFooter.jsx
    │   ├── JournalCard.jsx
    │   └── CraftProgress.jsx
    ├── pages/
    │   ├── Home.jsx
    │   ├── OurStory.jsx
    │   ├── Journey.jsx
    │   ├── Coffee.jsx
    │   ├── Cacao.jsx
    │   ├── JournalEntry.jsx
    │   └── admin/
    │       └── JournalDashboard.jsx
    ├── sections/
    │   ├── HeroSection.jsx
    │   ├── CraftAheadSection.jsx
    │   ├── FoundersSection.jsx
    │   ├── CoffeeCacaoSection.jsx
    │   ├── LivingJournalSection.jsx
    │   └── HorizonSection.jsx
    ├── data/
    │   ├── journal.js
    │   └── milestones.js
    └── styles/
        ├── global.css
        ├── home.css
        ├── journey.css
        └── journal.css
```

## Run locally

1. Install Node.js LTS from <https://nodejs.org/>.
2. Extract the ZIP and open a terminal inside the `root-beans-app` directory.
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`
5. Open the local URL printed in the terminal.
6. To validate a production build: `npm run build`

The package uses React, Vite and Lucide icons. No database service is needed for this prototype.

## Routes

- `/` — Home: hero, current Craft Ahead progress, the two newest published journal entries, Horizon, and founders at the end.
- `/story` — Our Story.
- `/journey` — Field journal overview, coffee and cacao chapters, craft progression, milestones, search, filters and the complete public archive.
- `/journey/coffee` — Coffee chapter, reachable from the Journey page; it is not a top-level navigation item.
- `/journey/cacao` — Cacao chapter, reachable from the Journey page; cacao is clearly marked as a future exploration.
- `/journey/:slug` — Published journal entry with previous/next navigation.
- `/admin` — Local journal dashboard and editor.

## Journal behaviour

The homepage preview and Journey archive use the same journal data collection from `src/data/journal.js`.

- Only entries with `status: "published"` appear publicly.
- The homepage shows the two newest published entries, newest first.
- Journey shows all published entries, newest first, and supports category filters and text search.
- The dashboard can create, edit, publish, save drafts, upload a small cover image, and delete entries.
- The editor autosaves a separate unfinished working copy while typing. The dashboard can recover it after the project is stopped and reopened.
- The dashboard can download a JSON backup and restore that backup later. Keep a copy outside the project folder.
- Entries and working drafts are stored in browser `localStorage`; normal server restarts do not erase them when the same browser profile and exact local URL/port are used.

### Important storage limitation

This is still a local prototype, not cloud publishing. Browser data is not automatically shared between founders or between devices, changing the local port can make another storage origin appear empty, and clearing browser data can erase it. Download backups regularly. Before launch, move the journal to a secured shared database or CMS with authentication, image storage, backups and access control. The newsletter form is a front-end interaction demo and must be connected to an email provider before collecting real subscribers.

## Design and motion

- Warm ivory `#F4F0E7`, espresso `#302720`, botanical olive `#6D7657` / readable olive `#4F5740`, and restrained burgundy `#7B263A`.
- Cormorant Garamond headings and Inter body typography.
- Hero headline entrance and gentle photo reveal; scroll-triggered section and card reveals; subtle card image zoom and arrow movement; timeline line reveal; restrained desktop-only hero parallax.
- `prefers-reduced-motion` is respected and content remains usable without animation.
- Photography areas are labelled placeholders on purpose. Replace them with honest, natural-light photos from your own growing space rather than generic café stock photography.

## Content honesty

Coffee growing is the current hands-on focus. Cacao is the next exploration. Harvesting, fermentation, drying, roasting, refining and tasting remain planned learning stages. The October 2028 launch is a target subject to product quality, production readiness and applicable requirements. For any future trial that uses sourced ingredients, disclose the origin clearly.
