import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useConversionHistory } from '../useConversionHistory';
import {
  useConversions,
  useRemoveAllConversions,
} from '../../api/conversionApi';
import { useHistoryStore } from '../../store/historyStore';
import React from 'react';

jest.mock('../../api/conversionApi');
jest.mock('../../store/historyStore');

// Mock fetch globally
global.fetch = jest.fn();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(
    QueryClientProvider,
    { client: queryClient },
    children,
  );
};

describe('useConversionHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useHistoryStore as jest.Mock).mockReturnValue({
      showHistory: true,
      toggleHistory: jest.fn(),
    });
  });

  it('should fetch conversions when history is visible', () => {
    const mockConversions = [
      { id: 1, inputValue: '42', convertedValue: 'XLII' },
    ];
    (useConversions as jest.Mock).mockReturnValue({
      data: mockConversions,
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useConversionHistory(), { wrapper });

    expect(result.current.conversions).toEqual(mockConversions);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should clear history successfully', async () => {
    const mockRemoveAll = jest.fn().mockResolvedValue(true);
    (useRemoveAllConversions as jest.Mock).mockReturnValue({
      mutateAsync: mockRemoveAll,
    });

    const { result } = renderHook(() => useConversionHistory(), { wrapper });

    await act(async () => {
      await result.current.handleClearHistory();
    });

    expect(mockRemoveAll).toHaveBeenCalled();
  });
});
