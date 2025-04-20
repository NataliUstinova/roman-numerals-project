import { useState } from 'react';

interface ConversionResponse {
  convertedValue: string;
  [key: string]: any;
}

export function useRomanConverter() {
  const [roman, setRoman] = useState('');
  const [number, setNumber] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'toRoman' | 'toNumber'>('toRoman');
  const [loading, setLoading] = useState(false);

  const makeConversionRequest = async (
    endpoint: string,
    value: string,
  ): Promise<ConversionResponse | null> => {
    try {
      setLoading(true);
      const response = await fetch(`/${endpoint}/${value}`);

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.error ||
            `Failed to convert ${
              endpoint === 'roman' ? 'number' : 'Roman numeral'
            }`,
        );
        return null;
      }

      return await response.json();
    } catch (err) {
      console.error('Conversion error:', err);
      setError(err instanceof Error ? err.message : 'Conversion failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const convert = async (value: string): Promise<boolean> => {
    setError('');

    if (mode === 'toRoman') {
      const num = parseInt(value);
      if (isNaN(num)) {
        setError('Please enter a valid number');
        return false;
      }

      const responseData = await makeConversionRequest('roman', num.toString());
      if (responseData) {
        setRoman(responseData.convertedValue);
        return true;
      }
    } else {
      const romanValue = value.toUpperCase();
      const responseData = await makeConversionRequest('arabic', romanValue);
      if (responseData) {
        setNumber(responseData.convertedValue.toString());
        return true;
      }
    }

    return false;
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
    loading,
    setRoman,
    setNumber,
    convert,
    switchMode,
    getValidationRules,
    clearError,
  };
}
