import { doc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase.js";

export const subscribeToElection = (year, callback) => {
  const summaryRef = doc(db, "elections", String(year));
  const constRef = collection(db, `elections/${year}/constituencies`);

  let summary = {};
  let constituencies = [];

  const unsub1 = onSnapshot(summaryRef, (snap) => {
    summary = snap.data() || {};
    callback({ ...summary, constituencies });
  });

  const unsub2 = onSnapshot(constRef, (snap) => {
    constituencies = snap.docs.map((doc) => doc.data());

    callback({ ...summary, constituencies });
  });

  return () => {
    unsub1();
    unsub2();
  };
};