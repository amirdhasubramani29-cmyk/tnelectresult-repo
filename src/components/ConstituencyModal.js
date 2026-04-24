'use client';
import { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { getPartyColor, getPartyName, partyFullNames } from '@/data/elections';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { X, TrendingUp, Users, Award, MapPin } from 'lucide-react';
import { ELECTION_CONFIG } from "@/config/electionConfig";
import { getPartyDisplayName } from '@/utils/dataAdapter';
import { LabelList } from "recharts";

export default function ConstituencyModal() {
	  
  const { selectedConstituency, setSelectedConstituency, t, lang, year } = useApp();
  
  const formatIN = (num) => Number(num || 0).toLocaleString("en-IN");
  
  useEffect(() => {
    if (selectedConstituency) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedConstituency]);

  if (!selectedConstituency) return null;

  const c = selectedConstituency;
  //console.log("SELECTED:", c);
  const winnerVotes = c.winner_votes ?? c.votes?.winner ?? 0;
  const runnerVotes = c.runner_votes ?? c.votes?.runner_up?.votes ?? 0;
  const runnerName = c.runner_name ?? c.votes?.runner_up?.name ?? "Runner-up";
  const runnerParty = c.runner_party ?? c.votes?.runner_up?.party ?? "";
  const partyColor = getPartyColor(c.party);
  const others = c.votes?.others || [];

  const candidates = [
	{
	  name: c.winner || "",
	  party: c.party || "",
	  votes: winnerVotes,
	  fill: getPartyColor(c.party),
	},
	{
	  name: runnerName,
	  party: runnerParty,
	  votes: runnerVotes,
	  fill: getPartyColor(runnerParty),
	},
	...others.map((o) => ({
	  name: o.name,
	  party: o.party || "",
	  votes: o.votes || 0,
	  fill: o.party ? getPartyColor(o.party) : "#6B7280",
	})),
  ];
  
  
  const othersVotes = others.reduce((s, o) => s + (o.votes || 0), 0);
  const totalVotes = winnerVotes + runnerVotes + othersVotes;

  const candidatesWithShare = candidates.map((item) => ({
    ...item,
    share: totalVotes > 0
	  ? ((item.votes / totalVotes) * 100).toFixed(1)
	  : "0.0",
	}));
  const topCandidates = candidatesWithShare
	  .filter((item) => item.votes > 0)
	  .sort((a, b) => b.votes - a.votes)
	  .slice(0, 6);
  
  const margin = c.margin ?? (winnerVotes - runnerVotes);
  const winShare = totalVotes > 0 ? ((winnerVotes / totalVotes) * 100).toFixed(1) : "0.0";
  
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backdropFilter: 'blur(4px)' }}
      onClick={() => setSelectedConstituency(null)}
    >
      <div
        className="animate-slide-up"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '20px', maxWidth: '620px', width: '100%', maxHeight: '92vh', overflowY: 'auto', color: 'var(--text-primary)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>{c.name_en}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={13} /> {c.district_en} · {t('Constituency', 'தொகுதி')} #{c.id}
            </div>
          </div>
          <button
            onClick={() => setSelectedConstituency(null)}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px', display: 'flex' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Winner card */}
          <div style={{ background: `${partyColor}18`, border: `1px solid ${partyColor}50`, borderRadius: '14px', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Award size={18} color={partyColor} />
              <span style={{ fontWeight: 700, color: partyColor, fontSize: '14px' }}>
			  {ELECTION_CONFIG[year]?.status == 'final' 
				? t('Winner', 'வெற்றியாளர்')
				: t('Leading', 'முன்னணி ')}
			  </span>
              {c.party && (<span className="badge" style={{ background: `${partyColor}25`, color: partyColor, border: `1px solid ${partyColor}50`, marginLeft: 'auto' }}>
				{getPartyDisplayName(c.party, lang)}
			  </span>)}
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>{c.winner}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '3px' }}>
              {getPartyDisplayName(c.party, lang)}
            </div>
            {/* Stats row */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '14px', flexWrap: 'wrap' }}>
              <StatMini label={t('Votes', 'வாக்குகள்')} value={formatIN(c.winner_votes)} color={partyColor} />
              <StatMini label={t('Vote Share', 'வாக்கு பங்கு')} value={`${winShare}%`} color="#3b82f6" />
              <StatMini label={t('Margin', 'இடைவெளி')} value={`+${formatIN(margin)}`} color="#22c55e" />
              <StatMini label={t('Total Votes', 'மொத்தம்')} value={formatIN(totalVotes)} color="var(--text-muted)" />
            </div>
          </div>

          {/* Vote comparison chart */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={15} /> {t('Vote Comparison', 'வாக்கு ஒப்பீடு')}
            </h4>
            <ResponsiveContainer width="100%" height={Math.min(40 * topCandidates.length + 20, 220)}>
              <BarChart data={topCandidates} layout="vertical" margin={{ left: 8, right: 20 }}>
                <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickFormatter={v => (v / 1000).toFixed(0) + 'k'} />
                <YAxis type="category" dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} width={140} />
                <Tooltip
                  formatter={v => [formatIN(v), t('Votes', 'வாக்குகள்')]}
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-primary)' }}
                  labelStyle={{ color: 'var(--text-primary)' }}
                />
                <Bar dataKey="votes" radius={[0, 6, 6, 0]}>
                  {topCandidates.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
				  <LabelList
    dataKey="share"
    position="right"
    formatter={(value) => `${value}%`}
    style={{
      fill: "var(--text-secondary)",
      fontSize: 11,
      fontWeight: 600,
    }}
  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* All candidates list */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={15} /> {t('All Candidates', 'அனைத்து வேட்பாளர்கள்')} ({topCandidates.length})
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {topCandidates.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.fill, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: '13px', fontWeight: i === 0 ? 700 : 400, color: i === 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    {item.name} {item.party && <span style={{ color: item.fill, fontWeight: 600 }}>({getPartyDisplayName(item.party, lang)})</span>}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: item.fill }}>{formatIN(item.votes)} ({item.share}%)</span>
                  <div style={{ width: '80px', background: 'var(--border)', borderRadius: '4px', height: '5px' }}>
                    <div style={{ width: `${(item.votes / topCandidates[0].votes) * 100}%`, background: item.fill, height: '100%', borderRadius: '4px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatMini({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: '18px', fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{label}</div>
    </div>
  );
}
