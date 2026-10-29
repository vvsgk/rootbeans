
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

import {
  getJournalEntries,
  getPublishedEntries,
  saveJournalEntries,
} from './data/journal.js';

import { ArrowLeft, Sprout } from 'lucide-react';

/*
 * BASE_PATH is "/rootbeans" on GitHub Pages.
 * It is empty when Vite's base URL is "/".
 *
 * Keep application routes separate from browser URLs:
 * Application route: /journey
 * Browser URL:       /rootbeans/journey
 */
const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '');

function normalizeAppPath(path) {
  if (!path) return '/';

  return path.startsWith('/') ? path : `/${path}`;
}

function toBrowserPath(appPath) {
  const path = normalizeAppPath(appPath);

  if (!BASE_PATH) {
    return path;
  }

  return path === '/'
      ? `${BASE_PATH}/`
      : `${BASE_PATH}${path}`;
}

/*
 * GitHub Pages serves 404.html for routes that it does not
 * recognize. That file redirects back to the app with a
 * "?p=/journey" parameter. Restore the intended route here.
 */
function getAppPath() {
  const params = new URLSearchParams(window.location.search);
  const redirectedPath = params.get('p');

  if (redirectedPath) {
    const path = normalizeAppPath(redirectedPath);

    window.history.replaceState(
        {},
        '',
        `${toBrowserPath(path)}${window.location.hash}`
    );

    return path;
  }

  const currentPath = window.location.pathname;

  if (
      BASE_PATH &&
      (
          currentPath === BASE_PATH ||
          currentPath.startsWith(`${BASE_PATH}/`)
      )
  ) {
    return currentPath.slice(BASE_PATH.length) || '/';
  }

  return normalizeAppPath(currentPath);
}

function NotFound({ navigate }) {
  return (
    <main className="not-found section-wrap">
      <Sprout size={28} strokeWidth={1} />

      <p className="eyebrow">PAGE NOT FOUND</p>

      <h1>
        No roots found.
        <br />
        <em>We're still growing.</em>
      </h1>

      <p className="page-lede">
        We're on our way to building this part of Root Beans.
        In the meantime, explore what's taking root on our Journey page.
      </p>

      <button
        className="button-dark"
        onClick={() => navigate('/journey')}
      >
        <ArrowLeft size={14} />
        Go to Journey
      </button>
    </main>
  );
}

export default function App() {
  const [pathname, setPathname] = useState(() => getAppPath());
  const [entries, setEntries] = useState(() => getJournalEntries());
  const [toast, setToast] = useState('');

  /*
   * Internal navigation always works with application routes.
   * The repository prefix is added only to the browser URL.
   */
  const navigate = useCallback((target) => {
    const [requestedPath = '', hash = ''] = target.split('#');

    const nextPath = normalizeAppPath(
        requestedPath || pathname
    );

    const nextUrl =
        `${toBrowserPath(nextPath)}` +
        `${hash ? `#${hash}` : ''}`;

    window.history.pushState({}, '', nextUrl);
    setPathname(nextPath);

    if (hash) {
      window.setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 80);
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [pathname]);

  /*
   * Browser back/forward navigation must also remove the
   * repository prefix before matching application routes.
   */
  useEffect(() => {
    const handlePopState = () => {
      setPathname(getAppPath());

      window.scrollTo({
        top: 0,
        behavior: 'auto',
      });
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  /*
   * Reveal animated content when it enters the viewport.
   * Respect the visitor's reduced-motion preference.
   */
  useEffect(() => {
    const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    if (
        reducedMotion ||
        !('IntersectionObserver' in window)
    ) {
      document.querySelectorAll('.reveal').forEach((element) => {
        element.classList.add('is-visible');
      });

      return undefined;
    }

    const observer = new IntersectionObserver(
        (items) => {
          items.forEach((item) => {
            if (item.isIntersecting) {
              item.target.classList.add('is-visible');
              observer.unobserve(item.target);
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: '0px 0px -35px 0px',
        }
    );

    document
        .querySelectorAll('.reveal:not(.is-visible)')
        .forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [pathname, entries]);

  /*
   * Restrained desktop-only hero parallax.
   */
  useEffect(() => {
    const root = document.documentElement;

    const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reducedMotion || window.innerWidth < 850) {
      return undefined;
    }

    let frame = 0;

    const updateParallax = () => {
      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        const hero = document.querySelector('.hero-photo-frame');

        if (!hero) return;

        const rect = hero.getBoundingClientRect();

        const progress = Math.max(
            -1,
            Math.min(
                1,
                (
                    rect.top +
                    rect.height / 2 -
                    window.innerHeight / 2
                ) / window.innerHeight
            )
        );

        root.style.setProperty(
            '--hero-parallax',
            `${progress * -10}px`
        );
      });
    };

    window.addEventListener('scroll', updateParallax, {
      passive: true,
    });

    updateParallax();

    return () => {
      window.removeEventListener('scroll', updateParallax);
      cancelAnimationFrame(frame);
      root.style.removeProperty('--hero-parallax');
    };
  }, [pathname]);

  const notify = useCallback((message) => {
    setToast(message);

    window.setTimeout(() => {
      setToast('');
    }, 3000);
  }, []);

  /*
   * Persist journal entries using the existing storage layer.
   */
  const saveEntries = useCallback((nextEntries) => {
    const saved = saveJournalEntries(nextEntries);

    if (saved) {
      setEntries(nextEntries);
    } else {
      notify(
          'The browser could not store the changes. ' +
          'Export or copy the content before leaving.'
      );
    }

    return saved;
  }, [notify]);

  const publishedEntries = useMemo(
      () => getPublishedEntries(entries),
      [entries]
  );

  /*
   * Local journal dashboard.
   * This remains browser-local and is not a secure,
   * shared authentication system.
   */
  const isAdmin =
      pathname === '/admin' ||
      pathname.startsWith('/admin/');

  if (isAdmin) {
    return (
        <>
          <JournalDashboard
              entries={entries}
              saveEntries={saveEntries}
              navigate={navigate}
              notify={notify}
          />

          {toast && (
              <div className="toast" role="status">
                {toast}
              </div>
          )}
        </>
    );
  }

  /*
   * Public routes use application paths, without "/rootbeans".
   */
  let page;

  if (pathname === '/') {
    page = (
        <Home
            entries={publishedEntries.slice(0, 2)}
            publishedCount={publishedEntries.length}
            navigate={navigate}
        />
    );
  } else if (pathname === '/story') {
    page = <OurStory navigate={navigate} />;
  } else if (pathname === '/journey') {
    page = (
        <Journey
            entries={publishedEntries}
            navigate={navigate}
        />
    );
  } else if (pathname === '/journey/coffee') {
    page = <Coffee navigate={navigate} />;
  } else if (pathname === '/journey/cacao') {
    page = <Cacao navigate={navigate} />;
  } else if (pathname.startsWith('/journey/')) {
    const slug = pathname.slice('/journey/'.length);

    const entry = publishedEntries.find(
        (item) => item.slug === slug
    );

    page = entry ? (
        <JournalEntry
            entry={entry}
            publishedEntries={publishedEntries}
            navigate={navigate}
        />
    ) : (
        <NotFound navigate={navigate} />
    );
  } else {
    page = <NotFound navigate={navigate} />;
  }

  return (
      <>
        <SiteHeader
            navigate={navigate}
            pathname={pathname}
        />

        {page}

        <SiteFooter navigate={navigate} />

        {toast && (
            <div className="toast" role="status">
              {toast}
            </div>
        )}
      </>
  );
}
