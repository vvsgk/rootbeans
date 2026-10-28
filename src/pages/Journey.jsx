import { BookOpen, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import JournalCard from '../components/JournalCard.jsx';
import CraftProgress from '../components/CraftProgress.jsx';
import CoffeeCacaoSection from '../sections/CoffeeCacaoSection.jsx';
import { CRAFT_STEPS, MILESTONES } from '../data/milestones.js';

const FILTERS = ['All entries', 'Growing', 'Coffee', 'Cacao', 'Experiments', 'Behind the scenes'];

export default function Journey({ entries, navigate }) {
  const [filter, setFilter] = useState('All entries');
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => entries.filter((entry) => {
    const matchesFilter = filter === 'All entries' || entry.category === filter;
    const text = `${entry.title} ${entry.excerpt} ${entry.category} ${entry.body}`.toLowerCase();
    return matchesFilter && text.includes(query.trim().toLowerCase());
  }), [entries, filter, query]);

  return (
    <main className="journey-page">
      <section className="page-hero section-wrap">
        <p className="eyebrow">FIELD JOURNAL · CHAPTER 01 · FROM 28 OCTOBER 2026</p>
        <h1>We are building Root<br />Beans, one experiment<br />at a time.</h1>
        <p className="page-lede">We don't have all the answers. That's precisely why we're documenting the journey: every seed planted, experiment, setback and discovery on the way to October 2028.</p>
      </section>

      <section className="now-band">
        <div className="section-wrap">
          <p className="eyebrow">RIGHT NOW · CURRENT WORK</p>
          <div className="now-grid">
            <div><span>GROWING</span><h3>Growing experiments</h3><p>Recording what is planted and how it develops.</p></div>
            <div><span>LEARNING</span><h3>Observation first</h3><p>Learning about growing conditions, varieties and care.</p></div>
            <div><span>TESTING</span><h3>One question at a time</h3><p>Keeping experiments small and observations honest.</p></div>
            <div><span>NEXT MILESTONE</span><h3>First growth notes</h3><p>Document the next real change when it happens.</p></div>
          </div>
        </div>
      </section>

      <CoffeeCacaoSection navigate={navigate} />

      <section className="section-wrap journey-craft-section">
        <div className="journey-section-heading">
          <p className="eyebrow">THE CRAFT AHEAD</p>
          <h2>Seven stages to understand.<br /><em>None to pretend.</em></h2>
          <p className="section-intro">The steps below are a learning map, not a claim of mastery. Only growing is marked as the current focus.</p>
        </div>
        <CraftProgress steps={CRAFT_STEPS} navigate={navigate} />
      </section>

      <section className="section-wrap timeline-section">
        <p className="eyebrow">A JOURNEY IN CHAPTERS</p>
        <h2>The story unfolds as we<br /><em>learn.</em></h2>
        <p className="section-intro">The October 2028 launch is a target, not a promise. The milestones depend on what we learn and the quality of the products.</p>
        <div className="timeline reveal">
          {MILESTONES.map((item, index) => (
            <article className="timeline-item" key={item.date}>
              <div className={`timeline-marker ${item.state === 'current' ? 'filled' : ''}`} aria-hidden="true" />
              <div className="timeline-heading">
                <p className="eyebrow">{item.date}</p>
                <h3>{item.title}</h3>
                <p className="timeline-sub">{index === 0 ? 'Where it began' : index === 1 ? 'Observation before assumption' : index === 2 ? 'Turning knowledge into trials' : 'The target, once we are ready'}</p>
              </div>
              <div className="timeline-description"><p>{item.description}</p>{index === 0 && <button className="inline-link" onClick={() => navigate('/journey/day-one-the-beginning')}>Read the first entry <span aria-hidden="true">↗</span></button>}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="journal-band archive-band">
        <div className="section-wrap">
          <div className="section-head">
            <div><p className="eyebrow">THE JOURNAL · NEWEST FIRST</p><h2>Every plant has something<br />to teach us.</h2></div>
            <span className="archive-count">{filtered.length} {filtered.length === 1 ? 'ENTRY' : 'ENTRIES'}</span>
          </div>
          <div className="filter-row" aria-label="Filter journal entries">
            {FILTERS.map((item) => <button className={filter === item ? 'filter active' : 'filter'} onClick={() => setFilter(item)} key={item}>{item}</button>)}
            <label className="search-box"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the journal" aria-label="Search the journal" /></label>
          </div>
          <div className="entry-grid">
            {filtered.map((entry, index) => <JournalCard key={entry.id} entry={entry} navigate={navigate} dark index={index} />)}
          </div>
          {!filtered.length && <div className="empty-state"><BookOpen size={24} /><h3>No entries found.</h3><p>Try another category or a different search.</p></div>}
        </div>
      </section>

      <section className="section-wrap archive-note">
        <p className="eyebrow">WHAT LIVES HERE</p>
        <h2>An ongoing record of the<br /><em>actual work.</em></h2>
        <div className="four-columns">
          {[['01', 'Growing log', 'Planting dates, photographs, growth observations and care.'], ['02', 'Experiments', 'What we tested, why, the result and what changes next.'], ['03', 'Field notes', 'Lessons from growers, farms, roasters and makers.'], ['04', 'Behind the scenes', 'Decisions, prototypes, setbacks and milestones.']].map(([number, title, description]) => <div key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></div>)}
        </div>
      </section>
    </main>
  );
}
