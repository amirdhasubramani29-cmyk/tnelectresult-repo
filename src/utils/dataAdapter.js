import { normalize } from './mapUtils';

// EN party keys → display names by language
const partyDisplayMap = {
  DMK:  { ta: 'திமுக',		en: 'DMK'  },
  ADMK: { ta: 'அதிமுக',   	en: 'ADMK' },
  INC:  { ta: 'காங்', 		en: 'INC'  },
  BJP:  { ta: 'பாஜக',  	en: 'BJP'  },
  VCK:  { ta: 'விசிக',    	en: 'VCK'  },
  PMK:  { ta: 'பாமக',    	en: 'PMK'  },
  CPM:  { ta: 'சிபிஎம்', 	en: 'CPM'  },
  CPI:  { ta: 'சிபிஐ',  	en: 'CPI'  },
  AMMK: { ta: 'அமமுக', 	en: 'AMMK' },
  TVK:  { ta: 'தவெக',  	en: 'TVK'  }, 
};

export function getPartyDisplayName(party, lang) {
  if (!partyDisplayMap[party]) return party;
  return lang === "ta" ? partyDisplayMap[party].ta : partyDisplayMap[party].en;
}

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

  // guard against undefined / null / non-array
  if (!Array.isArray(data)) {
    console.warn("buildDistrictMap: invalid data", data);
    return map;
  }

  data.forEach((item) => {
    if (!item?.district_en) return;

    const key = normalize(item.district_en);

    map[item.district_en] = key;

    // lowercase safe
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
export function transformData(data, lang = "en") {
  const list = Array.isArray(data?.constituencies)
    ? data.constituencies
    : [];

  const isTamil = lang === "ta";
  //console.log('transformData lang isTamil: ' + isTamil);
  
  return list.map((item) => {
    if (!item) return {};

    // pick best available values
    const district =
      isTamil
        ? item.district_ta || item.district_en || ""
        : item.district_en || item.district_ta || "";

    const name =
      isTamil
        ? item.name_ta || item.name_en || ""
        : item.name_en || item.name_ta || "";
		
	const districtKey = isTamil
        ? item.district_ta || item.district_en || ""
        : normalize(item.district_en);
		
	const winnerDisplay = isTamil
        ? item.winner_ta || item.winner || ""
		: item.winner || item.winner_ta || "";

	const runnerName = isTamil
	    ? item.runner_name_ta || item.runner_name || item.votes?.runner_up?.name || ""
	    : item.runner_name || item.runner_name_ta || item.votes?.runner_up?.name || "";
		
	const winnerVotes = item.winner_votes ?? item.votes?.winner ?? 0;

    const runnerVotes = item.runner_votes ?? item.votes?.runner_up?.votes ?? 0;
	
	const runnerParty = item.runner_party ?? item.votes?.runner_up?.party ?? "";
	
	//console.log('transformData votes: ' + winnerVotes + ' ' + runnerVotes);
	
    return {
      id: item.id,

      districtKey: districtKey,
      districtDisplay: district,

      nameDisplay: name,

      party: item.party || "",
      partyDisplay: partyDisplayMap?.[item.party]?.[lang] || item.party || "",

      winner: winnerDisplay,
      winner_votes: winnerVotes,

      runner_name: runnerName,
      runner_party: runnerParty,
      runner_votes: runnerVotes,

      margin: item.margin || 0,
      status: item.status || "pending",
	  votes: item.votes || null,
    };
  });
}