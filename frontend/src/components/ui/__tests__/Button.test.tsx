import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';
import { Home, Mail, ArrowRight } from 'lucide-react';

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders with an icon', () => {
    render(<Button icon={Home}>Home</Button>);
    expect(screen.getByText('Home')).toBeInTheDocument();
    // Check if SVG is rendered (Home icon)
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('renders a basic button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders a button with left icon', () => {
    render(<Button icon={Mail}>Email</Button>);
    const button = screen.getByText('Email');
    expect(button).toBeInTheDocument();
    // Check that the icon is rendered
    expect(button.parentElement?.querySelector('svg')).toBeInTheDocument();
  });

  it('renders a button with right icon', () => {
    render(
      <Button icon={ArrowRight} iconPosition="right">
        Next
      </Button>
    );
    const button = screen.getByText('Next');
    expect(button).toBeInTheDocument();
    // Check that the icon is rendered
    expect(button.parentElement?.querySelector('svg')).toBeInTheDocument();
  });

  it('renders an icon-only button', () => {
    render(<Button icon={Mail} iconOnly aria-label="Send email" />);
    // Since there's no text, we find by role
    const button = screen.getByRole('button', { name: 'Send email' });
    expect(button).toBeInTheDocument();
    // Check that the icon is rendered
    expect(button.querySelector('svg')).toBeInTheDocument();
    // Check that no text is rendered
    expect(button.textContent).toBe('');
  });

  it('applies different variants correctly', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByText('Primary').className).toContain('bg-indigo-600');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByText('Secondary').className).toContain('bg-gray-200');

    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByText('Danger').className).toContain('bg-red-100');
  });

  it('applies different sizes correctly', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByText('Small').className).toContain('text-sm');

    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByText('Medium').className).toContain('py-2 px-4');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByText('Large').className).toContain('text-lg');
  });

  it('applies fullWidth class when fullWidth is true', () => {
    render(<Button fullWidth>Full Width</Button>);
    expect(screen.getByText('Full Width').className).toContain('w-full');
  });
});