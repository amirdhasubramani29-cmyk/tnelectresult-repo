import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const tickerCache = new Map();
let tickerUnsubscribe = null;

// REAL-TIME (for 2026)
export const subscribeTicker2026 = (callback) => {
  const key = "2026";

  // 1. Serve cached data instantly
  if (tickerCache.has(key)) {
    callback(tickerCache.get(key));
  }

  // 2. Avoid duplicate listeners
  if (tickerUnsubscribe) {
    return tickerUnsubscribe;
  }

  const ref = doc(db, "ticker", "2026");

  tickerUnsubscribe = onSnapshot(ref, (snapshot) => {
    let result;

    if (snapshot.exists()) {
      const data = snapshot.data();

      result = {
        en: data.en || [],
        ta: data.ta || [],
      };
    } else {
      result = { en: [], ta: [] };
    }

    // 3. Cache it
    tickerCache.set(key, result);

    // 4. Notify UI
    callback(result);
  });

  return () => {
    if (tickerUnsubscribe) {
      tickerUnsubscribe();
      tickerUnsubscribe = null;
    }
  };
};

// STATIC / fallback
export const getTickerData = async (year) => {
  try {
    const data = await import(`@/data/ticker/${year}.json`);
    return data.default;
  } catch {
    return { en: [], ta: [] };
  }
};