import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import FormField from './FormField';

interface RomanInputProps {
  register: UseFormRegister<any>;
  validationRules: any;
  error: any;
}

const RomanInput: React.FC<RomanInputProps> = ({
  register,
  validationRules,
  error,
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
      additionalClasses="uppercase"
    />
  );
};

export default RomanInput;
