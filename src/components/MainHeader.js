'use client';
import { useApp } from '@/context/AppContext';
import { Sun, Moon, Globe, Home, Heart, BarChart2, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { useState } from 'react';

export default function MainHeader() {
  const { lang, setLang, theme, setTheme, t } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 200 }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

        {/* LEFT — Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>🗳️</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
              {t('TN Election Dashboard', 'தேர்தல் முடிவுகள்')}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1 }}>
              {t('Tamil Nadu', 'தமிழ்நாடு')}
            </div>
          </div>
        </Link>

        {/* CENTER — Nav links (desktop only) */}
        <nav className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <NavLink href="/" icon={<Home size={15} />} label={t('Home', 'முகப்பு')} />
          <NavLink href="/tn/2021" icon={<BarChart2 size={15} />} label={t('Results 2021', 'முடிவுகள் 2021')} />
          <NavLink href="/donate" icon={<Heart size={15} />} label={t('Donate', 'ஆதரவு')} accent />
        </nav>

        {/* RIGHT — Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            className="btn btn-ghost"
            onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', fontSize: '13px' }}
            title="Switch Language"
          >
            <Globe size={14} />
            <span>{lang === 'en' ? 'தமிழ்' : 'EN'}</span>
          </button>

          <button
            className="btn btn-ghost"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{ padding: '7px 10px' }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Mobile hamburger */}
          <button
            className="btn btn-ghost"
            style={{ padding: '7px 10px', display: 'none' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <MobileLink href="/" icon={<Home size={15} />} label={t('Home', 'முகப்பு')} onClick={() => setMobileMenuOpen(false)} />
          <MobileLink href="/tn/2021" icon={<BarChart2 size={15} />} label={t('Results 2021', 'முடிவுகள் 2021')} onClick={() => setMobileMenuOpen(false)} />
          <MobileLink href="/donate" icon={<Heart size={15} />} label={t('Donate', 'ஆதரவு')} onClick={() => setMobileMenuOpen(false)} accent />
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          #mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}

function NavLink({ href, icon, label, accent }) {
  return (
    <Link href={href} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, color: accent ? 'var(--accent-yellow)' : 'var(--text-secondary)', textDecoration: 'none', transition: 'all 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = accent ? 'var(--accent-yellow)' : 'var(--accent-blue)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = accent ? 'var(--accent-yellow)' : 'var(--text-secondary)'; }}
    >
      {icon} {label}
    </Link>
  );
}

function MobileLink({ href, icon, label, onClick, accent }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/"); 

  return (
    <Link href={href} 
	  onClick={onClick} 
	  style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 12px",
        borderRadius: "8px",
        fontSize: "13px",
        fontWeight: isActive ? 600 : 500,
        background: isActive ? "var(--bg-card)" : accent ? "rgba(239,68,68,0.1)" : "transparent",
        color: isActive ? "var(--text-primary)" : accent ? "#ef4444" : "var(--text-muted)",
        border: isActive ? "1px solid var(--border)" : "1px solid transparent", transition: "all 0.2s ease"
      }}
    >
      {icon} {label}
    </Link>
  );
}