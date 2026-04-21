'use client';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { useState, useEffect, useMemo } from 'react';
import { getElectionData, getPartySummary, getPartyColor } from '@/data/elections';
import { ArrowRight, BarChart2, MapPin, Globe, Zap } from 'lucide-react';
import { ELECTION_CONFIG } from "@/config/electionConfig";
import ElectionCard from "@/components/ElectionCard";

export default function HomePage() {
  const { t, theme, year, lang } = useApp();
  const [dataByYear, setDataByYear] = useState({});
  
  useEffect(() => {
	setDataByYear({});
    const unsubscribes = [];
   
    visibleYears.forEach((y) => {
      const unsubscribe = getElectionData(y, lang, (result) => {
        setDataByYear((prev) => ({
          ...prev,
          [y]: result,
        }));
      });

      unsubscribes.push(unsubscribe);
    });

    return () => {
      unsubscribes.forEach((fn) => fn && fn());
    };
  }, [lang]);
  
  const topPartiesByYear = useMemo(() => {
    const result = {};

    Object.entries(dataByYear).forEach(([year, data]) => {
      if (!data?.constituencies) {
        result[year] = [];
        return;
      }

      const summary = getPartySummary(data.constituencies);
      result[year] = summary.filter(p => p.party?.toLowerCase() !== "unknown").slice(0, 4);
    });

    return result;
  }, [dataByYear]);
  
  const visibleYears = Object.keys(ELECTION_CONFIG)
  .map(Number).filter((year) => ELECTION_CONFIG[year]?.enabled);

  return (
    <div style={{ minHeight: '80vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>

      {/* ── Hero Section ──────────────────────── */}
      <section style={{ padding: '40px 24px 40px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '20px', padding: '6px 16px', marginBottom: '24px', fontSize: '13px', color: '#3b82f6', fontWeight: 600 }}>
          <Zap size={14} /> {t('Election Data Platform', 'தேர்தல் தரவு தளம்')}
        </div>

        <h1 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 900, lineHeight: 1.15, marginBottom: '16px', color: 'var(--text-primary)' }}>
          {t('Tamil Nadu Election', 'தமிழ்நாடு தேர்தல்')}{' '}
          <span style={{ background: 'linear-gradient(135deg, rgb(59,130,246), rgb(139,92,246))', WebkitBackgroundClip: 'text', backgroundClip: 'text', 
			color: 'transparent', paddingBottom: '4px'  }}>
              {t('Results Dashboard', 'முடிவுகள் தளம்')}
          </span>
        </h1>

        <p style={{ fontSize: '17px', color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto 32px', lineHeight: 1.7 }}>
          {t(
            'Explore detailed election results, party-wise analysis, district maps, and constituency-level insights for Tamil Nadu 2021.',
            'தமிழ்நாடு 2021 தேர்தல் முடிவுகள், கட்சிவாரியான பகுப்பாய்வு, மாவட்ட வரைபடங்கள் மற்றும் தொகுதி அளவிலான நுண்ணறிவுகளை ஆராயுங்கள்.'
          )}
        </p>

        {/* Quick party tally */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '36px' }}>
          {(topPartiesByYear[2021] || []).map(({ party, seats }) => (
            <div key={party} style={{ background: 'var(--bg-card)', border: `2px solid ${getPartyColor(party)}40`, borderRadius: '14px', padding: '12px 20px', minWidth: '90px', textAlign: 'center', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ fontSize: '30px', fontWeight: 900, color: getPartyColor(party) }}>{seats}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>{party}</div>
            </div>
          ))}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '12px 20px', minWidth: '90px', textAlign: 'center' }}>
            <div style={{ fontSize: '30px', fontWeight: 900, color: 'var(--text-primary)' }}>234</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t('Total', 'மொத்தம்')}</div>
          </div>
        </div>

        <Link href="/tn/2021">
          <button className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '16px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            
			<span className="hide-mobile">
			  {t("View TN 2021 Results", "தமிழ்நாடு 2021 முடிவுகளைப் பார்க்க")}
             </span>

            <span className="hide-desktop">
              {t("View TN 2021 Results", "2021 முடிவுகள்")}
            </span>
			
            <ArrowRight size={18} />
          </button>
        </Link>
      </section>

      {/* ── Features Grid ────────────────────── */}
      <section style={{ padding: '20px 24px 60px', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '28px' }}>
          {t("What's inside", 'இதில் என்ன உள்ளது')}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px' }}>
          {[
            { icon: <BarChart2 size={22} color="#3b82f6" />, titleEn: 'Party Charts', titleTa: 'கட்சி வரைபடங்கள்', descEn: 'Pie & bar charts with seat distribution', descTa: 'இட விநியோகம் மற்றும் பட்டை வரைபடங்கள்' },
            { icon: <MapPin size={22} color="#22c55e" />, titleEn: 'District Map', titleTa: 'மாவட்ட வரைபடம்', descEn: 'Interactive TN map with district drill-down', descTa: 'ஊடாடும் வரைபடம் மற்றும் மாவட்ட பகுப்பு' },
            { icon: <Globe size={22} color="#8b5cf6" />, titleEn: 'Bilingual', titleTa: 'இரு மொழி ஆதரவு', descEn: 'Full Tamil & English language support', descTa: 'தமிழ் மற்றும் ஆங்கில மொழி ஆதரவு' },
            { icon: <Zap size={22} color="#f59e0b" />, titleEn: 'Insights', titleTa: 'நுண்ணறிவுகள்', descEn: 'Biggest wins, closest races & more', descTa: 'மிகப்பெரிய வெற்றிகள், நெருக்கமான போட்டிகள்' },
          ].map((f, i) => (
            <div key={i} className="card" style={{ padding: '20px' }}>
              <div style={{ marginBottom: '12px' }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '6px' }}>
                {lang === 'ta' ? f.titleTa : f.titleEn}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {lang === 'ta' ? f.descTa : f.descEn}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Elections Grid ────────────────────── */}
      <section style={{ padding: '0 24px 60px', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px' }}>
          🗳️ {t('Available Elections', 'கிடைக்கக்கூடிய தேர்தல்கள்')}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
			
			{visibleYears.map((year) => (
			  <ElectionCard
				key={year}
				year={year}
				topParties={topPartiesByYear[year] || []}
				t={t}
			  />
			))}

          {/* TN 2026 placeholder */}
          {ELECTION_CONFIG[2026]?.status == 'upcoming' && (
		  <div className="card" style={{ padding: '22px', opacity: 0.6, cursor: 'not-allowed', borderLeft: '4px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '24px' }}>🔮</span>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>{t('Tamil Nadu 2026', 'தமிழ்நாடு 2026')}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>⏳ {t('Coming Soon', 'விரைவில்')}</div>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {t('Next Assembly Election · Results not yet available', 'அடுத்த சட்டமன்றத் தேர்தல் · முடிவுகள் இன்னும் இல்லை')}
            </p>
          </div>)}
        </div>
      </section>
    </div>
  );
}