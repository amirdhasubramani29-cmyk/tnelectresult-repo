'use client';
import Link from 'next/link';
import { Home, Heart, BarChart2, ExternalLink } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Footer() {
  const { t } = useApp();

  return (
    <footer style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderTop: '1px solid var(--border)', marginTop: '40px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Top row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '28px', marginBottom: '24px' }}>

          {/* Branding */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{ fontSize: '20px' }}>🗳️</span>
              <span style={{ fontWeight: 800, fontSize: '16px', color: 'var(--text-primary)' }}>
                {t('Election Dashboard', 'தேர்தல் முடிவுகள்')}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.7 }}>
              {t(
                'Independent election data platform for Tamil Nadu. Free, bilingual, and open to all.',
                'தமிழ்நாட்டுக்கான சுதந்திர தேர்தல் தரவு தளம். இலவசம், இரு மொழி மற்றும் அனைவருக்கும் திறந்தது.'
              )}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
              {t('Navigation', 'வழிசெலுத்தல்')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <FooterLink href="/" icon={<Home size={14} />} label={t('Home', 'முகப்பு')} />
              <FooterLink href="/tn/2021" icon={<BarChart2 size={14} />} label={t('TN 2021 Results', 'தமிழ்நாடு 2021 முடிவுகள்')} />
              <FooterLink href="/donate" icon={<Heart size={14} />} label={t('Support / Donate', 'ஆதரவு / நன்கொடை')} accent />
            </div>
          </div>

          {/* Data info */}
          <div>
            <p style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
              {t('Data', 'தரவு')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <div>🗳️ 234 {t('Constituencies', 'தொகுதிகள்')}</div>
              <div>🏛️ {t('Tamil Nadu Assembly 2021', 'தமிழ்நாடு சட்டமன்றம் 2021')}</div>
              <div>📍 32 {t('Districts', 'மாவட்டங்கள்')}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ExternalLink size={12} />
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                  {t('Source: Election Commission of India', 'ஆதாரம்: இந்திய தேர்தல் ஆணையம்')}
                </span>
              </div>
            </div>
          </div>

          {/* Ad slot */}
          {/*<div>
            <p style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
              Sponsored
            </p>
            <div className="ad-slot" style={{ height: '90px', borderRadius: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <div style={{ textAlign: 'center' }}>
                <div>📢 Ad Slot</div>
                <div style={{ fontSize: '11px', marginTop: '4px' }}>Google AdSense / Direct Sponsor</div>
              </div>
            </div>
          </div>*/}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            © 2026 Election Dashboard · {t('Made with', 'உருவாக்கியது')} ❤️ · {t('Data: ECI', 'தரவு: ECI')}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {t('For public awareness only', 'பொது விழிப்புணர்விற்காக மட்டுமே')}
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, icon, label, accent }) {
  return (
    <Link href={href} style={{ textDecoration: "none", display: "inline-block", width: "fit-content"   }}>
      <span
        style={{
          display: "inline-flex", // 🔥 key
          alignItems: "center",
          gap: "6px",
          fontSize: "13px",
          color: accent ? "var(--accent-yellow)" : "var(--text-secondary)",
          transition: "color 0.2s",
          cursor: "pointer"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = accent
            ? "var(--accent-yellow)"
            : "var(--accent-blue)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = accent
            ? "var(--accent-yellow)"
            : "var(--text-secondary)";
        }}
      >
        {icon}
        <span>{label}</span>
      </span>
    </Link>
  );
}