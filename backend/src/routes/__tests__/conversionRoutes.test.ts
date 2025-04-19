import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../index';
import Conversion from '../../models/Conversion';

// Mock mongoose
jest.mock('mongoose', () => {
  const originalMongoose = jest.requireActual('mongoose');
  return {
    ...originalMongoose,
    connect: jest.fn().mockResolvedValue({}),
    connection: {
      close: jest.fn().mockResolvedValue({}),
    },
  };
});

// Mock the database service
jest.mock('../../services/dbService', () => ({
  getCachedConversion: jest.fn().mockImplementation(async (inputValue, type) => {
    if (inputValue === '42' && type === 'arabic-to-roman') {
      return {
        inputValue: '42',
        convertedValue: 'XLII',
        type: 'arabic-to-roman'
      };
    }
    if (inputValue === 'XLII' && type === 'roman-to-arabic') {
      return {
        inputValue: 'XLII',
        convertedValue: 42,
        type: 'roman-to-arabic'
      };
    }
    return null;
  }),
  saveConversion: jest.fn().mockImplementation(async (inputValue, convertedValue, type) => {
    return {
      inputValue,
      convertedValue,
      type
    };
  }),
  getAllConversions: jest.fn().mockResolvedValue([
    {
      inputValue: '42',
      convertedValue: 'XLII',
      type: 'arabic-to-roman',
      createdAt: new Date()
    },
    {
      inputValue: 'XLII',
      convertedValue: 42,
      type: 'roman-to-arabic',
      createdAt: new Date()
    }
  ]),
  removeAllConversions: jest.fn().mockResolvedValue(2)
}));

describe('Conversion Routes', () => {
  beforeAll(async () => {
    // No need to connect to a real database
    // The mongoose.connect is already mocked
  });

  afterAll(async () => {
    // Using the mocked close function
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Mock the Conversion.deleteMany instead of actually calling it
    jest.spyOn(Conversion, 'deleteMany').mockResolvedValue({ deletedCount: 0 } as any);
  });

  describe('GET /roman/:inputValue', () => {
    test('should convert valid Arabic number to Roman numeral', async () => {
      const response = await request(app).get('/roman/10');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        inputValue: 10,
        convertedValue: 'X',
        cached: false
      });
    });

    test('should return cached value if available', async () => {
      const response = await request(app).get('/roman/42');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        inputValue: 42,
        convertedValue: 'XLII',
        cached: true
      });
    });

    test('should return 400 for invalid input', async () => {
      const response = await request(app).get('/roman/abc');
      expect(response.status).toBe(400);
    });
  });

  describe('GET /arabic/:inputValue', () => {
    test('should convert valid Roman numeral to Arabic number', async () => {
      const response = await request(app).get('/arabic/X');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        inputValue: 'X',
        convertedValue: 10,
        cached: false
      });
    });

    test('should return cached value if available', async () => {
      const response = await request(app).get('/arabic/XLII');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        inputValue: 'XLII',
        convertedValue: 42,
        cached: true
      });
    });

    test('should return 400 for invalid input', async () => {
      const response = await request(app).get('/arabic/XYZ');
      expect(response.status).toBe(400);
    });
  });

  describe('GET /all', () => {
    test('should return all conversions', async () => {
      const response = await request(app).get('/all');
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });
  });

  describe('DELETE /remove', () => {
    test('should remove all conversions', async () => {
      const response = await request(app).delete('/remove');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: 'Successfully deleted 2 records'
      });
    });
  });
});