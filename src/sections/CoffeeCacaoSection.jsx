import { ArrowUpRight } from 'lucide-react';
import { PhotoFrame } from '../components/JournalCard.jsx';

export default function CoffeeCacaoSection({ navigate, compact = false }) {
  return (
    <section className={`section-wrap journey-ingredients ${compact ? 'ingredients-compact' : ''}`} aria-labelledby="ingredients-title">
      <p className="eyebrow">THE INGREDIENTS · TWO BEGINNINGS</p>
      <h2 id="ingredients-title">From plant to product,<br /><em>one honest step at a time.</em></h2>
      <p className="section-intro">Coffee is our current growing experiment. Cacao is the next exploration. We will distinguish what we grow ourselves from ingredients we may source for future trials.</p>
      <div className="crop-detail-grid">
        <article className="crop-card reveal">
          <PhotoFrame kind="coffee" alt="Photograph to add: coffee seedlings, leaves or growing experiments" />
          <p className="eyebrow">01 · CURRENT FOCUS</p>
          <h2>From plant to roast.</h2>
          <p>We are documenting our home-growing experiments and learning about varieties, cultivation and care. Harvesting, processing, drying and roasting remain stages to study and explore.</p>
          <p className="small-note">Future small-batch roasting trials may use sourced coffee, with origin clearly shared.</p>
          <button className="inline-link" onClick={() => navigate('/journey/coffee')}>Explore the coffee chapter <ArrowUpRight size={14} /></button>
        </article>
        <article className="crop-card reveal" style={{ '--reveal-delay': '120ms' }}>
          <PhotoFrame kind="cacao" alt="Photograph to add: cacao plant, pod or cacao beans when this exploration begins" />
          <p className="eyebrow">02 · NEXT EXPLORATION</p>
          <h2>From pod to chocolate.</h2>
          <p>As we learn, we plan to turn our attention to cacao and explore cultivation, fermentation, drying, roasting and chocolate-making. These are future plans, not completed work.</p>
          <p className="small-note">Future chocolate experiments may use sourced cacao, with ingredient origins shared openly.</p>
          <button className="inline-link" onClick={() => navigate('/journey/cacao')}>Explore the cacao chapter <ArrowUpRight size={14} /></button>
        </article>
      </div>
    </section>
  );
}
