import { normalize } from './mapUtils';

// EN party keys → display names by language
const partyDisplayMap = {
  DMK:  { ta: 'திமுக',    en: 'DMK'  },
  ADMK: { ta: 'அதிமுக',   en: 'ADMK' },
  INC:  { ta: 'காங்கிரஸ்', en: 'INC'  },
  BJP:  { ta: 'பாஜக',  en: 'BJP'  },
  VCK:  { ta: 'விசிக',    en: 'VCK'  },
  PMK:  { ta: 'பாமக',    en: 'PMK'  },
  CPM:  { ta: 'மார்க்சிஸ்ட்', en: 'CPM' },
  CPI:  { ta: 'கம்யூனிஸ்ட்',  en: 'CPI' },
};

export function formatDistrictName(name) {
  if (!name) return "";

  return name
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Build a map of district names → normalized key
 * Works from EN data only (more consistent)
 */
export function buildDistrictMap(data) {
  const map = {};
  data.forEach(item => {
    if (!item?.district_en) return;
    const key = normalize(item.district_en);
    map[item.district_en] = key;
    // also map lowercase
    map[item.district_en.toLowerCase()] = key;
  });
  return map;
}

export function buildDistrictTamilMap(data_ta) {
  const map = {};

  data_ta.forEach(item => {
    if (!item?.district_en || !item?.district_ta) return;

    const key = normalize(item.district_en); // "chennai"
    map[key] = item.district_ta;             // "சென்னை"
  });

  return map;
}

/**
 * Transform EN constituency data for map/district display
 * Always use EN party keys as source of truth
 */
export function transformData(data, lang = 'en', districtMap = {}) {
  return data.constituencies.map(item => {
    if (!item) return null;

	const districtKey = normalize(item.district_en);
    const partyKey    = item.party;
	const districtDisplay = lang === 'ta' ? districtMap[districtKey] || item.district_en : item.district_en;
	
    return {
      districtKey,
      districtDisplay: districtDisplay,
	  nameDisplay:	   lang === 'ta' ? item.name_ta || item.name_en : item.name_en,
      name_ta:         item.name_ta || '',
      party:           partyKey,
      partyDisplay:    partyDisplayMap[partyKey]?.[lang] || partyKey,
      winner:          item.winner || '',
    };
  }).filter(Boolean);
}