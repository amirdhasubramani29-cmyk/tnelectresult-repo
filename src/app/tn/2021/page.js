'use client';
import { useApp } from '@/context/AppContext';
import ResultsHeader from '@/components/ResultsHeader';
import Dashboard from '@/components/Dashboard';
import FilterBar from '@/components/FilterBar';
import ResultsTable from '@/components/ResultsTable';
import ConstituencyModal from '@/components/ConstituencyModal';

const TICKER_EN = [
  '🏆 DMK-led alliance wins majority with 159 seats',
  '🗳️ DMK wins 133 seats · ADMK wins 66 seats',
  '🟢 M.K. Stalin sworn in as Chief Minister on May 7, 2021',
  '📊 BJP wins 4 seats · INC wins 18 seats · PMK wins 5 seats',
  '🗳️ Tamil Nadu voter turnout: 74.31%',
  '📍 234 constituencies · 38 districts',
];

const TICKER_TA = [
  '🏆 திமுக கூட்டணி 159 இடங்களுடன் பெரும்பான்மை',
  '🗳️ திமுக 133 இடங்கள் · அதிமுக 66 இடங்கள்',
  '🟢 மு.க.ஸ்டாலின் மே 7, 2021 முதல்வராக பதவியேற்பு',
  '📊 பாஜக 4 இடங்கள் · காங்கிரஸ் 18 இடங்கள் · பாமக 5 இடங்கள்',
  '🗳️ வாக்காளர் பங்கேற்பு: 74.31%',
  '📍 234 தொகுதிகள் · 38 மாவட்டங்கள்',
];

export default function TN2021Page() {
  const { t, lang } = useApp();
  const ticker = lang === 'ta' ? TICKER_TA : TICKER_EN;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>

      {/* Scrolling Ticker */}
      <div style={{ background: 'linear-gradient(90deg, #E31E24, #8b5cf6)', padding: '7px 0', overflow: 'hidden', display: 'flex' }}>
        <div className="ticker-scroll" style={{ display: 'flex', gap: '60px', whiteSpace: 'nowrap', willChange: 'transform' }}>
          {[...ticker, ...ticker].map((text, i) => (
            <span key={i} style={{ fontSize: '13px', color: 'white', fontWeight: 500, flexShrink: 0 }}>{text}</span>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <ResultsHeader />
        <Dashboard />
        <FilterBar />
        <ResultsTable />
      </main>

      <ConstituencyModal />
    </div>
  );
}
