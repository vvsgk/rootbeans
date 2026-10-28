import { useCallback, useEffect, useMemo, useState } from 'react';
import SiteHeader from './components/SiteHeader.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import Home from './pages/Home.jsx';
import OurStory from './pages/OurStory.jsx';
import Journey from './pages/Journey.jsx';
import Coffee from './pages/Coffee.jsx';
import Cacao from './pages/Cacao.jsx';
import JournalEntry from './pages/JournalEntry.jsx';
import JournalDashboard from './pages/admin/JournalDashboard.jsx';
import { getJournalEntries, getPublishedEntries, saveJournalEntries } from './data/journal.js';
import { ArrowLeft, Sprout } from 'lucide-react';

function NotFound({ navigate }) {
  return (
    <main className="not-found section-wrap">
      <Sprout size={28} strokeWidth={1} />
      <p className="eyebrow">NOT IN THIS JOURNAL</p>
      <h1>This page has<br /><em>not taken root.</em></h1>
      <p className="page-lede">The page may have moved, or its journal entry may still be a private draft.</p>
      <button className="button-dark" onClick={() => navigate('/journey')}><ArrowLeft size={14} /> Return to Journey</button>
    </main>
  );
}

export default function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const [entries, setEntries] = useState(() => getJournalEntries());
  const [toast, setToast] = useState('');

  const navigate = useCallback((target) => {
    const [path, hash = ''] = target.split('#');
    const nextPath = path || window.location.pathname;
    const nextUrl = `${nextPath}${hash ? `#${hash}` : ''}`;
    window.history.pushState({}, '', nextUrl);
    setPathname(nextPath);
    if (hash) {
      window.setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }
    const observer = new IntersectionObserver((items) => {
      items.forEach((item) => {
        if (item.isIntersecting) {
          item.target.classList.add('is-visible');
          observer.unobserve(item.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    document.querySelectorAll('.reveal:not(.is-visible)').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname, entries]);

  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || window.innerWidth < 850) return undefined;
    let frame = 0;
    const updateParallax = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const hero = document.querySelector('.hero-photo-frame');
        if (!hero) return;
        const rect = hero.getBoundingClientRect();
        const progress = Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight));
        root.style.setProperty('--hero-parallax', `${progress * -10}px`);
      });
    };
    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
    return () => {
      window.removeEventListener('scroll', updateParallax);
      cancelAnimationFrame(frame);
      root.style.removeProperty('--hero-parallax');
    };
  }, [pathname]);

  const notify = useCallback((message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 3000);
  }, []);

  const saveEntries = useCallback((nextEntries) => {
    const saved = saveJournalEntries(nextEntries);
    if (saved) setEntries(nextEntries);
    else notify('The browser could not store the changes. Export or copy the content before leaving.');
    return saved;
  }, [notify]);

  const publishedEntries = useMemo(() => getPublishedEntries(entries), [entries]);

  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');
  if (isAdmin) {
    return <>
      <JournalDashboard entries={entries} saveEntries={saveEntries} navigate={navigate} notify={notify} />
      {toast && <div className="toast" role="status">{toast}</div>}
    </>;
  }

  let page;
  if (pathname === '/') {
    page = <Home entries={publishedEntries.slice(0, 2)} publishedCount={publishedEntries.length} navigate={navigate} />;
  } else if (pathname === '/story') {
    page = <OurStory navigate={navigate} />;
  } else if (pathname === '/journey') {
    page = <Journey entries={publishedEntries} navigate={navigate} />;
  } else if (pathname === '/journey/coffee') {
    page = <Coffee navigate={navigate} />;
  } else if (pathname === '/journey/cacao') {
    page = <Cacao navigate={navigate} />;
  } else if (pathname.startsWith('/journey/')) {
    const slug = pathname.slice('/journey/'.length);
    const entry = publishedEntries.find((item) => item.slug === slug);
    page = entry ? <JournalEntry entry={entry} publishedEntries={publishedEntries} navigate={navigate} /> : <NotFound navigate={navigate} />;
  } else {
    page = <NotFound navigate={navigate} />;
  }

  return <>
    <SiteHeader navigate={navigate} pathname={pathname} />
    {page}
    <SiteFooter navigate={navigate} />
    {toast && <div className="toast" role="status">{toast}</div>}
  </>;
}
