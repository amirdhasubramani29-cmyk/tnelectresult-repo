import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyABku1KGrvZXP8JitpSkUpAY4wZXSg1nsc",
  authDomain: "electionresults-8cc90.firebaseapp.com",
  projectId: "electionresults-8cc90"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = initializeFirestore(app, {
  cache: persistentLocalCache(),
});