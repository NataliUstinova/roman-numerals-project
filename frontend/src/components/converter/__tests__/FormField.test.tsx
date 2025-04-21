import React from 'react';
import { render, screen } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import FormField from '../FormField';

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('FormField Component', () => {
  it('renders correctly', () => {
    render(
      <TestWrapper>
        <FormField
          id="test"
          label="Test Label"
          type="text"
          placeholder="Test placeholder"
          register={() => {}}
          validationRules={{}}
          error={null}
          clearError={() => {}}
        />
      </TestWrapper>
    );
    
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument();
  });

  it('shows error message when error exists', () => {
    const error = { message: 'Test error' };
    
    render(
      <TestWrapper>
        <FormField
          id="test"
          label="Test Label"
          type="text"
          placeholder="Test placeholder"
          register={() => {}}
          validationRules={{}}
          error={error}
          clearError={() => {}}
        />
      </TestWrapper>
    );
    
    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toHaveClass('text-red-600');
  });

  it('applies additional classes when provided', () => {
    render(
      <TestWrapper>
        <FormField
          id="test"
          label="Test Label"
          type="text"
          placeholder="Test placeholder"
          register={() => {}}
          validationRules={{}}
          error={null}
          clearError={() => {}}
          additionalClasses="extra-class"
        />
      </TestWrapper>
    );
    
    const input = screen.getByPlaceholderText('Test placeholder');
    expect(input).toHaveClass('extra-class');
  });
});