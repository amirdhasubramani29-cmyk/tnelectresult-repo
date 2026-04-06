'use client';
import { useApp } from '@/context/AppContext';
import { electionsDataen, electionsDatata, getPartySummary, getPartyColor } from '@/data/elections';

export default function ResultsHeader() {
  const { t, lang } = useApp();
  const summary = lang == 'ta' ? getPartySummary(electionsDatata.constituencies): getPartySummary(electionsDataen.constituencies);
  
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
            🗳️ {t('Tamil Nadu Assembly Election 2021', 'தமிழ்நாடு சட்டமன்றத் தேர்தல் 2021')}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {t('Results for all 234 constituencies', '234 தொகுதிகளின் முடிவுகள்')}
            {' · '}
            <span style={{ color: '#22c55e', fontWeight: 600 }}>✓ {t('Final Results', 'இறுதி முடிவுகள்')}</span>
          </p>
        </div>

        {/* Party seat tallies */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {summary.map(({ party, seats }) => (
            <div key={party} style={{
              background: `${getPartyColor(party)}12`,
              border: `1px solid ${getPartyColor(party)}40`,
              borderRadius: '10px',
              padding: '6px 14px',
              textAlign: 'center',
              minWidth: '64px',
            }}>
              <div style={{ fontSize: '20px', fontWeight: 900, color: getPartyColor(party), lineHeight: 1.1 }}>{seats}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>{party}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}