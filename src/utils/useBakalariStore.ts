import BakalariApi from "bakalari-ts-api/build/models/BakalariApi";
import { create } from "zustand";

interface BakakalariStore {
  api: BakalariApi | null;
  setApi: (api: BakalariApi | null) => void;
  authStatus: "network-error" | "error" | "success" | "pending";
  setAuthStatus: (
    authStatus: "network-error" | "error" | "success" | "pending"
  ) => void;
}

const useBakalariStore = create<BakakalariStore>((set) => ({
  api: null,
  setApi: (api: BakalariApi | null) =>
    set((state) => ({
      ...state,
      api,
    })),
  authStatus: "pending",
  setAuthStatus: (
    authStatus: "network-error" | "error" | "success" | "pending"
  ) =>
    set((state) => ({
      ...state,
      authStatus,
    })),
}));

export default useBakalariStore;
