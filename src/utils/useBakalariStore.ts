import { BakalariApi } from "bakalari-ts-api";
import { create } from "zustand";

interface BakakalariStore {
  api: BakalariApi | null;
  setApi: (api: BakalariApi | null) => void;
  loaderVisible: true | false | "simple";
  setLoaderVisible: (loaderVisible: true | false | "simple") => void;
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
  setLoaderVisible: (loaderVisible: true | false | "simple") =>
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
