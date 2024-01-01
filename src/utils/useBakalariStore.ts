import BakalariApi from "bakalari-ts-api/build/models/BakalariApi";
import { create } from "zustand";

interface BakakalariStore {
  api: BakalariApi | null;
  setApi: (api: BakalariApi | null) => void;
  loaderVisible: true | false | "simple";
  setLoaderVisible: (loaderVisible: true | false | "simple") => void;
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
}));

export default useBakalariStore;
