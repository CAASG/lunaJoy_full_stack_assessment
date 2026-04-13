/**
 * @module Button
 * @description Themed button component with primary/secondary/ghost variants.
 * Uses the LunaJoy calming color palette.
 */

import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const variantClasses = {
  primary: 'bg-luna-blue text-white hover:bg-luna-blue-dark',
  secondary: 'bg-luna-cream-dark text-luna-dark hover:bg-luna-cream',
  ghost: 'bg-transparent text-luna-warm-gray hover:text-luna-dark hover:bg-luna-cream-dark',
} as const;

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
} as const;

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-lg font-medium
        transition-colors duration-200 focus:outline-none focus:ring-2
        focus:ring-luna-blue focus:ring-offset-2
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
