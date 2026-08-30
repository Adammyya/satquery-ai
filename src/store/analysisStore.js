import { create } from "zustand";

const useAnalysisStore = create((set) => ({
  query: "",
  status: "idle",
  task: null,
  result: null,
  confidence: null,

  setQuery: (query) => {
    set({ query });
  },

  setStatus: (status) => {
    set({ status });
  },

  setTask: (task) => {
    set({ task });
  },

  setResult: (result) => {
    set({ result });
  },

  setConfidence: (confidence) => {
    set({ confidence });
  },

  resetAnalysis: () => {
    set({
      query: "",
      status: "idle",
      task: null,
      result: null,
      confidence: null,
    });
  },
}));

export default useAnalysisStore;