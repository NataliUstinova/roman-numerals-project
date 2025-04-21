import { renderHook, act } from '@testing-library/react';
import { useRomanConverter } from '../useRomanConverter';
import { useConvertToRoman, useConvertToNumber } from '../../api/conversionApi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

jest.mock('../../api/conversionApi');

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(
    QueryClientProvider,
    { client: queryClient },
    children,
  );
};

describe('useRomanConverter', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Set default mock implementations with isPending property
    (useConvertToRoman as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    });

    (useConvertToNumber as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    });
  });

  it('should convert number to Roman numeral', async () => {
    const mockConvertToRoman = jest
      .fn()
      .mockResolvedValue({ convertedValue: 'XLII' });
    (useConvertToRoman as jest.Mock).mockReturnValue({
      mutateAsync: mockConvertToRoman,
      isPending: false,
    });

    const { result } = renderHook(() => useRomanConverter(), { wrapper });

    await act(async () => {
      await result.current.convert('42');
    });

    expect(mockConvertToRoman).toHaveBeenCalledWith('42');
    expect(result.current.roman).toBe('XLII');
  });

  it('should convert Roman numeral to number', async () => {
    const mockConvertToNumber = jest
      .fn()
      .mockResolvedValue({ convertedValue: '42' });
    (useConvertToNumber as jest.Mock).mockReturnValue({
      mutateAsync: mockConvertToNumber,
      isPending: false,
    });

    const { result } = renderHook(() => useRomanConverter(), { wrapper });

    // Switch mode first
    act(() => {
      result.current.switchMode();
    });

    await act(async () => {
      await result.current.convert('XLII');
    });

    expect(mockConvertToNumber).toHaveBeenCalledWith('XLII');
    expect(result.current.number).toBe('42');
  });

  it('should switch mode between toRoman and toNumber', () => {
    const { result } = renderHook(() => useRomanConverter(), { wrapper });

    expect(result.current.mode).toBe('toRoman');

    act(() => {
      result.current.switchMode();
    });

    expect(result.current.mode).toBe('toNumber');
    expect(result.current.number).toBe('');
    expect(result.current.roman).toBe('');
    expect(result.current.error).toBe('');
  });

  // Test for lines 19-20: NaN handling
  it('should handle invalid number input', async () => {
    const { result } = renderHook(() => useRomanConverter(), { wrapper });

    let success;
    await act(async () => {
      success = await result.current.convert('not a number');
    });

    expect(success).toBe(false);
    expect(result.current.error).toBe('Please enter a valid number');
  });

  // Test for lines 28-29: API error handling for toRoman
  it('should handle API error when converting to Roman', async () => {
    const mockError = new Error('API Error');
    const mockConvertToRoman = jest.fn().mockRejectedValue(mockError);

    (useConvertToRoman as jest.Mock).mockReturnValue({
      mutateAsync: mockConvertToRoman,
      isPending: false,
    });

    const { result } = renderHook(() => useRomanConverter(), { wrapper });

    let success;
    await act(async () => {
      success = await result.current.convert('42');
    });

    expect(success).toBe(false);
    expect(result.current.error).toBe('API Error');
  });

  // Test for lines 38-39: API error handling for toNumber
  it('should handle API error when converting to number', async () => {
    const mockError = new Error('Invalid Roman numeral');
    const mockConvertToNumber = jest.fn().mockRejectedValue(mockError);

    (useConvertToNumber as jest.Mock).mockReturnValue({
      mutateAsync: mockConvertToNumber,
      isPending: false,
    });

    const { result } = renderHook(() => useRomanConverter(), { wrapper });

    // Switch mode first
    act(() => {
      result.current.switchMode();
    });

    let success;
    await act(async () => {
      success = await result.current.convert('XLII');
    });

    expect(success).toBe(false);
    expect(result.current.error).toBe('Invalid Roman numeral');
  });

  // Test for lines 52-59: Validation rules
  it('should return correct validation rules for toRoman mode', () => {
    const { result } = renderHook(() => useRomanConverter(), { wrapper });

    const rules = result.current.getValidationRules();

    expect(rules).toHaveProperty('required', 'Number is required');
    expect(rules).toHaveProperty('min.value', 1);
    expect(rules).toHaveProperty('min.message', 'Number must be at least 1');
    expect(rules).toHaveProperty('max.value', 3999);
    expect(rules).toHaveProperty('max.message', 'Number must be at most 3999');
  });

  it('should return correct validation rules for toNumber mode', () => {
    const { result } = renderHook(() => useRomanConverter(), { wrapper });

    act(() => {
      result.current.switchMode();
    });

    const rules = result.current.getValidationRules();

    expect(rules).toHaveProperty('required', 'Roman numeral is required');
    expect(rules).toHaveProperty('pattern.value');
    expect(rules.pattern.value).toBeInstanceOf(RegExp);
    expect(rules).toHaveProperty(
      'pattern.message',
      'Invalid Roman numeral format',
    );
  });

  // Test for line 70: clearError function
  it('should clear error', () => {
    const { result } = renderHook(() => useRomanConverter(), { wrapper });

    act(() => {
      // Set error manually first
      result.current.convert('not a number');
    });

    // Verify error exists
    expect(result.current.error).toBeTruthy();

    act(() => {
      result.current.clearError();
    });

    // Verify error is cleared
    expect(result.current.error).toBe('');
  });

  // Test for the setRoman and setNumber functions
  it('should set Roman numeral value', () => {
    const { result } = renderHook(() => useRomanConverter(), { wrapper });

    act(() => {
      result.current.setRoman('IV');
    });

    expect(result.current.roman).toBe('IV');
  });

  it('should set number value', () => {
    const { result } = renderHook(() => useRomanConverter(), { wrapper });

    act(() => {
      result.current.setNumber('4');
    });

    expect(result.current.number).toBe('4');
  });

  // Test loading state
  it('should reflect loading state from mutations', () => {
    (useConvertToRoman as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: true,
    });

    const { result } = renderHook(() => useRomanConverter(), { wrapper });

    expect(result.current.loading).toBe(true);
  });
});
