import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, useRemoveAllConversions } from '../api/conversionApi';
import { useHistoryStore } from '../store/historyStore';
import { queryKeys } from '../api/queryKeys';

export function useConversionHistory() {
  const { showHistory, toggleHistory } = useHistoryStore();
  const queryClient = useQueryClient();

  // Only fetch when history is visible
  const {
    data: conversions,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.conversions.list(),
    queryFn: api.fetchAllConversions,
    enabled: showHistory,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

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
