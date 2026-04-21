'use client';
import { useApp } from '@/context/AppContext';
import { useState, useEffect } from 'react';
import { getElectionData, getPartySummary, getPartyColor } from '@/data/elections';
import { getPartyDisplayName } from '@/utils/dataAdapter';
import { ELECTION_CONFIG } from "@/config/electionConfig";

export default function ResultsHeader() {
  
  const { t, lang, year } = useApp();
  const [data, setData] = useState(null);
  const status = ELECTION_CONFIG[year]?.status;

  useEffect(() => {
    const unsubscribe = getElectionData(year, lang, (result) => {
      setData(result);
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [year, lang]);

  if (!data) return null;

  const summary = getPartySummary(data.constituencies);
  
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      padding: '18px 24px',
    }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>

        {/* Title */}
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
            🗳️ {t(`Tamil Nadu Assembly Election ${year}`, `தமிழ்நாடு சட்டமன்றத் தேர்தல் ${year}`)}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {t('Results for all 234 constituencies', '234 தொகுதிகளின் முடிவுகள்')}
            {' · '}
            <span style={{ color: '#22c55e', fontWeight: 600 }}>  
				✓ {status === "final" 
				? t("Results Available", "முடிவுகள் கிடைக்கின்றன")
				: t("Results in Progress", "முடிவுகள் நடைபெற்று வருகின்றன")}
				</span>
          </p>
        </div>

        {/* Party seat tallies */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {summary
		    .filter(({ party }) => party?.toLowerCase() !== "unknown")
		    .map(({ party, seats }) => (
            <div key={party} style={{
              background: `${getPartyColor(party)}12`,
              border: `1px solid ${getPartyColor(party)}40`,
              borderRadius: '10px',
              padding: '6px 14px',
              textAlign: 'center',
              minWidth: '64px',
            }}>
              <div style={{ fontSize: '20px', fontWeight: 900, color: getPartyColor(party), lineHeight: 1.1 }}>{seats}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>{getPartyDisplayName(party, lang)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}