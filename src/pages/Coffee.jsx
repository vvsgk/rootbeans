import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { PhotoFrame } from '../components/JournalCard.jsx';

export default function Coffee({ navigate }) {
  return (
    <main className="ingredient-page">
      <section className="page-hero section-wrap">
        <button className="back-link" onClick={() => navigate('/journey')}><ArrowLeft size={14} /> THE JOURNEY</button>
        <p className="eyebrow">JOURNEY CHAPTER · 01 · CURRENT FOCUS</p>
        <h1>From plant<br />to <em>roast.</em></h1>
        <p className="page-lede">Coffee is where our hands-on experiments begin. We are learning to grow first, observe carefully and document the questions that arise along the way.</p>
      </section>
      <section className="section-wrap ingredient-feature-grid">
        <PhotoFrame kind="coffee" alt="Photograph to add: the actual coffee varieties growing at home" />
        <div className="ingredient-feature-copy">
          <p className="eyebrow">WHAT IS HAPPENING NOW</p>
          <h2>Start with the plant.</h2>
          <p>We are experimenting with different coffee varieties at home. The important work right now is recording what we planted, the conditions we provide, how the plants respond and what we need to learn next.</p>
          <p>We are not claiming to have reached harvesting, processing or roasting. Those are future stages we will research and explore as the work develops.</p>
          <div className="ingredient-status"><span>STATUS</span><strong>Current growing experiments</strong></div>
        </div>
      </section>
      <section className="now-band ingredient-process-band">
        <div className="section-wrap">
          <p className="eyebrow">WHAT WE PLAN TO LEARN</p>
          <div className="now-grid">
            <div><span>01 · NOW</span><h3>Growing</h3><p>Varieties, light, water, soil and observation.</p></div>
            <div><span>02 · LATER</span><h3>Harvesting</h3><p>When cherries are ready and what maturity means.</p></div>
            <div><span>03 · LATER</span><h3>Processing</h3><p>Research into processing, fermentation and drying.</p></div>
            <div><span>04 · FUTURE</span><h3>Roasting</h3><p>Small-batch trials, with sourced origins disclosed if needed.</p></div>
          </div>
        </div>
      </section>
      <section className="section-wrap ingredient-next-step">
        <p className="eyebrow">KEEP THE RECORD HONEST</p>
        <h2>Every observation<br /><em>belongs in the journal.</em></h2>
        <p className="section-intro">We will add growing notes when something genuinely changes, not manufacture updates for the sake of a schedule.</p>
        <button className="inline-link" onClick={() => navigate('/journey')}>Return to Journey <ArrowUpRight size={14} /></button>
      </section>
    </main>
  );
}
