import { ArrowUpRight } from 'lucide-react';
import { PhotoFrame } from '../components/JournalCard.jsx';

export default function OurStory({ navigate }) {
  return (
    <main>
      <section className="page-hero section-wrap">
        <p className="eyebrow">OUR STORY</p>
        <h1>We chose to begin<br /><em>at the beginning.</em></h1>
        <p className="page-lede">Two friends, a shared curiosity, and a decision to understand coffee and cacao before building a brand around them.</p>
      </section>
      <section className="band-cream story-band">
        <div className="section-wrap founders-grid">
          <PhotoFrame kind="founders" alt="Photograph to add: the founders learning together in their growing space" />
          <div className="story-copy">
            <p className="eyebrow">A SHARED CURIOSITY</p>
            <h2>Before the product,<br />the process.</h2>
            <p>Root Beans began with a question: what would happen if we learned the journey from the ground up?</p>
            <p>On 28 October 2026, we began growing beans at home. We are learning through observation, small experiments, conversations and the willingness to be beginners.</p>
            <p>Our target is to launch in October 2028. Until then, this site is our living record of what we do, what we learn and how our thinking changes.</p>
            <button className="inline-link" onClick={() => navigate('/journey')}>Follow the journey <ArrowUpRight size={14} /></button>
          </div>
        </div>
      </section>
      <section className="section-wrap manifesto">
        <p className="eyebrow">OUR PRINCIPLE</p>
        <h2>Good things take root.</h2>
        <p>We will share the process honestly. What we grow ourselves, what we source from others, what works, and what still needs work. We believe the origin of an ingredient deserves the same care as the thing made from it.</p>
      </section>
    </main>
  );
}
