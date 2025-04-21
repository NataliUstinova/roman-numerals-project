import React from 'react';
import { render, screen } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import NumberInput from '../NumberInput';

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('NumberInput Component', () => {
  it('renders correctly', () => {
    render(
      <TestWrapper>
        <NumberInput
          register={() => {}}
          validationRules={{}}
          error={null}
          clearError={() => {}}
        />
      </TestWrapper>
    );
    
    expect(screen.getByLabelText('Enter a number (1-3999)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('42...')).toBeInTheDocument();
  });

  it('shows error message when error exists', () => {
    const error = { message: 'Invalid number' };
    
    render(
      <TestWrapper>
        <NumberInput
          register={() => {}}
          validationRules={{}}
          error={error}
          clearError={() => {}}
        />
      </TestWrapper>
    );
    
    expect(screen.getByText('Invalid number')).toBeInTheDocument();
    expect(screen.getByText('Invalid number')).toHaveClass('text-red-600');
  });
});