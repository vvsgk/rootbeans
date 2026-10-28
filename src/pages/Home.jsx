import HeroSection from '../sections/HeroSection.jsx';
import CraftAheadSection from '../sections/CraftAheadSection.jsx';
import LivingJournalSection from '../sections/LivingJournalSection.jsx';
import HorizonSection from '../sections/HorizonSection.jsx';
import FoundersSection from '../sections/FoundersSection.jsx';

export default function Home({ entries, publishedCount, navigate }) {
  return (
    <main className="home-page">
      <HeroSection navigate={navigate} />
      <CraftAheadSection navigate={navigate} />
      <LivingJournalSection entries={entries} publishedCount={publishedCount} navigate={navigate} />
      <HorizonSection />
      <FoundersSection navigate={navigate} />
    </main>
  );
}
