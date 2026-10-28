import { ArrowUpRight } from 'lucide-react';
import { PhotoFrame } from '../components/JournalCard.jsx';

export default function FoundersSection({ navigate, standalone = false }) {
  return (
    <section className={`founders band-cream ${standalone ? 'founders-standalone' : ''}`} id="founders">
      <div className="section-wrap founders-grid">
        <PhotoFrame kind="founders" alt="Photograph to add: the two founders working in their growing space, honest and unposed" />
        <div className="story-copy">
          <p className="eyebrow">{standalone ? 'OUR STORY' : 'THE FOUNDERS'}</p>
          <h2>We chose to begin<br />at the beginning.</h2>
          <p>Every great cup of coffee begins long before the beans reach a roaster. Every piece of chocolate begins long before the first taste. It begins with a plant, a little patience, and a thousand small decisions.</p>
          <p>Root Beans began with two friends and a shared curiosity about these beginnings. On 28 October 2026, we started growing beans at home, learning through observation, experimentation and the occasional mistake. We are giving ourselves two years to learn before we launch.</p>
          <div className="founder-names">[FOUNDER 1] &amp; [FOUNDER 2]</div>
          <button className="inline-link" onClick={() => navigate('/journey/day-one-the-beginning')}>Read the first entry <ArrowUpRight size={14} /></button>
        </div>
      </div>
    </section>
  );
}
