import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmDialog from '../ConfirmDialog';

// Mock the dialog element's showModal and close methods
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = jest.fn();
  HTMLDialogElement.prototype.close = jest.fn();
});

describe('ConfirmDialog Component', () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dialog when isOpen is true', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Confirm Action"
        message="Are you sure you want to proceed?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    );

    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure you want to proceed?'),
    ).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('does not render dialog content when isOpen is false', () => {
    render(
      <ConfirmDialog
        isOpen={false}
        title="Confirm Action"
        message="Are you sure you want to proceed?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    );

    // Check that the showModal method wasn't called when isOpen is false
    expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();

    // Check that the close method was called
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Confirm Action"
        message="Are you sure you want to proceed?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    );

    fireEvent.click(screen.getByText('Delete'));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Confirm Action"
        message="Are you sure you want to proceed?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('uses custom button text when provided', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Confirm Action"
        message="Are you sure you want to proceed?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        confirmText="Yes, do it"
        cancelText="No, go back"
      />,
    );

    expect(screen.getByText('Yes, do it')).toBeInTheDocument();
    expect(screen.getByText('No, go back')).toBeInTheDocument();
  });

  it('calls onCancel when clicking outside the dialog', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Confirm Action"
        message="Are you sure you want to proceed?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    );

    // Get the dialog element using a different query
    const dialog = screen.getByText('Confirm Action').closest('dialog');

    if (!dialog) {
      throw new Error('Dialog element not found');
    }

    // Mock getBoundingClientRect to return dialog dimensions
    const mockRect = {
      left: 100,
      right: 300,
      top: 100,
      bottom: 300,
      width: 200,
      height: 200,
      x: 100,
      y: 100,
    };

    dialog.getBoundingClientRect = jest.fn().mockReturnValue(mockRect);

    // Simulate a click outside the dialog boundaries
    fireEvent.click(dialog, {
      clientX: 50, // Outside left boundary
      clientY: 150,
    });

    // Check that onCancel was called
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('calls showModal when isOpen changes from false to true', () => {
    // Start with isOpen=false
    const { rerender } = render(
      <ConfirmDialog
        isOpen={false}
        title="Test Dialog"
        message="Test message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    );

    // Clear mocks before changing props
    jest.clearAllMocks();

    // Re-render with isOpen=true
    rerender(
      <ConfirmDialog
        isOpen={true}
        title="Test Dialog"
        message="Test message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    );

    // Verify showModal was called when isOpen changed to true
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1);
  });
});
