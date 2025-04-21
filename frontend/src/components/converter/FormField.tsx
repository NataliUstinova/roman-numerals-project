import React from 'react';
import { UseFormRegister } from 'react-hook-form';

interface FormFieldProps {
  id: string;
  label: string;
  type: 'text' | 'number';
  placeholder: string;
  register: UseFormRegister<any>;
  validationRules: any;
  error: any;
  clearError: () => void;
  additionalClasses?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type,
  placeholder,
  register,
  validationRules,
  error,
  clearError,
  additionalClasses = '',
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        {...register(id, validationRules)}
        className={`w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${additionalClasses}`}
        placeholder={placeholder}
        onChange={clearError}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message as string}
        </p>
      )}
    </div>
  );
};

export default FormField;