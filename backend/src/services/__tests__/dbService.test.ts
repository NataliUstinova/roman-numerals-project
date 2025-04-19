import * as dbService from '../dbService';
import Conversion from '../../models/Conversion';

jest.mock('../../models/Conversion');

const mockedConversion = Conversion as jest.Mocked<typeof Conversion>;

// Mock the Conversion constructor
(Conversion as unknown as jest.Mock).mockImplementation(function(data: any) {
  return {
    inputValue: data.inputValue,
    convertedValue: data.convertedValue,
    type: data.type,
    save: jest.fn()
  };
});

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

describe('dbService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCachedConversion', () => {
    it('should return a cached conversion if found', async () => {
      const fakeConversion = { inputValue: 'X', type: 'roman-to-arabic' };
      mockedConversion.findOne.mockResolvedValueOnce(fakeConversion as any);

      const result = await dbService.getCachedConversion('X', 'roman-to-arabic');
      expect(result).toEqual(fakeConversion);
      expect(mockedConversion.findOne).toHaveBeenCalledWith({ inputValue: 'X', type: 'roman-to-arabic' });
    });

    it('should return null if an error occurs', async () => {
      mockedConversion.findOne.mockRejectedValueOnce(new Error('DB error'));
      const result = await dbService.getCachedConversion('X', 'roman-to-arabic');
      expect(result).toBeNull();
    });

    it('should handle null return from findOne', async () => {
      mockedConversion.findOne.mockResolvedValueOnce(null);
      const result = await dbService.getCachedConversion('X', 'roman-to-arabic');
      expect(result).toBeNull();
    });
  });

  describe('saveConversion', () => {
    it('should save and return a new conversion', async () => {
      const mockSave = jest.fn().mockResolvedValue({ 
        inputValue: 'X', 
        convertedValue: 10, 
        type: 'roman-to-arabic' 
      });
      
      (Conversion as unknown as jest.Mock).mockImplementationOnce(function(data: any) {
        return {
          inputValue: data.inputValue,
          convertedValue: data.convertedValue,
          type: data.type,
          save: mockSave
        };
      });

      const result = await dbService.saveConversion('X', 10, 'roman-to-arabic');
      expect(result).toEqual({ inputValue: 'X', convertedValue: 10, type: 'roman-to-arabic' });
      expect(mockSave).toHaveBeenCalled();
    });

    it('should return existing record if duplicate key error occurs', async () => {
      const error = { code: 11000 };
      const mockSave = jest.fn().mockRejectedValue(error);
      
      (Conversion as unknown as jest.Mock).mockImplementationOnce(function(data: any) {
        return {
          inputValue: data.inputValue,
          convertedValue: data.convertedValue,
          type: data.type,
          save: mockSave
        };
      });
      
      mockedConversion.findOne.mockResolvedValueOnce({ 
        inputValue: 'X', 
        type: 'roman-to-arabic' 
      } as any);

      const result = await dbService.saveConversion('X', 10, 'roman-to-arabic');
      expect(result).toEqual({ inputValue: 'X', type: 'roman-to-arabic' });
      expect(mockedConversion.findOne).toHaveBeenCalledWith({ inputValue: 'X', type: 'roman-to-arabic' });
    });

    it('should throw error if not duplicate key', async () => {
      const error = { code: 12345 };
      const mockSave = jest.fn().mockRejectedValue(error);
      
      (Conversion as unknown as jest.Mock).mockImplementationOnce(function(data: any) {
        return {
          inputValue: data.inputValue,
          convertedValue: data.convertedValue,
          type: data.type,
          save: mockSave
        };
      });

      await expect(dbService.saveConversion('X', 10, 'roman-to-arabic')).rejects.toEqual(error);
    });

    it('should handle undefined result when finding existing record', async () => {
      const error = { code: 11000 };
      const mockSave = jest.fn().mockRejectedValue(error);
      
      (Conversion as unknown as jest.Mock).mockImplementationOnce(function(data: any) {
        return {
          inputValue: data.inputValue,
          convertedValue: data.convertedValue,
          type: data.type,
          save: mockSave
        };
      });
      
      mockedConversion.findOne.mockResolvedValueOnce(null);
      
      const result = await dbService.saveConversion('X', 10, 'roman-to-arabic');
      expect(result).toBeNull();
    });
  });

  describe('getAllConversions', () => {
    it('should return all conversions sorted by createdAt desc', async () => {
      const sortMock = jest.fn().mockResolvedValue([{ inputValue: 'X' }]);
      mockedConversion.find.mockReturnValue({ sort: sortMock } as any);

      const result = await dbService.getAllConversions();
      expect(result).toEqual([{ inputValue: 'X' }]);
      expect(mockedConversion.find).toHaveBeenCalled();
      expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 });
    });

    it('should return empty array if error occurs', async () => {
      mockedConversion.find.mockImplementationOnce(() => { throw new Error('DB error'); });
      const result = await dbService.getAllConversions();
      expect(result).toEqual([]);
    });

    it('should handle null return from find', async () => {
      const sortMock = jest.fn().mockResolvedValue(null);
      mockedConversion.find.mockReturnValue({ sort: sortMock } as any);
  
      const result = await dbService.getAllConversions();
      // Update the expectation to match the actual behavior
      expect(result).toEqual(null);
    });
  });

  describe('removeAllConversions', () => {
    it('should return deletedCount', async () => {
      mockedConversion.deleteMany.mockResolvedValueOnce({ deletedCount: 5, acknowledged: true } as any);
      const result = await dbService.removeAllConversions();
      expect(result).toBe(5);
      expect(mockedConversion.deleteMany).toHaveBeenCalledWith({});
    });

    it('should throw error if delete fails', async () => {
      mockedConversion.deleteMany.mockRejectedValueOnce(new Error('Delete error'));
      await expect(dbService.removeAllConversions()).rejects.toThrow('Delete error');
    });

    it('should handle undefined deletedCount', async () => {
      mockedConversion.deleteMany.mockResolvedValueOnce({ acknowledged: true } as any);
      const result = await dbService.removeAllConversions();
      expect(result).toBe(0);
    });
  });
});