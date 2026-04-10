'use client';
import { useApp } from '@/context/AppContext';
import { useEffect } from 'react';
import { getPartyColor } from '@/data/elections';
import { SortAsc } from 'lucide-react';

// EN party keys that match the actual data
const EN_PARTIES = ['All', 'DMK', 'ADMK', 'INC', 'BJP', 'PMK', 'VCK', 'CPI', 'CPM'];
const TA_PARTIES = ['All', 'திமுக', 'அதிமுக', 'காங்கிரஸ்', 'பாஜக', 'பாமக', 'விசிக', 'கம்யூனிஸ்ட்', 'மார்க்சிஸ்ட்'];

export default function FilterBar() {
  const { t, lang, filterParty, setFilterParty, sortBy, setSortBy } = useApp();

  // Reset on lang change
  useEffect(() => { setFilterParty('All') }, [lang]);

  return (
    <div className="card" style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
      {/* Party Filter Buttons */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', flex: 1 }}>
		{lang === 'ta' ?
			TA_PARTIES.map(party => {
			  const color = getPartyColor(party);
			  const isActive = filterParty === party;
			  return (
				<button
				  key={party}
				  className="btn btn-ghost"
				  onClick={() => setFilterParty(party)}
				  style={isActive && party !== 'All'
					? { borderColor: color, color: color, background: `${color}20` }
					: isActive
					  ? { borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)', background: 'rgba(59,130,246,0.1)' }
					  : {}
				  }
				>
				  {party !== 'All' && (
					<span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, display: 'inline-block', marginRight: '4px' }} />
				  )}
				  {party == 'All' ? 'அனைத்து கட்சிகள்' : party}
				</button>
			  );
			})
			:
			EN_PARTIES.map(party => {
			  const color = getPartyColor(party);
			  const isActive = filterParty === party;
			  return (
				<button
				  key={party}
				  className="btn btn-ghost"
				  onClick={() => setFilterParty(party)}
				  style={isActive && party !== 'All'
					? { borderColor: color, color: color, background: `${color}20` }
					: isActive
					  ? { borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)', background: 'rgba(59,130,246,0.1)' }
					  : {}
				  }
				>
				  {party !== 'All' && (
					<span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, display: 'inline-block', marginRight: '4px' }} />
				  )}
				  {party}
				</button>
			  );
			})
		}
      </div>

      {/* Sort */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <SortAsc size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <select className="input" style={{ width: 'auto', minWidth: '160px' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="id">{t('Constituency #', 'தொகுதி #')}</option>
          <option value="margin">{t('Margin (High→Low)', 'இடைவெளி (அதிகம்→குறைவு)')}</option>
          <option value="votes">{t('Votes (High→Low)', 'வாக்குகள் (அதிகம்→குறைவு)')}</option>
          <option value="winner">{t('Winner A–Z', 'வெற்றியாளர் அ–ஆ')}</option>
          <option value="party">{t('Party A–Z', 'கட்சி அ–ஆ')}</option>
        </select>
      </div>
    </div>
  );
}
