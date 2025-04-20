import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'red' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  icon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const getVariantClasses = (): string => {
    switch (variant) {
      case 'primary':
        return isLoading
          ? 'bg-indigo-400 text-white'
          : 'bg-indigo-600 hover:bg-indigo-700 text-white';
      case 'secondary':
        return 'bg-gray-100 hover:bg-gray-200 text-gray-700';
      case 'red':
        return isLoading
          ? 'bg-red-400 text-white'
          : 'bg-red-500 hover:bg-red-600 text-white';
      case 'icon':
        return 'bg-gray-100 hover:bg-gray-200 text-gray-600';
      default:
        return 'bg-indigo-600 hover:bg-indigo-700 text-white';
    }
  };

  return (
    <button
      className={`
        ${getVariantClasses()}
        ${fullWidth ? 'flex-1' : ''}
        ${variant === 'icon' ? 'w-12 h-10' : 'px-4 py-2'}
        rounded-md transition-colors flex items-center justify-center gap-2 font-medium
        ${className}
      `}
      disabled={isLoading || disabled}
      {...props}
    >
      {icon && icon}
      {children}
    </button>
  );
};

export default Button;
