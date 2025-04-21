import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ResultDisplay from '../ResultDisplay';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe('ResultDisplay Component', () => {
  const mockSetCopied = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the result correctly', () => {
    render(<ResultDisplay result="XIV" copied={false} setCopied={mockSetCopied} />);
    expect(screen.getByText('XIV')).toBeInTheDocument();
    expect(screen.getByText('Result:')).toBeInTheDocument();
  });

  it('shows copy icon when not copied', () => {
    render(<ResultDisplay result="XIV" copied={false} setCopied={mockSetCopied} />);
    expect(screen.getByText('Click to copy to clipboard')).toBeInTheDocument();
  });

  it('shows check icon when copied', () => {
    render(<ResultDisplay result="XIV" copied={true} setCopied={mockSetCopied} />);
    expect(screen.getByText('Copied to clipboard!')).toBeInTheDocument();
  });

  it('copies to clipboard when clicked', () => {
    render(<ResultDisplay result="XIV" copied={false} setCopied={mockSetCopied} />);
    
    fireEvent.click(screen.getByText('XIV'));
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('XIV');
    expect(mockSetCopied).toHaveBeenCalledWith(true);
  });

  it('does not render copy elements when result is null', () => {
    render(<ResultDisplay result={null} copied={false} setCopied={mockSetCopied} />);
    
    expect(screen.queryByText('Click to copy to clipboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Copied to clipboard!')).not.toBeInTheDocument();
  });
});