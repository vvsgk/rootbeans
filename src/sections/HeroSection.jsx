import { ArrowDownRight, ArrowRight } from 'lucide-react';
import { PhotoFrame } from '../components/JournalCard.jsx';

export default function HeroSection({ navigate }) {
  const scrollToFounders = () => document.getElementById('founders')?.scrollIntoView({ behavior: 'smooth' });
  return (
    <section className="hero section-wrap" aria-labelledby="home-title">
      <div className="hero-copy">
        <p className="eyebrow">A VISION TAKING ROOT · 2026–2028</p>
        <h1 id="home-title">Great flavour begins<br />long before the<br /><em>first sip</em></h1>
        <p className="hero-sub">Two friends. Two beans. A journey worth growing.</p>
        <div className="hero-actions">
          <button className="button-dark" onClick={() => navigate('/journey')}>
            Discover our journey <ArrowRight size={15} />
          </button>
          <button className="text-link" onClick={scrollToFounders}>
            Scroll to discover <ArrowDownRight size={15} />
          </button>
        </div>
      </div>
      <div className="hero-photo-frame" aria-label="Root Beans growing space">
        <PhotoFrame kind="hero" alt="Photograph to add: an early coffee seedling, soil and natural daylight" />
        <span className="hero-photo-caption">FIELD NOTES · 01 / THE BEGINNING</span>
      </div>
    </section>
  );
}
