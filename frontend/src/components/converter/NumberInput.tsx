import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import FormField from './FormField';

interface NumberInputProps {
  register: UseFormRegister<any>;
  validationRules: any;
  error: any;
  clearError: () => void;
}

const NumberInput: React.FC<NumberInputProps> = ({ 
  register, 
  validationRules, 
  error, 
  clearError 
}) => {
  return (
    <FormField
      id="number"
      label="Enter a number (1-3999)"
      type="number"
      placeholder="42..."
      register={register}
      validationRules={validationRules}
      error={error}
      clearError={clearError}
    />
  );
};

export default NumberInput;