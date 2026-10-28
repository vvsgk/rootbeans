import { ArrowRight, ArrowUpRight } from 'lucide-react';
import JournalCard from '../components/JournalCard.jsx';

export default function LivingJournalSection({ entries = [], publishedCount = 0, navigate }) {
  const latest = entries.slice(0, 2);
  return (
    <section className="journal-band" aria-labelledby="living-journal-title">
      <div className="section-wrap">
        <div className="section-head reveal">
          <div>
            <p className="eyebrow">THE LIVING JOURNAL</p>
            <h2 id="living-journal-title">Every plant has something<br />to teach us.</h2>
          </div>
          <button className="light-link" onClick={() => navigate('/journey')}>All journal entries <ArrowUpRight size={14} /></button>
        </div>
        <div className="entry-grid">
          {latest.length ? latest.map((entry, index) => (
            <JournalCard key={entry.id} entry={entry} navigate={navigate} dark index={index} />
          )) : (
            <div className="empty-state"><p>Our first field notes are on their way.</p></div>
          )}
        </div>
        <div className="journal-bottom">
          <span>{publishedCount} {publishedCount === 1 ? 'ENTRY' : 'ENTRIES'} DOCUMENTED</span>
          <button className="light-link" onClick={() => navigate('/journey')}>Explore the full journey <ArrowRight size={14} /></button>
        </div>
      </div>
    </section>
  );
}
