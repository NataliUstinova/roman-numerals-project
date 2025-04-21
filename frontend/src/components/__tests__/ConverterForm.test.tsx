import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import ConverterForm from '../ConverterForm';
import * as useRomanConverterModule from '../../hooks/useRomanConverter';

// Mock the useRomanConverter hook
const mockConvert = jest.fn();
const mockSwitchMode = jest.fn();
const mockGetValidationRules = jest.fn();
const mockClearError = jest.fn();

function setupHook({
  mode = 'toRoman',
  roman = '',
  number = '',
  error = '',
  loading = false,
} = {}) {
  // Create a mock object to store form values
  const formValues = {
    number: '',
    roman: '',
  };

  // Mock register to capture input values
  const mockRegister = name => {
    return {
      name,
      ref: jest.fn(),
      onChange: e => {
        formValues[name] = e.target.value;
      },
      onBlur: jest.fn(),
    };
  };

  // Mock convert to use the captured values
  mockConvert.mockImplementation(() => {
    // Use the value from formValues based on mode
    const inputValue =
      mode === 'toRoman' ? formValues.number : formValues.roman;
    return Promise.resolve({ convertedValue: inputValue });
  });

  jest.spyOn(useRomanConverterModule, 'useRomanConverter').mockReturnValue({
    roman,
    number,
    error,
    mode,
    loading,
    convert: mockConvert,
    switchMode: mockSwitchMode,
    getValidationRules: mockGetValidationRules,
    clearError: mockClearError,
    setRoman: jest.fn(),
    setNumber: jest.fn(),
    register: mockRegister,
  });
}

describe('ConverterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetValidationRules.mockReturnValue({});
  });

  it('renders Number to Roman mode by default', () => {
    setupHook({ mode: 'toRoman' });
    render(<ConverterForm />);
    expect(screen.getByText(/Number to Roman/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Switch Mode/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Convert/i }),
    ).toBeInTheDocument();
  });

  it('switches to Roman to Number mode when Switch Mode is clicked', () => {
    setupHook({ mode: 'toRoman' });
    render(<ConverterForm />);
    fireEvent.click(screen.getByRole('button', { name: /Switch Mode/i }));
    expect(mockSwitchMode).toHaveBeenCalled();
  });

  it('shows error message when error is present', () => {
    setupHook({ error: 'Test error' });
    render(<ConverterForm />);
    expect(screen.getByText(/Test error/i)).toBeInTheDocument();
  });

  it('calls convert with number input in toRoman mode', async () => {
    setupHook({ mode: 'toRoman' });
    render(<ConverterForm />);
    const input = screen.getByRole('spinbutton');

    // Simulate typing into the input
    await user.type(input, '123');

    // Ensure the formValues object is updated
    expect(input).toHaveValue(123);

    fireEvent.click(screen.getByRole('button', { name: /Convert/i }));

    await waitFor(() => {
      expect(mockConvert).toHaveBeenCalledWith('123');
    });
  });

  it('calls convert with roman input in toNumber mode', async () => {
    setupHook({ mode: 'toNumber' });
    render(<ConverterForm />);
    const input = screen.getByRole('textbox');

    // Simulate typing into the input
    await user.type(input, 'XII');

    // Ensure the formValues object is updated
    expect(input).toHaveValue('XII');

    fireEvent.click(screen.getByRole('button', { name: /Convert/i }));

    await waitFor(() => {
      expect(mockConvert).toHaveBeenCalledWith('XII');
    });
  });

  it('disables Convert button when loading', () => {
    setupHook({ loading: true });
    render(<ConverterForm />);
    expect(screen.getByRole('button', { name: /Convert/i })).toBeDisabled();
  });
});
