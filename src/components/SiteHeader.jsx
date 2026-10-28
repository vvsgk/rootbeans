import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function SiteHeader({ navigate, pathname = '/' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const go = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="header">
      <button className="wordmark" onClick={() => go('/')} aria-label="Root Beans home">
        ROOT BEANS<span className="wordmark-dot">.</span>
      </button>
      <button
        className="menu-toggle"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={21} /> : <Menu size={21} />}
      </button>
      <nav className={`nav ${menuOpen ? 'nav-open' : ''}`} aria-label="Main navigation">
        <button className={pathname === '/' ? 'nav-current' : ''} onClick={() => go('/')}>Home</button>
        <button className={pathname === '/story' ? 'nav-current' : ''} onClick={() => go('/story')}>Our story</button>
        <button className={pathname.startsWith('/journey') ? 'nav-current' : ''} onClick={() => go('/journey')}>Journey</button>
        <button className="nav-follow" onClick={() => go('/#updates')}>
          Follow along <ArrowUpRight size={13} />
        </button>
      </nav>
    </header>
  );
}
