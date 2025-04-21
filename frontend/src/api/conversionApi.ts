import { queryKeys } from './queryKeys';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Conversion {
  _id: string;
  inputValue: string;
  convertedValue: string;
  type: string;
  createdAt: string;
  __v: number;
}

// Base API functions
export const api = {
  convertToRoman: async (number: string): Promise<Conversion> => {
    const response = await fetch(`/roman/${number}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || 'Failed to convert number to Roman numeral',
      );
    }

    return await response.json();
  },

  convertToNumber: async (roman: string): Promise<Conversion> => {
    const response = await fetch(`/arabic/${roman}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || 'Failed to convert Roman numeral to number',
      );
    }

    return await response.json();
  },

  fetchAllConversions: async () => {
    const response = await fetch('/all');

    if (!response.ok) {
      throw new Error('Failed to fetch conversions');
    }

    return await response.json();
  },

  removeAllConversions: async () => {
    const response = await fetch('/remove', {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to remove conversions');
    }

    return true;
  },
};

// React Query hooks
export const useConversions = showHistory => {
  return useQuery({
    queryKey: queryKeys.conversions.list(),
    queryFn: api.fetchAllConversions,
    enabled: showHistory,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useConvertToRoman = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.convertToRoman,
    onSuccess: () => {
      // Invalidate conversions list to refresh after a new conversion
      queryClient.invalidateQueries({ queryKey: queryKeys.conversions.all });
    },
  });
};

export const useConvertToNumber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.convertToNumber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.conversions.all });
    },
  });
};

export const useRemoveAllConversions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.removeAllConversions,
    onSuccess: () => {
      // Reset conversions list after removal
      queryClient.setQueryData(queryKeys.conversions.list(), []);
    },
  });
};
