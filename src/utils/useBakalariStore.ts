import { BakalariApi } from "bakalari-ts-api";
import { create } from "zustand";

interface BakakalariStore {
  api: BakalariApi | null;
  setApi: (api: BakalariApi | null) => void;
  loaderVisible: boolean | "simple" | "transparent";
  setLoaderVisible: (loaderVisible: boolean | "simple" | "transparent") => void;
  onlineStatus: boolean;
  setOnlineStatus: (online: boolean) => void;
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
}));

export default useBakalariStore;
