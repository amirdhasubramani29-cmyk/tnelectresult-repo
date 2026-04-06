'use client';

import Link from 'next/link';
import { useApp } from "@/context/AppContext";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const { t } = useApp();

  return (
    <div
      style={{
        minHeight: "60vh",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        padding: "40px 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start"
      }}
    >
      <div
        style={{
          maxWidth: "520px",
          width: "100%",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "28px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          textAlign: "center"
        }}
      >
        <h1
		  style={{
			fontSize: "22px",
			fontWeight: 800,
			marginBottom: "12px",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			gap: "8px"
		  }}
		>
		  <AlertTriangle size={22} color="var(--accent-yellow)" />
		  404
		</h1>

        <h2
          style={{
            fontSize: "16px",
            fontWeight: 600,
            marginBottom: "12px"
          }}
        >
          {t("Page Not Found", "பக்கம் கிடைக்கவில்லை")}
        </h2>

        {/* Description */}
        <p
          style={{
            color: "var(--text-muted)",
            marginBottom: "24px",
            lineHeight: "1.6"
          }}
        >
          {t(
            "The page you are looking for doesn’t exist or has been moved.",
            "நீங்கள் தேடும் பக்கம் இல்லை அல்லது மாற்றப்பட்டுள்ளது."
          )}
        </p>

        {/* Button */}
        <Link href="/">
          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "var(--bg-secondary)",
              cursor: "pointer",
              fontWeight: 500
            }}
          >
            <ArrowLeft size={16} />
            {t("Back to Home", "முகப்புக்கு செல்ல")}
          </button>
        </Link>
      </div>
    </div>
  );
}