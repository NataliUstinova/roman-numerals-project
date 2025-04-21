import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RomanInput from '../RomanInput';

describe('RomanInput Component', () => {
  const mockRegister = jest.fn().mockReturnValue({
    name: 'roman',
    onChange: jest.fn(),
    onBlur: jest.fn(),
    ref: jest.fn(),
  });
  
  const mockValidationRules = {
    required: 'Roman numeral is required',
    pattern: {
      value: /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i,
      message: 'Invalid Roman numeral format',
    },
  };
  
  const mockClearError = jest.fn();
  
  it('renders the input field correctly', () => {
    render(
      <RomanInput 
        register={mockRegister} 
        validationRules={mockValidationRules} 
        error={null} 
        clearError={mockClearError} 
      />
    );
    
    expect(screen.getByLabelText(/Roman Numeral/i)).toBeInTheDocument();
  });
  
  it('displays error message when there is an error', () => {
    const error = { message: 'Invalid Roman numeral format' };
    
    render(
      <RomanInput 
        register={mockRegister} 
        validationRules={mockValidationRules} 
        error={error} 
        clearError={mockClearError} 
      />
    );
    
    expect(screen.getByText('Invalid Roman numeral format')).toBeInTheDocument();
  });
  
  it('calls clearError when input changes', () => {
    render(
      <RomanInput 
        register={mockRegister} 
        validationRules={mockValidationRules} 
        error={null} 
        clearError={mockClearError} 
      />
    );
    
    fireEvent.change(screen.getByLabelText(/Roman Numeral/i), { target: { value: 'IV' } });
    expect(mockClearError).toHaveBeenCalled();
  });
});