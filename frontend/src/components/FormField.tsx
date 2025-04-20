import React from 'react';

interface FormFieldProps {
  label: string;
  register: any;
  name: string;
  validation: any;
  error: any;
  placeholder: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  register,
  name,
  validation,
  error,
  placeholder,
  type = 'text',
  onChange,
  value,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      {...register(name, validation)}
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-3! focus:ring-indigo-500! focus:border-indigo-500!"
      placeholder={placeholder}
      onChange={onChange}
      value={value}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
  </div>
);

export default FormField;
