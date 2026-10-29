import { ArrowUpRight, Sprout } from 'lucide-react';

export default function JournalDataDashboard() {
  return (
    <div className="admin-shell">
      <header className="admin-top">
        <a className="wordmark" href="/" aria-label="Root Beans home">ROOT BEANS<span className="wordmark-dot">.</span></a>
        <span className="admin-label">JOURNAL FILE</span>
      </header>
      <main className="admin-content">
        <Sprout size={28} strokeWidth={1} />
        <p className="eyebrow">ROOT BEANS · CONTENT SOURCE</p>
        <h1>The journal desk.</h1>
        <p className="admin-intro">Edit the public journal in <code>public/data/journal.json</code>. Add published entries to the JSON array, then upload or commit the file to the repository.</p>
        <div className="admin-note" style={{ marginTop: 28 }}>
          <Sprout size={18} />
          <div>
            <strong>Publishing steps</strong>
            <p>Keep only public entries in the JSON file. Save photos under <code>public/images/journal/</code> and use paths such as <code>/images/journal/seedling.webp</code> in <code>cover</code> or <code>photos</code>. Push the JSON and image files to <code>main</code>; GitHub Pages builds and publishes the updated journal.</p>
          </div>
        </div>
        <p>
          <a className="text-link" href="/data/journal.json" target="_blank" rel="noreferrer">
            View the current journal JSON <ArrowUpRight size={14} />
          </a>
        </p>
      </main>
    </div>
  );
}
