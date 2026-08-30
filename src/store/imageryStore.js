import { create } from "zustand";

const useImageryStore = create((set) => ({
  image: null,
  metadata: null,
  overlays: [],
  isLoading: false,

  setImage: (image) => {
    set({ image });
  },

  setMetadata: (metadata) => {
    set({ metadata });
  },

  setOverlays: (overlays) => {
    set({ overlays });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  clearImagery: () => {
    set({
      image: null,
      metadata: null,
      overlays: [],
      isLoading: false,
    });
  },
}));

export default useImageryStore;