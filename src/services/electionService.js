import { subscribeToElection } from "./firebaseService";
import { loadTNData } from "@/data/elections";

export const getElectionData = (year, lang, callback) => {
  // 🔥 Firebase (Realtime)
  if (year === 2026) {
    return subscribeToElection(year, callback);
  }

  // 📦 JSON (offline)
  loadTNData(year, lang).then(callback);

  // ✅ Always return a function
  return () => {};
};