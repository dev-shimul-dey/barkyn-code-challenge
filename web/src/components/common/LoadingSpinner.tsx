/**
 * Loading Spinner Component
 */

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  fullScreen = false,
  text = 'Loading...',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const spinner = (
    <div className="flex flex-col items-center gap-4">
      <div className={`${sizeClasses[size]} border-4 border-primary/20 border-t-primary rounded-full animate-spin`} />
      {text && <p className="text-neutral-600 text-sm font-medium">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return <div className="flex justify-center py-8">{spinner}</div>;
};

export default LoadingSpinner;
