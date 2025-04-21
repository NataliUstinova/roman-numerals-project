import React from 'react';
import { LucideIcon } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  iconOnly?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  iconOnly = false,
  ...props
}) => {
  const baseClasses =
    'rounded-md transition-colors focus:outline-none focus:ring-2 inline-flex items-center justify-center';

  const variantClasses = {
    primary:
      'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:opacity-50',
    secondary:
      'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 focus:ring-indigo-500',
    danger:
      'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500 disabled:opacity-50',
    outline: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500',
  };

  const sizeClasses = {
    sm: 'text-sm py-1 px-3',
    md: 'py-2 px-4',
    lg: 'text-lg py-3 px-6',
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const iconOnlyClass = iconOnly ? 'p-2' : '';

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${
    !iconOnly ? sizeClasses[size] : ''
  } ${iconOnlyClass} ${widthClass} ${className}`;

  return (
    <button className={buttonClasses} {...props}>
      {Icon && iconPosition === 'left' && !iconOnly && (
        <Icon size={iconSizes[size]} className="mr-2" />
      )}
      {iconOnly && Icon ? <Icon size={iconSizes[size]} /> : children}
      {Icon && iconPosition === 'right' && !iconOnly && (
        <Icon size={iconSizes[size]} className="ml-2" />
      )}
    </button>
  );
};

export default Button;
