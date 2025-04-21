import { create } from 'zustand';
interface HistoryState {
  showHistory: boolean;
  toggleHistory: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  showHistory: false,

  toggleHistory: () => {
    const currentShow = get().showHistory;
    set({ showHistory: !currentShow });
  },
}));
