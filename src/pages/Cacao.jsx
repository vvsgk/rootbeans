import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { PhotoFrame } from '../components/JournalCard.jsx';

export default function Cacao({ navigate }) {
  return (
    <main className="ingredient-page">
      <section className="page-hero section-wrap">
        <button className="back-link" onClick={() => navigate('/journey')}><ArrowLeft size={14} /> THE JOURNEY</button>
        <p className="eyebrow">JOURNEY CHAPTER · 02 · NEXT EXPLORATION</p>
        <h1>From pod<br />to <em>chocolate.</em></h1>
        <p className="page-lede">Cacao is the next part of our learning journey. It is a plan to explore, not something we are claiming to have started growing or making yet.</p>
      </section>
      <section className="section-wrap ingredient-feature-grid">
        <PhotoFrame kind="cacao" alt="Photograph to add later: cacao plant or pods when the exploration begins" />
        <div className="ingredient-feature-copy">
          <p className="eyebrow">WHAT COMES NEXT</p>
          <h2>Learn before we make.</h2>
          <p>As the coffee experiments develop, we plan to turn our attention to cacao. We want to understand the plant, the pod, the post-harvest processes and the craft involved in making chocolate.</p>
          <p>We will distinguish future cacao-growing experiments from any chocolate trials that may use sourced cacao. Ingredient origins will be stated plainly.</p>
          <div className="ingredient-status"><span>STATUS</span><strong>Next exploration · not yet underway</strong></div>
        </div>
      </section>
      <section className="now-band ingredient-process-band">
        <div className="section-wrap">
          <p className="eyebrow">A FUTURE LEARNING MAP</p>
          <div className="now-grid">
            <div><span>01 · TO RESEARCH</span><h3>Cultivation</h3><p>Climate, plant care and cacao-growing conditions.</p></div>
            <div><span>02 · TO LEARN</span><h3>Fermentation</h3><p>How controlled fermentation shapes flavour.</p></div>
            <div><span>03 · TO LEARN</span><h3>Drying and roasting</h3><p>Preparing beans for the next steps.</p></div>
            <div><span>04 · FUTURE TRIALS</span><h3>Chocolate-making</h3><p>Small-batch experiments when we are ready.</p></div>
          </div>
        </div>
      </section>
      <section className="section-wrap ingredient-next-step">
        <p className="eyebrow">NO CLAIMS BEFORE THE WORK</p>
        <h2>We will let the process<br /><em>write the story.</em></h2>
        <p className="section-intro">When we begin this chapter, the journal will record the actual experiments, observations, sources and lessons, including what does not work.</p>
        <button className="inline-link" onClick={() => navigate('/journey')}>Return to Journey <ArrowUpRight size={14} /></button>
      </section>
    </main>
  );
}
