import React from 'react';
import { render, screen } from '@testing-library/react';
import HowItWorks from '../HowItWorks';

describe('HowItWorks Component', () => {
  it('renders the component with correct instructions', () => {
    render(<HowItWorks />);
    
    expect(screen.getByText('How it works:')).toBeInTheDocument();
    expect(screen.getByText('Select the conversion mode')).toBeInTheDocument();
    expect(screen.getByText(/Enter a/)).toBeInTheDocument();
    expect(screen.getByText(/Number/)).toBeInTheDocument();
    expect(screen.getByText(/Roman numeral/)).toBeInTheDocument();
    expect(screen.getByText(/Click/)).toBeInTheDocument();
    expect(screen.getByText(/Convert/)).toBeInTheDocument();
  });
});