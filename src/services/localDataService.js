import election2021 from "../data/2021/tn_results_en.json";

export const getLocalElection = (year) => {
  switch (year) {
    case 2021:
      return election2021;
    default:
      return null;
  }
};