/**
 * Card Component
 */

import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, hoverable = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'bg-white rounded-lg shadow-md p-6 transition-all duration-200',
          hoverable && 'hover:shadow-lg hover:scale-105 cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
