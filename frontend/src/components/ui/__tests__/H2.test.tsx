import React from 'react';
import { render, screen } from '@testing-library/react';
import H2 from '../H2';

describe('H2 Component', () => {
  it('renders children correctly', () => {
    render(<H2>Test Heading</H2>);
    expect(screen.getByText('Test Heading')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<H2 className="custom-class">Test Heading</H2>);
    const heading = screen.getByText('Test Heading');
    expect(heading).toHaveClass('custom-class');
    expect(heading).toHaveClass('text-lg');
    expect(heading).toHaveClass('font-semibold');
  });
});