import mongoose, { Document, Schema } from 'mongoose';

export interface IConversion extends Document {
  inputValue: string;
  convertedValue: string | number;
  type: 'roman-to-arabic' | 'arabic-to-roman';
  createdAt: Date;
}

const ConversionSchema: Schema = new Schema({
  inputValue: { type: String, required: true },
  convertedValue: { type: Schema.Types.Mixed, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['roman-to-arabic', 'arabic-to-roman'] 
  },
  createdAt: { type: Date, default: Date.now }
});

// Create a compound index for caching purposes
ConversionSchema.index({ inputValue: 1, type: 1 }, { unique: true });

export default mongoose.model<IConversion>('Conversion', ConversionSchema);