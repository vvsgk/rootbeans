import { ArrowUpRight, Sprout } from 'lucide-react';
import { formatDate } from '../data/journal.js';

export function PhotoFrame({ src, alt, kind = 'seed', className = '' }) {
  return (
    <div className={`photo photo-${kind} ${className}`.trim()}>
      {src ? (
        <img src={src} alt={alt || 'Root Beans field journal photograph'} loading="lazy" />
      ) : (
        <div className="photo-placeholder" role="img" aria-label={alt || 'Photograph to be added'}>
          <Sprout size={30} strokeWidth={1} aria-hidden="true" />
          <span>{alt || 'Photograph to be added'}</span>
        </div>
      )}
    </div>
  );
}

export default function JournalCard({ entry, navigate, dark = false, index = 0 }) {
  const open = () => navigate(`/journey/${entry.slug}`);
  return (
    <article className={`entry-card ${dark ? 'entry-card-dark' : ''} reveal`} style={{ '--reveal-delay': `${index * 100}ms` }}>
      <button className="entry-cover" onClick={open} aria-label={`Read ${entry.title}`}>
        <PhotoFrame src={entry.cover} kind="card" alt={entry.cover ? entry.title : `Photograph placeholder for ${entry.title}`} />
        <span className="cover-index">{entry.id}</span>
      </button>
      <p className="entry-meta">ENTRY {entry.id} · {formatDate(entry.date)} · {entry.category.toUpperCase()}</p>
      <button className="entry-title" onClick={open}>
        <span>{entry.title}</span><ArrowUpRight size={16} aria-hidden="true" />
      </button>
      <p className="entry-excerpt">{entry.excerpt}</p>
    </article>
  );
}
