import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import FormField from './FormField';

interface RomanInputProps {
  register: UseFormRegister<any>;
  validationRules: any;
  error: any;
  clearError: () => void;
}

const RomanInput: React.FC<RomanInputProps> = ({ 
  register, 
  validationRules, 
  error, 
  clearError 
}) => {
  return (
    <FormField
      id="roman"
      label="Enter a Roman numeral"
      type="text"
      placeholder="XLII..."
      register={register}
      validationRules={validationRules}
      error={error}
      clearError={clearError}
      additionalClasses="uppercase"
    />
  );
};

export default RomanInput;