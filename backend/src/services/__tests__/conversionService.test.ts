import { arabicToRoman, romanToArabic, isValidNumber, isValidRoman } from '../conversionService';

describe('Conversion Service', () => {
  describe('arabicToRoman', () => {
    test('should convert basic numbers correctly', () => {
      expect(arabicToRoman(1)).toBe('I');
      expect(arabicToRoman(5)).toBe('V');
      expect(arabicToRoman(10)).toBe('X');
      expect(arabicToRoman(50)).toBe('L');
      expect(arabicToRoman(100)).toBe('C');
      expect(arabicToRoman(500)).toBe('D');
      expect(arabicToRoman(1000)).toBe('M');
    });

    test('should convert complex numbers correctly', () => {
      expect(arabicToRoman(4)).toBe('IV');
      expect(arabicToRoman(9)).toBe('IX');
      expect(arabicToRoman(14)).toBe('XIV');
      expect(arabicToRoman(19)).toBe('XIX');
      expect(arabicToRoman(24)).toBe('XXIV');
      expect(arabicToRoman(40)).toBe('XL');
      expect(arabicToRoman(49)).toBe('XLIX');
      expect(arabicToRoman(90)).toBe('XC');
      expect(arabicToRoman(99)).toBe('XCIX');
      expect(arabicToRoman(400)).toBe('CD');
      expect(arabicToRoman(900)).toBe('CM');
      expect(arabicToRoman(999)).toBe('CMXCIX');
      expect(arabicToRoman(2023)).toBe('MMXXIII');
      expect(arabicToRoman(3999)).toBe('MMMCMXCIX');
    });

    test('should throw error for invalid inputs', () => {
      expect(() => arabicToRoman(0)).toThrow();
      expect(() => arabicToRoman(-1)).toThrow();
      expect(() => arabicToRoman(4000)).toThrow();
    });
  });

  describe('romanToArabic', () => {
    test('should convert basic numerals correctly', () => {
      expect(romanToArabic('I')).toBe(1);
      expect(romanToArabic('V')).toBe(5);
      expect(romanToArabic('X')).toBe(10);
      expect(romanToArabic('L')).toBe(50);
      expect(romanToArabic('C')).toBe(100);
      expect(romanToArabic('D')).toBe(500);
      expect(romanToArabic('M')).toBe(1000);
    });

    test('should convert complex numerals correctly', () => {
      expect(romanToArabic('IV')).toBe(4);
      expect(romanToArabic('IX')).toBe(9);
      expect(romanToArabic('XIV')).toBe(14);
      expect(romanToArabic('XIX')).toBe(19);
      expect(romanToArabic('XXIV')).toBe(24);
      expect(romanToArabic('XL')).toBe(40);
      expect(romanToArabic('XLIX')).toBe(49);
      expect(romanToArabic('XC')).toBe(90);
      expect(romanToArabic('XCIX')).toBe(99);
      expect(romanToArabic('CD')).toBe(400);
      expect(romanToArabic('CM')).toBe(900);
      expect(romanToArabic('CMXCIX')).toBe(999);
      expect(romanToArabic('MMXXIII')).toBe(2023);
      expect(romanToArabic('MMMCMXCIX')).toBe(3999);
    });

    test('should handle case insensitivity', () => {
      expect(romanToArabic('iv')).toBe(4);
      expect(romanToArabic('Ix')).toBe(9);
      expect(romanToArabic('mcmxcix')).toBe(1999);
    });

    test('should throw error for invalid inputs', () => {
      expect(() => romanToArabic('IIII')).toThrow();
      expect(() => romanToArabic('VV')).toThrow();
      expect(() => romanToArabic('IC')).toThrow();
      expect(() => romanToArabic('MMMM')).toThrow();
      expect(() => romanToArabic('XYZ')).toThrow();
    });
  });

  describe('validation functions', () => {
    test('isValidNumber should validate numbers correctly', () => {
      expect(isValidNumber('1')).toBe(true);
      expect(isValidNumber('3999')).toBe(true);
      expect(isValidNumber('0')).toBe(false);
      expect(isValidNumber('4000')).toBe(false);
      expect(isValidNumber('-1')).toBe(false);
      expect(isValidNumber('abc')).toBe(false);
    });

    test('isValidRoman should validate Roman numerals correctly', () => {
      expect(isValidRoman('I')).toBe(true);
      expect(isValidRoman('IV')).toBe(true);
      expect(isValidRoman('MMMCMXCIX')).toBe(true);
      expect(isValidRoman('IIII')).toBe(false);
      expect(isValidRoman('VV')).toBe(false);
      expect(isValidRoman('IC')).toBe(false);
      expect(isValidRoman('MMMM')).toBe(false);
      expect(isValidRoman('XYZ')).toBe(false);
    });
  });
});