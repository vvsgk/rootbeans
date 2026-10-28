import { ArrowUpRight } from 'lucide-react';

export default function SiteFooter({ navigate }) {
  const go = (path) => navigate(path);
  return (
    <footer className="footer">
      <div className="section-wrap">
        <div className="footer-main">
          <div>
            <p className="eyebrow">ROOT BEANS · EST. 2026</p>
            <h2>Good things take root.</h2>
            <p>Two friends. Two beans. A journey worth growing.</p>
          </div>
          <div className="footer-links" aria-label="Footer navigation">
            <button onClick={() => go('/journey')}>Journey</button>
            <button onClick={() => go('/story')}>Our story</button>
            <button onClick={() => go('/#updates')}>Follow along</button>
            <button onClick={() => go('/admin')}>Journal dashboard <ArrowUpRight size={12} /></button>
          </div>
        </div>
        <div className="footer-bottom">
          <span>ROOTED IN FLAVOUR. BUILT WITH PATIENCE.</span>
          <span>MADE WITH CURIOSITY · INDIA</span>
        </div>
      </div>
    </footer>
  );
}
