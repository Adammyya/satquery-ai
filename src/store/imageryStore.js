import { create } from "zustand";

const demoImagery = {
  id: "nasa-demo-001",
  source: "NASA Earthdata",
  filename: "earthdata.jpeg",
  assetUrl: "/imagery/earthdata.jpeg",
  acquisitionDate: "2021-09-30",
  modality: "optical",
  file: null,
};

const useImageryStore = create((set) => ({
  image: demoImagery,
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