import React from 'react';
import { render, screen } from '@testing-library/react';
import InfoTooltip from '../InfoTooltip';

describe('InfoTooltip Component', () => {
  it('renders correctly when show is true', () => {
    render(
      <InfoTooltip
        show={true}
        message="Test message"
      />
    );
    
    const tooltip = screen.getByText('Test message');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveClass('block');
  });

  it('does not render when show is false', () => {
    render(
      <InfoTooltip
        show={false}
        message="Test message"
      />
    );
    
    const tooltip = screen.getByText('Test message');
    expect(tooltip).toHaveClass('hidden');
    expect(tooltip).toHaveClass('group-hover:block');
  });

  it('renders with group-hover class when show is false', () => {
    render(
      <InfoTooltip
        show={false}
        message="Test message"
      />
    );
    
    const tooltip = screen.getByText('Test message');
    expect(tooltip).toHaveClass('group-hover:block');
  });

  it('applies additional classes when provided', () => {
    render(
      <InfoTooltip
        show={true}
        message="Test message"
        className="extra-class"
      />
    );
    
    const tooltip = screen.getByText('Test message');
    expect(tooltip).toHaveClass('extra-class');
  });
});