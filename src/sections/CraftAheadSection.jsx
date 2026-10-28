import { ArrowUpRight } from 'lucide-react';
import CraftProgress from '../components/CraftProgress.jsx';
import { CRAFT_STEPS } from '../data/milestones.js';

export default function CraftAheadSection({ navigate }) {
  return (
    <section className="section-wrap craft-section home-craft" aria-labelledby="craft-title">
      <div className="craft-intro">
        <p className="eyebrow">THE CRAFT AHEAD · RIGHT NOW</p>
        <h2 id="craft-title">Understanding the bean<br /><em>changes everything.</em></h2>
        <p>Coffee growing is where our experiments begin. Cacao is the next exploration. The rest is a path to learn, not a list of claims.</p>
        <button className="inline-link" onClick={() => navigate('/journey')}>Explore the full journey <ArrowUpRight size={14} /></button>
      </div>
      <CraftProgress steps={CRAFT_STEPS} navigate={navigate} />
    </section>
  );
}
