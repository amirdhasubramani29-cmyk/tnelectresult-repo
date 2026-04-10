'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {

  // ✅ DEFAULT (same as server)
  const [lang, setLang] = useState('ta');
  const [theme, setTheme] = useState('light');
  const [year, setYear] = useState(2021);
  const [mounted, setMounted] = useState(false);

  const t = (en, ta) => (lang === 'ta' ? ta : en);

  // ✅ LOAD AFTER MOUNT (prevents hydration mismatch)
  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    const savedTheme = localStorage.getItem("theme");

    if (savedLang) setLang(savedLang);
    if (savedTheme) setTheme(savedTheme);

    setMounted(true);
  }, []);

  // ✅ APPLY THEME
  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  }, [theme]);

  // ✅ SAVE
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("lang", lang);
    }
  }, [lang, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("theme", theme);
    }
  }, [theme, mounted]);

  const [search, setSearch] = useState('');
  const [filterParty, setFilterParty] = useState('All');
  const [sortBy, setSortBy] = useState('id');
  const [selectedConstituency, setSelectedConstituency] = useState(null);

  // ✅ PREVENT HYDRATION MISMATCH
  if (!mounted) return null;

  return (
    <AppContext.Provider value={{
      lang, setLang,
      theme, setTheme,
      search, setSearch,
      filterParty, setFilterParty,
      sortBy, setSortBy,
      selectedConstituency, setSelectedConstituency,
      t, mounted,
	  year, setYear
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}