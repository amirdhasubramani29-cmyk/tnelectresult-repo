import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ArrowRight } from 'lucide-react';
import { getPartyColor } from '@/data/elections';
import { ELECTION_CONFIG } from "@/config/electionConfig";
import { getPartyDisplayName } from '@/utils/dataAdapter';

const ElectionCard = ({ year, topParties, t }) => {
  const { lang } = useApp();
  const status = ELECTION_CONFIG[year]?.status;
  return (
    <Link href={`/tn/${year}`} style={{ textDecoration: "none" }}>
      <div
        className="card"
        style={{
          padding: "22px",
          cursor: "pointer",
          borderLeft: "4px solid #E31E24",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          <span style={{ fontSize: "24px" }}>🏛️</span>

          <div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 800,
                color: "var(--text-primary)",
              }}
            >
              {t(`Tamil Nadu ${year}`, `தமிழ்நாடு ${year}`)}
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "#22c55e",
                fontWeight: 600,
              }}
            >
              ✓ {status === "final" 
				? t("Results Available", "முடிவுகள் கிடைக்கின்றன")
			    : t("Results in Progress", "முடிவுகள் நடைபெற்று வருகின்றன")}
            </div>
          </div>
        </div>

        <p
          style={{
            fontSize: "13px",
            color: "var(--text-muted)",
            marginBottom: "14px",
          }}
        >
          {t(
            "Assembly Election · 234 Constituencies",
            "சட்டமன்றத் தேர்தல் · 234 தொகுதிகள்"
          )}
        </p>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {topParties.map(({ party, seats }) => (
            <span
              key={party}
              className="badge"
              style={{
                background: `${getPartyColor(party)}18`,
                color: getPartyColor(party),
                border: `1px solid ${getPartyColor(party)}40`,
              }}
            >
              {getPartyDisplayName(party, lang)} {seats}
            </span>
          ))}
        </div>

        <div
          style={{
            marginTop: "14px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#3b82f6",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          {t("Explore Results", "முடிவுகளை ஆராயுங்கள்")}{" "}
          <ArrowRight size={14} />
        </div>
      </div>
    </Link>
  );
};
export default ElectionCard;