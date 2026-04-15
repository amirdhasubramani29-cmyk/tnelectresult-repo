const cache = new Map();

const loadTNData = async (year, lang) => {
  try {
    const data = await import(`@/data/${year}/tn_results_${lang}.json`);
	console.log('election.js loadTNdata ' + year + ' ' + lang);
    return data.default;
  } catch (e) {
    console.error(`Data load error for year ${year} (${lang})`, e);
    return null;
  }
};

export const getElectionData = async (year, lang) => {
  const key = `${year}-${lang}`;
  if (cache.has(key)) {
	console.log('data get from cache. key: ' + key);
    return cache.get(key); 
  }

  const promise = (async () => {
	const constituencies = await loadTNData(year, lang);
	return {
		state_en: "Tamil Nadu",
		state_ta: "தமிழ்நாடு",
		year,
		total_seats: 234,
		majority_mark: 118,
		status: "final",
		last_updated: "2021-05-02",
		constituencies,
	};
  })();
  
  cache.set(key, promise);

  console.log('data set into cache. key: ' + key);
  return promise;
};

const geoCache = new Map();

export const getGeoData = async () => {
  const key = "tn-districts";
  if (geoCache.has(key)) {
    return geoCache.get(key);
  }

  const promise = (async () => {
    try {
      const res = await fetch("/tamilnadu_districts.json");
      if (!res.ok) {
        throw new Error("Failed to fetch geo data");
      }

      const data = await res.json();
      return data;
    } catch (e) {
      console.error("Geo data error:", e);
      return null;
    }
  })();

  geoCache.set(key, promise);
  return promise;
};

// ✅ Party color map — covers both EN & TA keys
export const partyColors = {
  // English party keys (from EN JSON)
  "DMK":         "#E31E24",   // DMK red
  "ADMK":        "#00A651",   // AIADMK green
  "INC":         "#139BD4",   // Congress blue
  "BJP":         "#FF6B00",   // BJP saffron
  "VCK":         "#7C3AED",   // VCK purple
  "PMK":         "#F59E0B",   // PMK amber
  "CPM":         "#9B1C1C",   // CPM dark red
  "CPI":         "#DC2626",   // CPI red
  "TVK": 		 "#FFFF00",   // TVK yellow
  "AMMK":        "#000000",   // AMMK black
  // Tamil party keys (from TA JSON)
  "திமுக":       "#E31E24",
  "அதிமுக":     "#00A651",
  "காங்":        "#139BD4",
  "பாஜக":       "#FF6B00",
  "விசிக":       "#7C3AED",
  "பாமக":       "#F59E0B",
  "சிபிஎம்":      "#9B1C1C",
  "சிபிஐ":        "#DC2626",
  "தவெக": 	  "#FFFF00", 
  "அமமுக":      "#000000",
  // Fallback
  "Independent": "#6B7280",
  "Other":       "#9B59B6"
};

// ✅ Party display names
export const partyFullNames = {
  "DMK":   { en: "Dravida Munnetra Kazhagam",             ta: "திராவிட முன்னேற்றக் கழகம்" },
  "ADMK":  { en: "All India Anna Dravida Munnetra Kazhagam", ta: "அனைத்திந்திய அண்ணா திராவிட முன்னேற்றக் கழகம்" },
  "INC":   { en: "Indian National Congress",              ta: "இந்திய தேசிய காங்கிரஸ்" },
  "BJP":   { en: "Bharatiya Janata Party",                ta: "பாரதீய ஜனதா கட்சி" },
  "VCK":   { en: "Viduthalai Chiruthaigal Katchi",        ta: "விடுதலைச் சிறுத்தைகள் கட்சி" },
  "PMK":   { en: "Pattali Makkal Katchi",                 ta: "பட்டாளி மக்கள் கட்சி" },
  "CPM":   { en: "Communist Party of India (Marxist)",    ta: "இந்திய கம்யூனிஸ்ட் கட்சி (மார்க்சிஸ்ட்)" },
  "CPI":   { en: "Communist Party of India",              ta: "இந்திய கம்யூனிஸ்ட் கட்சி" },
};

export function getPartyColor(party) {
  return partyColors[party] || "#6B7280";
}

export function getPartyName(party, lang) {
  if (!partyFullNames[party]) return party;
  return lang === "ta" ? partyFullNames[party].ta : partyFullNames[party].en;
}

export function getPartySummary(constituencies) {
  const summary = {};
  constituencies.forEach(c => {
    const key = c.party;
    summary[key] = (summary[key] || 0) + 1;
  });
  return Object.entries(summary)
    .map(([party, seats]) => ({ party, seats }))
    .sort((a, b) => b.seats - a.seats);
}

export function getInsights(data) {
  const constituenciesSorted = [...data.constituencies].sort((a, b) => b.margin - a.margin);
  return {
    biggestWin:   constituenciesSorted[0],
    closestRace:  constituenciesSorted[constituenciesSorted.length - 1],
    topParty:     getPartySummary(data.constituencies)[0]
  };
}
