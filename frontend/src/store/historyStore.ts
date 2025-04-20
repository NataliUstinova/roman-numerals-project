import { create } from 'zustand';
import { Conversion } from '../components/ConversionHistory';

interface HistoryState {
  conversions: Conversion[];
  showHistory: boolean;
  loading: boolean;
  error: string | null;
  fetchConversions: () => Promise<void>;
  removeAllConversions: () => Promise<void>;
  toggleHistory: () => void;
  setError: (error: string | null) => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  conversions: [],
  showHistory: false,
  loading: false,
  error: null,
  
  fetchConversions: async () => {
    try {
      set({ loading: true, error: null });
      const response = await fetch('/all');
      
      if (!response.ok) {
        throw new Error('Failed to fetch conversions');
      }
      
      const data = await response.json();
      set({ conversions: data, loading: false });
    } catch (err) {
      console.error('Fetch error:', err);
      set({ 
        error: err instanceof Error ? err.message : 'Failed to load conversion history',
        loading: false 
      });
    }
  },
  
  removeAllConversions: async () => {
    try {
      set({ loading: true, error: null });
      const response = await fetch('/remove', {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove conversions');
      }
      
      set({ conversions: [], loading: false });
    } catch (err) {
      console.error('Remove error:', err);
      set({ 
        error: err instanceof Error ? err.message : 'Failed to clear conversion history',
        loading: false 
      });
    }
  },
  
  toggleHistory: () => {
    const currentShow = get().showHistory;
    if (!currentShow) {
      // If we're showing the history, fetch the latest data
      get().fetchConversions();
    }
    set({ showHistory: !currentShow });
  },
  
  setError: (error) => set({ error })
}));