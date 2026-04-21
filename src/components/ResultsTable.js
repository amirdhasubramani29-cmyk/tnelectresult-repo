'use client';
import { useMemo, useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { getElectionData, getPartyColor } from '@/data/elections';
import { ChevronLeft, ChevronRight, Search, Download } from 'lucide-react';
import { ELECTION_CONFIG } from "@/config/electionConfig";
import { transformData, getPartyDisplayName } from '@/utils/dataAdapter';

const PAGE_SIZE = 20;

export default function ResultsTable() {
  const { t, lang, year, search, setSearch, filterParty, sortBy, setSelectedConstituency } = useApp();
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [search, filterParty, sortBy, lang]);
  
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
  
  const all = useMemo(() => transformData(data, lang), [data, lang]);
  
  const filtered = useMemo(() => {
    let res = [...all];
    const q = search.toLowerCase().trim();
    if (q) res = res.filter(c =>
      (c.nameDisplay || '').toLowerCase().includes(q) ||
      (c.winner  || '').toLowerCase().includes(q) ||
      (c.party   || '').toLowerCase().includes(q) ||
      (c.districtDisplay || '').toLowerCase().includes(q)
    );
    if (filterParty !== 'All') {
      res = res.filter(c => c.party === filterParty);
    }
    res.sort((a, b) => {
      if (sortBy === 'margin') return b.margin - a.margin;
      if (sortBy === 'votes')  return (b.votes?.winner || 0) - (a.votes?.winner || 0);
      if (sortBy === 'winner') return (a.winner || '').localeCompare(b.winner || '');
      if (sortBy === 'party')  return (a.party  || '').localeCompare(b.party  || '');
      return a.id - b.id;
    });
    return res;
  }, [all, search, filterParty, sortBy]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const headers = [
    '#',
    t('Constituency', 'தொகுதி'),
    t('District', 'மாவட்டம்'),
    
	ELECTION_CONFIG[year]?.status == 'final' 
	? t('Winner', 'வெற்றியாளர்')
	: t('Leading', 'முன்னணி '),
	
    t('Party', 'கட்சி'),
    t('Votes', 'வாக்குகள்'),
    t('Runner-up Votes', 'இரண்டாம்'),
    t('Margin', 'இடைவெளி'),
  ];
  
  if (!data) return <div></div>;

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      {/* Table Header Bar */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
          {ELECTION_CONFIG[year]?.status == 'final' 
			  ? t('Constituency Results', 'தொகுதிவாரியான முடிவுகள்')
			  : t('Constituency Leading', 'தொகுதிவாரியான முன்னணி')
		  }
          <span style={{ marginLeft: '8px', fontSize: '13px', fontWeight: 400, color: 'var(--text-muted)' }}>
            ({filtered.length} {t('found', 'கண்டறிந்தது')})
          </span>
        </h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr className="table-head-row">
              {headers.map((h, i) => <th key={i}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {pageData.map((c, i) => {
              const partyColor = getPartyColor(c.party);
			  const partyName = getPartyDisplayName(c.party, lang);
              const margin = c.margin || 0;
              const marginColor = margin > 30000 ? '#22c55e' : margin > 10000 ? '#f59e0b' : '#ef4444';
              return (
                <tr
                  key={c.id}
                  className="result-row animate-fade-in"
                  style={{ animationDelay: `${i * 20}ms` }}
                  onClick={() => setSelectedConstituency(c)}
                >
                  <td style={{ padding: '11px 16px', fontSize: '12px', color: 'var(--text-muted)' }}>{c.id}</td>
                  <td style={{ padding: '11px 16px' }}>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                      {c.nameDisplay}
                    </div>                    
                  </td>
                  <td style={{ padding: '11px 16px', fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {c.districtDisplay}
                  </td>
                  <td style={{ padding: '11px 16px', fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{c.winner}</td>
                  <td style={{ padding: '11px 16px' }}>
                    {partyName && (<span className="badge" style={{ background: `${partyColor}20`, color: partyColor, border: `1px solid ${partyColor}50` }}>
                      {partyName}
                    </span>)}
                  </td>
                  <td style={{ padding: '11px 16px', fontSize: '13px', fontWeight: 700, color: partyColor }}>
                    {(c.winner_votes || 0).toLocaleString()}
                  </td>
                  <td style={{ padding: '11px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    {(c.runner_votes || 0).toLocaleString()}
                  </td>
                  <td style={{ padding: '11px 16px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: marginColor }}>
                      +{margin.toLocaleString()}
                    </span>
                  </td>
                </tr>
              );
            })}
            {pageData.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  {t('No results found', 'முடிவுகள் இல்லை')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {t('Page', 'பக்கம்')} {page} {t('of', 'இல்')} {totalPages}
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button className="btn btn-ghost" disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: '6px 10px' }}>
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              return (
                <button key={p} className={`btn ${p === page ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setPage(p)} style={{ padding: '6px 12px', minWidth: '36px' }}>
                  {p}
                </button>
              );
            })}
            <button className="btn btn-ghost" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: '6px 10px' }}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
