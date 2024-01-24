import { BakalariApi } from "bakalari-ts-api";
import { create } from "zustand";

interface BakakalariStore {
  api: BakalariApi | null;
  setApi: (api: BakalariApi | null) => void;
  loaderVisible: boolean | "simple" | "transparent";
  setLoaderVisible: (loaderVisible: boolean | "simple" | "transparent") => void;
  onlineStatus: boolean;
  setOnlineStatus: (online: boolean) => void;
  backdropVisible: boolean;
  setBackdropVisible: (visible: boolean) => void;
  toggleBackdropVisible: () => void;
}

const useBakalariStore = create<BakakalariStore>((set) => ({
  api: null,
  setApi: (api: BakalariApi | null) =>
    set((state) => ({
      ...state,
      api,
    })),
  loaderVisible: false,
  setLoaderVisible: (loaderVisible: boolean | "simple" | "transparent") =>
    set((state) => ({
      ...state,
      loaderVisible,
    })),
  onlineStatus: true,
  setOnlineStatus: (online: boolean) =>
    set((state) => ({
      ...state,
      onlineStatus: online,
    })),
  backdropVisible: false,
  setBackdropVisible: (visible: boolean) =>
    set((state) => ({
      ...state,
      backdropVisible: visible,
    })),
  toggleBackdropVisible: () =>
    set((state) => ({
      ...state,
      backdropVisible: !state.backdropVisible,
    })),
}));

export default useBakalariStore;
