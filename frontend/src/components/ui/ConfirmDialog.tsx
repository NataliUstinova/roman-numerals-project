import Button from './Button.tsx';
import H2 from './H2.tsx';
import { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Delete',
  cancelText = 'Cancel',
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  // Handle click outside to cancel
  const handleBackdropClick = (e: React.MouseEvent) => {
    const dialogDimensions = dialogRef.current?.getBoundingClientRect();
    if (
      dialogDimensions &&
      (e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom)
    ) {
      onCancel();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="p-0 bg-white rounded-lg shadow-lg max-w-sm w-full backdrop:bg-black backdrop:bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div className="p-6">
        <H2>{title}</H2>
        <p className="mb-6 text-gray-500">{message}</p>
        <div className="flex justify-end space-x-2">
          <Button variant="secondary" size="sm" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
