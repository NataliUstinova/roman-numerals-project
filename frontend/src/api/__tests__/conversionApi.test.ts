import { api } from '../conversionApi';
import {
  useConvertToRoman,
  useConvertToNumber,
  useConversions,
  useRemoveAllConversions,
} from '../conversionApi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React, { act } from 'react';

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

describe('conversionApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  describe('api functions', () => {
    it('should convert number to Roman numeral successfully', async () => {
      const mockResponse = { convertedValue: 'XLII' };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api.convertToRoman('42');
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith('/roman/42');
    });

    it('should handle conversion errors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Invalid input' }),
      });

      await expect(api.convertToRoman('abc')).rejects.toThrow('Invalid input');
    });
  });

  describe('React Query hooks', () => {
    it('should fetch conversions when enabled', async () => {
      const mockConversions = [
        { id: 1, inputValue: '42', convertedValue: 'XLII' },
      ];
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockConversions),
      });

      const { result } = renderHook(() => useConversions(true), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockConversions);
    });

    it('should convert to Roman numeral', async () => {
      const mockResponse = { convertedValue: 'XLII' };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useConvertToRoman(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync('42');
      });

      expect(fetch).toHaveBeenCalledWith('/roman/42');
    });

    it('should convert to number', async () => {
      const mockResponse = { convertedValue: '42' };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useConvertToNumber(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync('XLII');
      });

      expect(fetch).toHaveBeenCalledWith('/arabic/XLII');
    });

    it('should remove all conversions and reset cache', async () => {
      const { result } = renderHook(() => useRemoveAllConversions(), {
        wrapper,
      });

      (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

      await act(async () => {
        await result.current.mutateAsync();
      });

      expect(fetch).toHaveBeenCalledWith('/remove', { method: 'DELETE' });
      expect(queryClient.getQueryData(['conversions', 'list'])).toEqual([]);
    });
  });

  it('should handle fetchAllConversions error', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(api.fetchAllConversions()).rejects.toThrow('Failed to fetch conversions');
  });

  it('should handle removeAllConversions error', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(api.removeAllConversions()).rejects.toThrow('Failed to remove conversions');
  });

  it('should handle convertToNumber error', async () => {
    const mockError = { error: 'Invalid Roman numeral' };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => mockError,
    });

    await expect(api.convertToNumber('INVALID')).rejects.toThrow('Invalid Roman numeral');
  });

  it('should handle convertToRoman error with custom message', async () => {
    const mockError = { error: 'Invalid number' };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => mockError,
    });

    await expect(api.convertToRoman('abc')).rejects.toThrow('Invalid number');
  });

  it('should handle convertToRoman error with default message', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    await expect(api.convertToRoman('abc')).rejects.toThrow('Failed to convert number to Roman numeral');
  });
});
