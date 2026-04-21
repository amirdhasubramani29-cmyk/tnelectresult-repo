'use client';
'use client';
import { useApp } from '@/context/AppContext';
import { useState, useEffect } from 'react';
import { useParams, notFound } from "next/navigation";
import ResultsHeader from '@/components/ResultsHeader';
import Dashboard from '@/components/Dashboard';
import FilterBar from '@/components/FilterBar';
import ResultsTable from '@/components/ResultsTable';
import ConstituencyModal from '@/components/ConstituencyModal';
import { ELECTION_CONFIG } from "@/config/electionConfig";
import { subscribeTicker2026, getTickerData } from "@/services/tickerService";

export default function TNPage() {
  const { t, lang, year: currentYear, setYear } = useApp();
  const params = useParams();
  const routeYear = Number(params?.year);
  
  useEffect(() => {
    if (routeYear) {
      setYear(routeYear);
    }
  }, [routeYear]);
  
  const config = ELECTION_CONFIG[routeYear];
  if (!config?.enabled) {
    notFound();
  }
  
  const [tickerData, setTickerData] = useState({ en: [], ta: [] });
  useEffect(() => {
   if (!currentYear) return;
    // 2026 → real-time
    if (Number(currentYear) === 2026) {
      const unsubscribe = subscribeTicker2026(setTickerData);
      return () => unsubscribe(); // cleanup
    }
    // other years → static
    getTickerData(currentYear).then(setTickerData);
  }, [currentYear]);

  const ticker = tickerData[lang] || tickerData.en || [];
 
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
