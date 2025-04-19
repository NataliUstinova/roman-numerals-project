// Conversion service for Roman Numerals Converter

// Function to convert Arabic number to Roman numeral
export const arabicToRoman = (num: number): string => {
  if (num <= 0 || num > 3999) {
    throw new Error('Number must be between 1 and 3999');
  }

  const romanNumerals: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
  ];

  let result = '';
  let remaining = num;

  for (const [value, symbol] of romanNumerals) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }

  return result;
};

// Function to convert Roman numeral to Arabic number
export const romanToArabic = (roman: string): number => {
  const romanMap: Record<string, number> = {
    'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000
  };

  // Validate Roman numeral format
  const validRomanRegex = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i;
  if (!validRomanRegex.test(roman)) {
    throw new Error('Invalid Roman numeral');
  }

  let result = 0;
  const upperRoman = roman.toUpperCase();

  for (let i = 0; i < upperRoman.length; i++) {
    const current = romanMap[upperRoman[i]];
    const next = romanMap[upperRoman[i + 1]];

    if (next && current < next) {
      result += next - current;
      i++;
    } else {
      result += current;
    }
  }

  return result;
};

// Validate if a string is a valid number
export const isValidNumber = (value: string): boolean => {
  return !isNaN(Number(value)) && Number(value) > 0 && Number(value) <= 3999;
};

// Validate if a string is a valid Roman numeral
export const isValidRoman = (value: string): boolean => {
  const validRomanRegex = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i;
  return validRomanRegex.test(value);
};