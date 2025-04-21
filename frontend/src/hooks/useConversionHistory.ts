import { useQueryClient } from '@tanstack/react-query';
import { useConversions, useRemoveAllConversions } from '../api/conversionApi';
import { useHistoryStore } from '../store/historyStore';
import { queryKeys } from '../api/queryKeys';

export function useConversionHistory() {
  const { showHistory, toggleHistory } = useHistoryStore();
  const queryClient = useQueryClient();

  // Only fetch when history is visible
  const { data: conversions, isLoading, error } = useConversions(showHistory);

  const removeAllMutation = useRemoveAllConversions();

  const handleClearHistory = async () => {
    try {
      await removeAllMutation.mutateAsync();
      // Clear the cache after removal
      queryClient.setQueryData(queryKeys.conversions.list(), []);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  return {
    conversions: conversions || [],
    isLoading,
    error,
    showHistory,
    toggleHistory,
    handleClearHistory,
  };
}
