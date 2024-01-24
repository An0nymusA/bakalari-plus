import { FormattedTimetableHour } from "bakalari-ts-api";
import { create } from "zustand";

interface TimetableModalStore {
  current: FormattedTimetableHour | null;
  setCurrent: (current: FormattedTimetableHour | null) => void;
  clearCurrent: () => void;
}

const useTimetableModalStore = create<TimetableModalStore>((set) => ({
  current: null,
  clearCurrent: () =>
    set((state) => ({
      ...state,
      current: null,
    })),
  setCurrent: (current: FormattedTimetableHour | null) =>
    set((state) => ({
      ...state,
      current,
    })),
}));

export default useTimetableModalStore;
