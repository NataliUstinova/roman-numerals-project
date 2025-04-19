import Conversion, { IConversion } from '../models/Conversion';

// Get a cached conversion if it exists
export const getCachedConversion = async (
  inputValue: string, 
  type: 'roman-to-arabic' | 'arabic-to-roman'
): Promise<IConversion | null> => {
  try {
    return await Conversion.findOne({ inputValue, type });
  } catch (error) {
    console.error('Error getting cached conversion:', error);
    return null;
  }
};

// Save a new conversion to the database
export const saveConversion = async (
  inputValue: string,
  convertedValue: string | number,
  type: 'roman-to-arabic' | 'arabic-to-roman'
): Promise<IConversion> => {
  try {
    const conversion = new Conversion({
      inputValue,
      convertedValue,
      type
    });
    return await conversion.save();
  } catch (error) {
    // If it's a duplicate key error, just return the existing record
    if ((error as any).code === 11000) {
      return (await Conversion.findOne({ inputValue, type }))!;
    }
    throw error;
  }
};

// Get all conversions from the database
export const getAllConversions = async (): Promise<IConversion[]> => {
  try {
    return await Conversion.find().sort({ createdAt: -1 });
  } catch (error) {
    console.error('Error getting all conversions:', error);
    return [];
  }
};

// Remove all conversions from the database
export const removeAllConversions = async (): Promise<number> => {
  try {
    const result = await Conversion.deleteMany({});
    return result.deletedCount || 0;
  } catch (error) {
    console.error('Error removing all conversions:', error);
    throw error;
  }
};