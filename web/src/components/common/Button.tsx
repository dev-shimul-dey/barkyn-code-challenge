/**
 * Button Component
 */

import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants = {
      primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary',
      secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary',
      danger: 'bg-error text-white hover:bg-error/90 focus:ring-error',
      outline: 'border-2 border-primary text-primary hover:bg-primary/10 focus:ring-primary',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          baseStyles,
          variants[variant],
          sizes[size],
          (disabled || loading) && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin">⟳</span>
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
