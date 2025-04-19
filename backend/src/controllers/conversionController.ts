import { Request, Response } from 'express';

import {
  arabicToRoman,
  romanToArabic,
  isValidNumber,
  isValidRoman,
} from '../services/conversionService';
import {
  getCachedConversion,
  saveConversion,
  getAllConversions,
  removeAllConversions,
} from '../services/dbService';

// Controller for converting Arabic to Roman
export const convertToRoman = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { inputValue } = req.params;

    // Validate input
    if (!isValidNumber(inputValue)) {
      res
        .status(400)
        .json({ error: 'Input must be a number between 1 and 3999' });
      return;
    }

    const numericValue = Number(inputValue);

    // Check cache first
    const cached = await getCachedConversion(inputValue, 'arabic-to-roman');
    if (cached) {
      res.json({
        inputValue: numericValue,
        convertedValue: cached.convertedValue,
        cached: true,
      });
      return;
    }

    // Convert and save
    const romanValue = arabicToRoman(numericValue);
    await saveConversion(inputValue, romanValue, 'arabic-to-roman');

    res.json({
      inputValue: numericValue,
      convertedValue: romanValue,
      cached: false,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Controller for converting Roman to Arabic
export const convertToArabic = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { inputValue } = req.params;

    // Validate input
    if (!isValidRoman(inputValue)) {
      res.status(400).json({ error: 'Invalid Roman numeral' });
      return;
    }

    // Check cache first
    const cached = await getCachedConversion(
      inputValue.toUpperCase(),
      'roman-to-arabic',
    );
    if (cached) {
      res.json({
        inputValue: inputValue.toUpperCase(),
        convertedValue: cached.convertedValue,
        cached: true,
      });
      return;
    }

    // Convert and save
    const arabicValue = romanToArabic(inputValue);
    await saveConversion(
      inputValue.toUpperCase(),
      arabicValue,
      'roman-to-arabic',
    );

    res.json({
      inputValue: inputValue.toUpperCase(),
      convertedValue: arabicValue,
      cached: false,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Controller for getting all conversions
export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const conversions = await getAllConversions();
    res.json(conversions);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Controller for removing all conversions
export const removeAll = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const deletedCount = await removeAllConversions();
    res.json({
      success: true,
      message: `Successfully deleted ${deletedCount} records`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
};
