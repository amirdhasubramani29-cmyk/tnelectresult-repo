import { Inter, Noto_Sans_Tamil } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { AppProvider } from "@/context/AppContext";
import MainHeader from "@/components/MainHeader";
import Script from "next/script";
import ScrollToTop from "@/components/ScrollToTop";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const notoTamil = Noto_Sans_Tamil({ subsets: ["tamil"], variable: '--font-tamil', weight: ['400','500','600','700'] });

export const metadata = {
  title:
    "TN Election Results 2026 Tamil | தமிழ்நாடு தேர்தல் முடிவுகள் 2026 (Live)",
  description:
    "தமிழ்நாடு தேர்தல் முடிவுகள் 2026 - தொகுதி வாரியாக முடிவுகள், வாக்கு எண்ணிக்கை, முன்னிலை, வெற்றி பெற்றவர்கள். TN Election Results 2026 Tamil live updates.",
   
  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://tnelectionresults.site",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light"  data-scroll-behavior="smooth">
	  <body
        className={`${inter.variable} ${notoTamil.variable}`}
        style={{
          fontFamily: "var(--font-inter), var(--font-tamil), sans-serif",
        }}
      >
	    <ScrollToTop /> 
        <AppProvider>

          {/* ✅ GLOBAL HEADER */}
          <MainHeader />

          {/* ✅ PAGE CONTENT */}
          {children}

          {/* ✅ FOOTER */}
          <Footer />
		
		  <Analytics />
        </AppProvider>
      </body>
    </html>
  );
}