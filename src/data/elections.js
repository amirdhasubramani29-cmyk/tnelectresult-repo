import tn21dataen from "./tn_2021_results_en.json";
import tn21datata from "./tn_2021_results_ta.json";

export const electionsDataen = {
  state_en: "Tamil Nadu",
  state_ta: "தமிழ்நாடு",
  year: 2021,
  total_seats: 234,
  majority_mark: 118,
  status: "final",
  last_updated: "2021-05-02",
  constituencies: tn21dataen
};

export const electionsDatata = {
  state_en: "Tamil Nadu",
  state_ta: "தமிழ்நாடு",
  year: 2021,
  total_seats: 234,
  majority_mark: 118,
  status: "final",
  last_updated: "2021-05-02",
  constituencies: tn21datata
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
  // Tamil party keys (from TA JSON)
  "திமுக":        "#E31E24",
  "அதிமுக":       "#00A651",
  "காங்கிரஸ்":    "#139BD4",
  "பாஜக":       "#FF6B00",
  "விசிக":         "#7C3AED",
  "பாமக":          "#F59E0B",
  "மார்க்சிஸ்ட்":  "#9B1C1C",
  "கம்யூனிஸ்ட்":  "#DC2626",
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

// 🔌 Data service — abstracted for future API/live support
export async function fetchElectionData(state = "tn", year = 2021, lang = "en") {
  // Currently returns static data; swap this with API call later
  return lang === "ta" ? electionsDatata : electionsDataen;
}
