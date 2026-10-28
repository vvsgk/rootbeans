import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { PhotoFrame } from '../components/JournalCard.jsx';
import { formatDate } from '../data/journal.js';

export default function JournalEntry({ entry, publishedEntries, navigate }) {
  const currentIndex = publishedEntries.findIndex((item) => item.id === entry.id);
  const previous = publishedEntries[currentIndex + 1];
  const next = publishedEntries[currentIndex - 1];
  const paragraphs = (entry.body || '').split(/\n\s*\n/).filter(Boolean);

  return (
    <main className="entry-page">
      <div className="section-wrap entry-page-content">
        <button className="back-link" onClick={() => navigate('/journey')}><ArrowLeft size={14} /> THE JOURNEY</button>
        <p className="eyebrow entry-page-meta">FIELD NOTES · ENTRY {entry.id} · {formatDate(entry.date)} · {entry.category.toUpperCase()}</p>
        <h1>{entry.title}</h1>
        <p className="page-lede">{entry.excerpt}</p>
        <PhotoFrame src={entry.cover} kind="entry-hero" alt={entry.cover ? entry.title : `Photograph to add for ${entry.title}`} />
        <div className="entry-body">
          <article className="prose">
            {paragraphs.length ? paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>) : <p>This field note is still being written. Check back when the observations are ready to share.</p>}
            <h2>What we are taking forward</h2>
            <p>Root Beans is a record of learning how to do things properly, one step at a time.</p>
          </article>
          <aside className="experiment-facts" aria-label="Experiment notes">
            <div><span>THE QUESTION</span><p>{entry.question || 'What did we want to find out?'}</p></div>
            <div><span>WHAT WE DID</span><p>{entry.did || 'The process will be recorded here.'}</p></div>
            <div><span>WHAT WE LEARNED</span><p>{entry.learned || 'Observations will be added when available.'}</p></div>
            <div><span>WHAT HAPPENS NEXT</span><p>{entry.next || 'The next step will follow from what we observe.'}</p></div>
          </aside>
        </div>
      </div>
      <nav className="entry-pagination" aria-label="Journal entry navigation">
        <div>{previous && <button onClick={() => navigate(`/journey/${previous.slug}`)}><span>PREVIOUS ENTRY</span><strong>← {previous.title}</strong></button>}</div>
        <button className="pagination-center" onClick={() => navigate('/journey')}>Back to all entries <ArrowUpRight size={14} /></button>
        <div>{next && <button className="next-entry" onClick={() => navigate(`/journey/${next.slug}`)}><span>NEXT ENTRY</span><strong>{next.title} →</strong></button>}</div>
      </nav>
    </main>
  );
}
