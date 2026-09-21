import { create } from "zustand";

const useAnalysisStore = create((set) => ({
  query: "",
  status: "idle",
  task: null,
  result: null,
  confidence: null,
  evidence: null,
  executionTrace: [],

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

  setEvidence: (evidence) => {
    set({ evidence });
  },

  addTraceEvent: (event) => {
    set((state) => ({
      executionTrace: [...state.executionTrace, event],
    }));
  },
  clearExecutionTrace: () => {
  set({ executionTrace: [] });
},

  resetAnalysis: () => {
    set({
      query: "",
      status: "idle",
      task: null,
      result: null,
      confidence: null,
      evidence: null,
      executionTrace: [],
    });
  },
}));

export default useAnalysisStore;