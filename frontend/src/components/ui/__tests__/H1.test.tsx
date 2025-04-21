import React from 'react';
import { render, screen } from '@testing-library/react';
import H1 from '../H1';

describe('H1 Component', () => {
  it('renders children correctly', () => {
    render(<H1>Test Heading</H1>);
    expect(screen.getByText('Test Heading')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<H1 className="custom-class">Test Heading</H1>);
    const heading = screen.getByText('Test Heading');
    expect(heading).toHaveClass('custom-class');
    expect(heading).toHaveClass('text-3xl');
    expect(heading).toHaveClass('font-bold');
  });
});