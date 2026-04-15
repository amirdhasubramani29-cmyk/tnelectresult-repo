import { Inter, Noto_Sans_Tamil } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { AppProvider } from "@/context/AppContext";
import MainHeader from "@/components/MainHeader";
import Script from "next/script";
import ScrollToTop from "@/components/ScrollToTop";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const notoTamil = Noto_Sans_Tamil({ subsets: ["tamil"], variable: '--font-tamil', weight: ['400','500','600','700'] });

export const metadata = {
  title: "தமிழ்நாடு தேர்தல் முடிவுகள் | Tamil Nadu Election Results",
  description: "Comprehensive Tamil Nadu Assembly Election 2021 Results - All 234 constituencies with vote share, margins, and party-wise analysis.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
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

        </AppProvider>
      </body>
    </html>
  );
}