// /utils/mapUtils.js

export function normalize(name, lang) {
    if (!name) return "";

    const key = name.toLowerCase().trim();

    const districtMapTA = {
        "thiruvallur": "திருவள்ளூர்",
        "chennai": "சென்னை",
        "kancheepuram": "காஞ்சிபுரம்",
        "vellore": "வேலூர்",
        "krishnagiri": "கிருஷ்ணகிரி",
        "dharmapuri": "தர்மபுரி",
        "tiruvannamalai": "திருவண்ணாமலை",
        "villupuram": "விழுப்புரம்",
        "salem": "சேலம்",
        "namakkal": "நாமக்கல்",
        "erode": "ஈரோடு",
        "tirupur": "திருப்பூர்",
        "nilgiris": "நீலகிரி",
        "coimbatore": "கோயம்புத்தூர்",
        "dindigul": "திண்டுக்கல்",
        "karur": "கரூர்",
        "tiruchchirappalli": "திருச்சிராப்பள்ளி",
        "perambalur": "பெரம்பலூர்",
        "ariyalur": "அரியலூர்",
        "cuddalore": "கடலூர்",
        "nagapattinam": "நாகப்பட்டினம்",
        "thiruvarur": "திருவாரூர்",
        "thanjavur": "தஞ்சாவூர்",
        "pudukkottai": "புதுக்கோட்டை",
        "sivaganga": "சிவகங்கை",
        "madurai": "மதுரை",
        "theni": "தேனி",
        "virudhunagar": "விருதுநகர்",
        "ramanathapuram": "ராமநாதபுரம்",
        "thoothukudi": "தூத்துக்குடி",
        "tirunelveli kattabo": "திருநெல்வேலி",
        "kanniyakumari": "கன்னியாகுமரி"
    };

    const districtMapEN = {
        "tirunelveli kattabo": "tirunelveli",
        "tiruchchirappalli": "tiruchirappalli",
        "kancheepuram": "kanchipuram",
        "thiruvallur": "tiruvallur",
        "thiruvarur": "tiruvarur",
    };
	
    return lang == 'ta' 
		? (districtMapTA[key] || districtMapEN[key])
        : (districtMapEN[key] || key)
		.replace(" district", "")
        .replace(/\s+/g, " ")
        .trim();
}

/**
 * Group constituencies by district
 */
export function groupByDistrict(data) {
    const result = {};

    data.forEach((item) => {
        const district = normalize(item.districtKey);
        if (!district) return;

        if (!result[district]) {
            result[district] = [];
        }

        result[district].push({
            districtDisplay: item.districtDisplay,
            name: item.nameDisplay,
            name_ta: item.name_ta,
            winner: item.winner,
            party: item.party,
            party_ta: item.party_ta,
            partyDisplay: item.partyDisplay
        });

    });

    return result;
}

/**
 * Get summary for a district
 */
export function getDistrictSummary(constituencies = []) {
    const summary = {
        total: constituencies.length,
        parties: {}
    };

    constituencies.forEach((c) => {
        summary.parties[c.party] =
            (summary.parties[c.party] || 0) + 1;
    });

    return summary;
}

/**
 * Get district → dominant party map
 */
export function getDistrictPartyMap(data) {
    const result = {};

    data.forEach((item) => {
        const rawDistrict = item.districtKey || item.district;
        const district = normalize(rawDistrict);

        const party = item.party;

        if (!district || !party) return;

        if (!result[district]) {
            result[district] = {};
        }

        result[district][party] =
            (result[district][party] || 0) + 1;
    });

    // majority party
    const finalMap = {};

    Object.keys(result).forEach((district) => {
        const parties = result[district];

        let maxParty = null;
        let maxCount = 0;

        Object.entries(parties).forEach(([party, count]) => {
            if (count > maxCount) {
                maxParty = party;
                maxCount = count;
            }
        });

        finalMap[district] = maxParty; // ✅ EN party
    });

    return finalMap;
}