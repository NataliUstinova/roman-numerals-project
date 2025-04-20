import express from 'express';
import request from 'supertest';

import * as conversionService from '../../services/conversionService';
import * as dbService from '../../services/dbService';
import {
  convertToRoman,
  convertToArabic,
  getAll,
  removeAll,
} from '../conversionController';

const app = express();
app.use(express.json());
app.get('/roman/:inputValue', convertToRoman);
app.get('/arabic/:inputValue', convertToArabic);
app.get('/all', getAll);
app.delete('/remove', removeAll);

jest.mock('../../services/conversionService');
jest.mock('../../services/dbService');

describe('Conversion Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('convertToRoman', () => {
    it('should return 400 for invalid number', async () => {
      (conversionService.isValidNumber as jest.Mock).mockReturnValue(false);
      const res = await request(app).get('/roman/abc');
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Input must be a number between 1 and 3999');
    });

    it('should return cached result if available', async () => {
      (conversionService.isValidNumber as jest.Mock).mockReturnValue(true);
      (dbService.getCachedConversion as jest.Mock).mockResolvedValue({
        convertedValue: 'X',
      });
      const res = await request(app).get('/roman/10');
      expect(res.body.cached).toBe(true);
      expect(res.body.convertedValue).toBe('X');
    });

    it('should convert and save if not cached', async () => {
      (conversionService.isValidNumber as jest.Mock).mockReturnValue(true);
      (dbService.getCachedConversion as jest.Mock).mockResolvedValue(null);
      (conversionService.arabicToRoman as jest.Mock).mockReturnValue('X');
      (dbService.saveConversion as jest.Mock).mockResolvedValue(undefined);
      const res = await request(app).get('/roman/10');
      expect(res.body.cached).toBe(false);
      expect(res.body.convertedValue).toBe('X');
      expect(conversionService.arabicToRoman as jest.Mock).toHaveBeenCalledWith(
        10,
      );
      expect(dbService.saveConversion as jest.Mock).toHaveBeenCalledWith(
        '10',
        'X',
        'arabic-to-roman',
      );
    });
    it('should handle errors and return 500', async () => {
      (conversionService.isValidNumber as jest.Mock).mockImplementation(() => {
        throw new Error('Test error');
      });
      const res = await request(app).get('/roman/10');
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Test error');
    });
  });

  describe('convertToArabic', () => {
    it('should return 400 for invalid roman numeral', async () => {
      (conversionService.isValidRoman as jest.Mock).mockReturnValue(false);
      const res = await request(app).get('/arabic/invalid');
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid Roman numeral');
    });

    it('should return cached result if available', async () => {
      (conversionService.isValidRoman as jest.Mock).mockReturnValue(true);
      (dbService.getCachedConversion as jest.Mock).mockResolvedValue({
        convertedValue: 10,
      });
      const res = await request(app).get('/arabic/X');
      expect(res.body.cached).toBe(true);
      expect(res.body.convertedValue).toBe(10);
    });

    it('should convert and save if not cached', async () => {
      (conversionService.isValidRoman as jest.Mock).mockReturnValue(true);
      (dbService.getCachedConversion as jest.Mock).mockResolvedValue(null);
      (conversionService.romanToArabic as jest.Mock).mockReturnValue(10);
      (dbService.saveConversion as jest.Mock).mockResolvedValue(undefined);
      const res = await request(app).get('/arabic/X');
      expect(res.body.cached).toBe(false);
      expect(res.body.convertedValue).toBe(10);
      expect(conversionService.romanToArabic as jest.Mock).toHaveBeenCalledWith(
        'X',
      );
      expect(dbService.saveConversion as jest.Mock).toHaveBeenCalledWith(
        'X',
        10,
        'roman-to-arabic',
      );
    });
    it('should handle errors and return 500', async () => {
      (conversionService.isValidRoman as jest.Mock).mockImplementation(() => {
        throw new Error('Test error');
      });
      const res = await request(app).get('/arabic/X');
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Test error');
    });
  });

  describe('getAll', () => {
    it('should return all conversions', async () => {
      (dbService.getAllConversions as jest.Mock).mockResolvedValue([
        { inputValue: '10', convertedValue: 'X' },
      ]);
      const res = await request(app).get('/all');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
    it('should handle errors and return 500', async () => {
      (dbService.getAllConversions as jest.Mock).mockRejectedValue(
        new Error('Test error'),
      );
      const res = await request(app).get('/all');
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Test error');
    });
  });

  describe('removeAll', () => {
    it('should remove all conversions', async () => {
      (dbService.removeAllConversions as jest.Mock).mockResolvedValue(3);
      const res = await request(app).delete('/remove');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('Successfully deleted 3 records');
    });
    it('should handle errors and return 500', async () => {
      (dbService.removeAllConversions as jest.Mock).mockRejectedValue(
        new Error('Test error'),
      );
      const res = await request(app).delete('/remove');
      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Test error');
    });
  });
});
