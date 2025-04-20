import { useState } from 'react';
import { useConvertToRoman, useConvertToNumber } from '../api/conversionApi';

export function useRomanConverter() {
  const [roman, setRoman] = useState('');
  const [number, setNumber] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'toRoman' | 'toNumber'>('toRoman');

  const toRomanMutation = useConvertToRoman();
  const toNumberMutation = useConvertToNumber();

  const convert = async (value: string): Promise<boolean> => {
    setError('');

    if (mode === 'toRoman') {
      const num = parseInt(value);
      if (isNaN(num)) {
        setError('Please enter a valid number');
        return false;
      }

      try {
        const result = await toRomanMutation.mutateAsync(num.toString());
        setRoman(result.convertedValue);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Conversion failed');
        return false;
      }
    } else {
      const romanValue = value.toUpperCase();
      try {
        const result = await toNumberMutation.mutateAsync(romanValue);
        setNumber(result.convertedValue.toString());
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Conversion failed');
        return false;
      }
    }
  };

  const switchMode = () => {
    setMode(mode === 'toRoman' ? 'toNumber' : 'toRoman');
    setNumber('');
    setRoman('');
    setError('');
  };

  const getValidationRules = () => {
    if (mode === 'toRoman') {
      return {
        required: 'Number is required',
        min: { value: 1, message: 'Number must be at least 1' },
        max: { value: 3999, message: 'Number must be at most 3999' },
      };
    } else {
      return {
        required: 'Roman numeral is required',
        pattern: {
          value: /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i,
          message: 'Invalid Roman numeral format',
        },
      };
    }
  };

  const clearError = () => {
    setError('');
  };

  return {
    roman,
    number,
    error,
    mode,
    loading: toRomanMutation.isPending || toNumberMutation.isPending,
    setRoman,
    setNumber,
    convert,
    switchMode,
    getValidationRules,
    clearError,
  };
}
