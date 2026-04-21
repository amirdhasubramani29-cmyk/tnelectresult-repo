'use client';

import { useApp } from '@/context/AppContext';
import { useState, useEffect, useMemo } from 'react';

import {
  getElectionData,
  getPartySummary,
  getPartyColor,
  getInsights,
  getPartyName
} from '@/data/elections';

import TamilNaduMap from '@/components/TamilNaduMap';

import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

import {
  transformData,
  buildDistrictMap,
  getPartyDisplayName
} from '@/utils/dataAdapter';

import {
  groupByDistrict,
  getDistrictPartyMap,
  normalize
} from '@/utils/mapUtils';

import { Trophy, Swords, MapPin, TrendingUp, Users } from 'lucide-react';

import { ELECTION_CONFIG } from "@/config/electionConfig";

export default function Dashboard() {
  const { t, lang, year } = useApp();
  const [data, setData] = useState(null);

  useEffect(() => {
	setData(null);
    const unsubscribe = getElectionData(year, lang, (result) => {
      setData(result);
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [year, lang]);
  
  const [selectedDistrict, setSelectedDistrict] = useState(lang === 'ta' ? 'சென்னை' : 'chennai');
 
  useEffect(() => {
    setSelectedDistrict(lang === 'ta' ? 'சென்னை' : 'chennai');
  }, [lang]);
  
  const { mapData, grouped, districtPartyMap, districtDisplayLookup, partyDisplayLookup } = useMemo(() => {
    if (!data) {
      return {
        mapData: [],
        grouped: {},
        districtPartyMap: {},
        districtDisplayLookup: {},
        partyDisplayLookup: {},
      };
    }

    const mapData = transformData(data, lang);
    //console.log(data.constituencies[0].district_en + ' ' + data.constituencies[0].district_ta);
    const grouped = groupByDistrict(mapData);
	//console.log('grouped data by ' + lang + ' key: ' + mapData[0].districtKey + ' display: ' + mapData[0].districtDisplay);
    const districtPartyMap = getDistrictPartyMap(mapData);

    const districtDisplayLookup = {};
    const partyDisplayLookup = {};

    mapData.forEach((item) => {
      districtDisplayLookup[item.districtKey] = item.districtDisplay;
      partyDisplayLookup[item.party] = item.partyDisplay;
	  //console.log(item.districtKey);
	  //console.log(item.districtDisplay);
	  //console.log(item);
    });

    return {
      mapData,
      grouped,
      districtPartyMap,
      districtDisplayLookup,
      partyDisplayLookup,
    };
  }, [data, lang]);
  
  const allDistricts = useMemo(() => {
    if (!grouped) return [];
    return Object.keys(grouped).sort();
  }, [grouped]);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const party = payload?.[0]?.name !== "seats" ? payload?.[0]?.name : payload?.[0]?.payload?.party;
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 14px' }}>
        <p style={{ fontWeight: 700, color: getPartyColor(party) }}>{getPartyDisplayName(party, lang)}</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{payload[0].value} {t('seats', 'இடங்கள்')}</p>
      </div>
    );
  };
  
  if (!data) return <div style={{ padding: 20 }}>Loading ...</div>;

  const summary = data ? getPartySummary(data.constituencies) : [];
  const insights = data ? getInsights(data) : {};
  
  const filteredSummary = summary.filter(
    entry => entry.party?.toLowerCase() !== "unknown"
   );

  const dmkAllianceSeats = summary
    .filter(p =>
      ['DMK', 'INC', 'VCK', 'CPI', 'CPM', 'திமுக', 'காங்', 'விசிக', 'சிபிஎம்', 'சிபிஐ'].includes(p.party)
    )
    .reduce((s, p) => s + p.seats, 0);
	
  const admkAllianceSeats = summary
    .filter(p =>
      ['ADMK', 'BJP', 'PMK', 'AMMK', 'அதிமுக', 'பாஜக', 'பாமக', 'அமமுக'].includes(p.party)
    )
    .reduce((s, p) => s + p.seats, 0);

  return (
    <div style={{ display: 'grid', gap: '24px' }}>

      {/* ── Coalition Banner ────────────────── */}
      
        {ELECTION_CONFIG[year]?.status == 'final' && ( 
		  <>
		  <div style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(59,130,246,0.12))', border: '1px solid rgba(34,197,94,0.35)', borderRadius: '16px', padding: '20px 24px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
				<div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>🏆 {t('Winning Coalition', 'வெற்றி கூட்டணி')}</div>
				<div style={{ fontSize: '22px', fontWeight: 800, color: '#22c55e' }}>
					{summary?.[0]?.party} {t(' Alliance', ' கூட்டணி')} — {dmkAllianceSeats > admkAllianceSeats ? dmkAllianceSeats : admkAllianceSeats} {t('Seats', 'இடங்கள்')}
				</div>
				<div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
				  {t('Majority mark: 118 of 234 seats', 'பெரும்பான்மை நிலை: 234 இல் 118 இடங்கள்')}
				</div>
			  </div>
			  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
				<StatCard label={t('Total Seats', 'மொத்த இடங்கள்')} value={234} color="var(--accent-blue)" />
				<StatCard label={t('Majority Mark', 'பெரும்பான்மை')} value={118} color="#4B5563" />
				<StatCard label={summary?.[0]?.party} value={summary?.[0]?.seats} 
				  color={getPartyColor(summary?.[0]?.party)} />
				<StatCard label={`${summary?.[0]?.party} ${t("Alliance", "கூட்டணி")}`} 
				  value={dmkAllianceSeats > admkAllianceSeats ? dmkAllianceSeats : admkAllianceSeats} 
				  color={getPartyColor(summary?.[0]?.party)} />
			  </div>
            </div>
           </div>
		  </>
		)}
			
        {ELECTION_CONFIG[year]?.status == 'progress' && (
		  <>
		  <div style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(59,130,246,0.12))', border: '1px solid rgba(34,197,94,0.35)', borderRadius: '16px', padding: '20px 24px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
				<div style={{ fontSize: '22px', fontWeight: 800, color: '#22c55e' }}>
					🏆 {t('Election Leading Results', 'தேர்தல் முன்னணி நிலவரம்')}
				</div>
			  </div>
			<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
			  <StatCard label={t('Total Seats', 'மொத்த இடங்கள்')} value={234} color="var(--accent-blue)" />
              <StatCard label={t('Majority Mark', 'பெரும்பான்மை')} value={118} color="#4B5563" />
              {(dmkAllianceSeats > 0 || admkAllianceSeats > 0) && (
			  <>
			  
			  {summary?.[0]?.party?.toLowerCase() !== "unknown" && (
			    <>
			    <StatCard label={summary?.[0]?.party} 
				  value={summary?.[0]?.seats} color="#E31E24" />
                <StatCard label={`${summary?.[0]?.party} ${t("Alliance", "கூட்டணி")}`} 
				  value={dmkAllianceSeats > admkAllianceSeats ? dmkAllianceSeats : admkAllianceSeats} color="#22c55e" />
				</>
			  )}
              <StatCard label={getPartyDisplayName(summary?.[1]?.party, lang)} 
			    value={summary?.[1]?.seats} 
				color={getPartyColor(summary?.[1]?.party)} />
			  <StatCard label={`${getPartyDisplayName(summary?.[1]?.party, lang)} ${t("Alliance", "கூட்டணி")}`} 
			    value={dmkAllianceSeats > admkAllianceSeats ? admkAllianceSeats : dmkAllianceSeats} 
			    color={getPartyColor(summary?.[1]?.party)} />
				
			  {summary?.[0]?.party?.toLowerCase() === "unknown" && (
			    <>
			     <StatCard label={getPartyDisplayName(summary?.[2]?.party, lang)} 
				   value={summary?.[2]?.seats} 
				   color={getPartyColor(summary?.[2]?.party)} />
			     <StatCard label={`${getPartyDisplayName(summary?.[2]?.party, lang)} ${t("Alliance", "கூட்டணி")}`}
                   value={dmkAllianceSeats > admkAllianceSeats ? admkAllianceSeats : dmkAllianceSeats }
                   color={getPartyColor(summary?.[2]?.party)} />
				</>
			   )}
			  </>
			  )}
			</div>
            </div>
           </div>
		  </>
	    )}

      {/* ── Charts Row ──────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '20px' }}>

        {/* Pie Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>
            {t('Party-wise Seat Distribution', 'கட்சிவாரியான இட விநியோகம்')}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={filteredSummary} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2} dataKey="seats" nameKey="party">
                {filteredSummary
				  .map((entry, i) => <Cell key={i} fill={getPartyColor(entry.party)} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={v => <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{getPartyDisplayName(v, lang)}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>
            {ELECTION_CONFIG[year]?.status == 'final' 
			  ? t('Seats Won by Party', 'கட்சிவாரியான வெற்றி')
			  : t('Seats Leading by Party', 'கட்சிவாரியான முன்னணி')
			}
          </h3>
          <ResponsiveContainer width="100%" height={230}>
			<BarChart data={filteredSummary} margin={{ left: -15 }}>
			  <XAxis dataKey="party" tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                tickFormatter={(party) => getPartyDisplayName(party, lang)} />
			  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
			  <Tooltip content={<CustomTooltip />} />

			  <Bar dataKey="seats" radius={[6, 6, 0, 0]}>
				{filteredSummary.map((entry, i) => (
				  <Cell key={i} fill={getPartyColor(entry.party)} />
				))}
			  </Bar>
			</BarChart>
          </ResponsiveContainer>
        </div>

        {/* Majority Progress */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>
            {t('Majority Progress', 'பெரும்பான்மை முன்னேற்றம்')}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {summary
			  .filter(entry => entry.party?.toLowerCase() !== "unknown")
			  .slice(0, 5).map(({ party, seats }) => (
              <div key={party}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: getPartyColor(party) }}>{getPartyDisplayName(party, lang)}</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{seats} / 234</span>
                </div>
                <div className="progress-track">
                  <div className="progress-bar" style={{ width: `${(seats / 234) * 100}%`, background: getPartyColor(party) }} />
                </div>
                {ELECTION_CONFIG[year]?.status == 'final' && seats >= 118 && (
                  <div style={{ fontSize: '11px', color: '#22c55e', marginTop: '3px' }}>✓ {t('Majority achieved', 'பெரும்பான்மை பெற்றது')}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Insights Row ────────────────────── */}
	  {ELECTION_CONFIG[year]?.status == 'final' && (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <InsightCard
          icon={<Trophy size={20} color="#f59e0b" />}
          title={t('Biggest Victory', 'மிகப்பெரிய வெற்றி')}
          body={`${insights.biggestWin?.winner} (${insights.biggestWin?.party})`}
          sub={`${insights.biggestWin?.name_en} — +${insights.biggestWin?.margin?.toLocaleString()}`}
          accent="#f59e0b"
        />
        <InsightCard
          icon={<Swords size={20} color="#ef4444" />}
          title={t('Closest Contest', 'மிக நெருக்கமான போட்டி')}
          body={`${insights.closestRace?.winner} (${insights.closestRace?.party})`}
          sub={`${insights.closestRace?.name_en} — +${insights.closestRace?.margin?.toLocaleString()}`}
          accent="#ef4444"
        />
        <InsightCard
          icon={<TrendingUp size={20} color="#22c55e" />}
          title={t('Top Party', 'முன்னணி கட்சி')}
          body={`${insights.topParty?.party} — ${insights.topParty?.seats} ${t('seats', 'இடங்கள்')}`}
          sub={getPartyName(insights.topParty?.party, lang)}
          accent="#22c55e"
        />
        <InsightCard
          icon={<Users size={20} color="#3b82f6" />}
          title={t('Alliance Total', 'கூட்டணி மொத்தம்')}
          body={`${dmkAllianceSeats > admkAllianceSeats ? dmkAllianceSeats : admkAllianceSeats} ${t('seats', 'இடங்கள்')}`}
          sub={dmkAllianceSeats > admkAllianceSeats 
		  ? t('DMK + INC + VCK + CPI + CPM', 'திமுக + காங் + விசிக + சிபிஎம் + சிபிஐ')
		  : t('ADMK + BJP + PMK', 'அதிமுக + பாஜக + பாமக')}
          accent="#3b82f6"
        />
      </div>
	  )}

      {/* ── District-level Map + Drill-down ─── */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} color="var(--accent-blue)" />
            {ELECTION_CONFIG[year]?.status == 'final' 
			  ? t('District-wise Results', 'மாவட்ட வாரியான முடிவுகள்')
			  : t('District-wise Leading', 'மாவட்ட வாரியான முன்னணி')
			}
          </h3>
         {/* <select
            className="input"
            style={{ width: 'auto', minWidth: '180px' }}
            value={selectedDistrict}
            onChange={e => setSelectedDistrict(e.target.value)}
          >
            {allDistricts.map(d => (
              <option key={d} value={d}>{districtDisplayLookup[d] || d}</option>
            ))}
          </select>*/}
        </div>

        <div style={{ display: 'grid', gap: '24px', alignItems: 'start' }} className="district-layout">
          {/* Map */}
          <div style={{ minHeight: '360px' }}>
            <TamilNaduMap
			  key={lang}
              selectedDistrict={selectedDistrict}
              onSelect={(d) => {
				//console.log("MAP CLICK: d: " + d);
				setSelectedDistrict(d);
			  }}
              districtPartyMap={districtPartyMap}
              lang={lang}
              districtDisplayLookup={districtDisplayLookup}
              partyDisplayLookup={partyDisplayLookup}
            />
          </div>

          {/* District detail panel */}
          <DistrictPanel
            selectedDistrict={selectedDistrict}
            grouped={grouped}
            districtDisplayLookup={districtDisplayLookup}
            t={t}
            lang={lang}
          />
        </div>
      </div>

    </div>
  );
}

/* ── Sub-components ─────────────────────── */

function StatCard({ label, value, color }) {
  return (
    <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', minWidth: '76px', textAlign: 'center' }}>
      <div style={{ fontSize: '26px', fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', whiteSpace: 'nowrap' }}>{label}</div>
    </div>
  );
}

function InsightCard({ icon, title, body, sub, accent }) {
  return (
    <div className="card" style={{ padding: '18px', borderLeft: `4px solid ${accent}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        {icon}
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>{title}</span>
      </div>
      <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{body}</div>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{sub}</div>
    </div>
  );
}

function DistrictPanel({ selectedDistrict, grouped, districtDisplayLookup, t, lang }) {
  const constituenciesInDistrict = grouped[normalize(selectedDistrict)] || [];
  const districtName = constituenciesInDistrict[0]?.districtDisplay || selectedDistrict;
  //console.log(districtName);
  //console.log(constituenciesInDistrict);
  
  const partySummary = {};
  constituenciesInDistrict.forEach(c => {
    partySummary[c.party] = (partySummary[c.party] || 0) + 1;
  });
  const sortedParties = Object.entries(partySummary).sort((a, b) => b[1] - a[1]);
  const dominantParty = sortedParties[0]?.[0];

  return (
    <div>
      {/* District summary header */}
      <div style={{ background: `${getPartyColor(dominantParty)}15`, border: `1px solid ${getPartyColor(dominantParty)}40`, borderRadius: '12px', padding: '14px 16px', marginBottom: '16px' }}>
        <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
          {districtName}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
          {constituenciesInDistrict.length} {t('constituencies', 'தொகுதிகள்')}
          {dominantParty && (
            <span> · {t('Led by', 'முன்னிலை:')} <span style={{ color: getPartyColor(dominantParty), fontWeight: 700 }}>{dominantParty}</span></span>
          )}
        </div>
        {/* Party breakdown pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
          {sortedParties.map(([party, count]) => (
            <span key={party} className="badge" style={{ background: `${getPartyColor(party)}20`, color: getPartyColor(party), border: `1px solid ${getPartyColor(party)}50` }}>
              {party} {count}
            </span>
          ))}
        </div>
      </div>

      {/* Constituency list */}
      <div style={{ height: '350px', overflowY: 'auto', borderTop: "1px solid var(--border)"}}>
        {constituenciesInDistrict.map((c, i) => (
          <div key={c.name || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{c.nameDisplay || c.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{c.winner}</div>
            </div>
            {c.party && (<span className="badge" style={{ background: `${getPartyColor(c.party)}20`, color: getPartyColor(c.party), border: `1px solid ${getPartyColor(c.party)}40`, fontSize: '11px' }}>
              {c.partyDisplay || c.party}
            </span>)}
          </div>
        ))}
        {constituenciesInDistrict.length === 0 && (
          <div style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '16px 0', textAlign: 'center' }}>
            {t('Click a district on the map', 'வரைபடத்தில் மாவட்டத்தை கிளிக் செய்யவும்')}
          </div>
        )}
      </div>
    </div>
  );
}
