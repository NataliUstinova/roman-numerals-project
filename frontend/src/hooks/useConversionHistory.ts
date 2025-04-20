import { useHistoryStore } from '../store/historyStore';

export function useConversionHistory() {
  const {
    conversions,
    showHistory,
    loading,
    error,
    fetchConversions,
    removeAllConversions,
    toggleHistory,
  } = useHistoryStore();

  const fetchAll = async () => {
    toggleHistory();
  };

  const removeAll = async () => {
    await removeAllConversions();
  };

  const refreshHistory = async () => {
    if (showHistory) {
      await fetchConversions();
    }
  };

  return {
    conversions,
    showHistory,
    loading,
    error,
    fetchAll,
    removeAll,
    refreshHistory,
  };
}
