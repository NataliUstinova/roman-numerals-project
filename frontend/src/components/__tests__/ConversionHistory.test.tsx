import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ConversionHistory from '../ConversionHistory';

// Mock the useConversionHistory hook
jest.mock('../../hooks/useConversionHistory', () => ({
  __esModule: true,
  useConversionHistory: jest.fn(),
}));

// Mock the ConfirmDialog component
jest.mock('../ui/ConfirmDialog.tsx', () => ({
  __esModule: true,
  default: ({ isOpen, title, message, onConfirm, onCancel }) => (
    isOpen ? (
      <div data-testid="confirm-dialog">
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    ) : null
  ),
}));

const mockUseConversionHistory = require('../../hooks/useConversionHistory').useConversionHistory;

const mockConversions = [
  {
    _id: '1',
    type: 'arabic-to-roman',
    inputValue: '42',
    convertedValue: 'XLII',
    createdAt: '2023-01-01T00:00:00.000Z',
  },
  {
    _id: '2',
    type: 'roman-to-arabic',
    inputValue: 'X',
    convertedValue: '10',
    createdAt: '2023-01-02T00:00:00.000Z',
  },
];

describe('ConversionHistory Component', () => {
  beforeEach(() => {
    mockUseConversionHistory.mockReturnValue({
      conversions: mockConversions,
      isLoading: false,
      error: null,
      showHistory: true,
      toggleHistory: jest.fn(),
      handleClearHistory: jest.fn(),
    });
  });

  it('renders correctly with history visible', () => {
    render(<ConversionHistory />);
    
    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.getByText('Clear All')).toBeInTheDocument();
    expect(screen.getByText('Hide')).toBeInTheDocument();
    
    // Check for individual elements instead of combined text
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('XLII')).toBeInTheDocument();
    expect(screen.getByText('X')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    mockUseConversionHistory.mockReturnValue({
      conversions: [],
      isLoading: true,
      error: null,
      showHistory: true,
      toggleHistory: jest.fn(),
      handleClearHistory: jest.fn(),
    });

    render(<ConversionHistory />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    mockUseConversionHistory.mockReturnValue({
      conversions: [],
      isLoading: false,
      error: new Error('Test error'),
      showHistory: true,
      toggleHistory: jest.fn(),
      handleClearHistory: jest.fn(),
    });

    render(<ConversionHistory />);
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    mockUseConversionHistory.mockReturnValue({
      conversions: [],
      isLoading: false,
      error: null,
      showHistory: true,
      toggleHistory: jest.fn(),
      handleClearHistory: jest.fn(),
    });

    render(<ConversionHistory />);
    expect(screen.getByText('No conversion history yet')).toBeInTheDocument();
  });

  it('renders show history button when history is hidden', () => {
    mockUseConversionHistory.mockReturnValue({
      conversions: mockConversions,
      isLoading: false,
      error: null,
      showHistory: false,
      toggleHistory: jest.fn(),
      handleClearHistory: jest.fn(),
    });

    render(<ConversionHistory />);
    expect(screen.getByText('Show History')).toBeInTheDocument();
  });

  it('calls toggleHistory when show/hide buttons are clicked', () => {
    const toggleHistory = jest.fn();
    mockUseConversionHistory.mockReturnValue({
      conversions: mockConversions,
      isLoading: false,
      error: null,
      showHistory: true,
      toggleHistory,
      handleClearHistory: jest.fn(),
    });

    render(<ConversionHistory />);
    fireEvent.click(screen.getByText('Hide'));
    expect(toggleHistory).toHaveBeenCalledTimes(1);
  });

  it('shows confirm dialog when clear button is clicked', () => {
    render(<ConversionHistory />);
    fireEvent.click(screen.getByText('Clear All'));
    expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
  });
});
