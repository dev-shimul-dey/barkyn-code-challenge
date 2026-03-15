/**
 * Alert Component
 */

import React from 'react';
import clsx from 'clsx';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
  dismissible?: boolean;
}

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  message,
  onClose,
  dismissible = true,
}) => {
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className={clsx('border rounded-lg p-4 flex items-start gap-3', styles[type])}>
      <span className="text-xl font-bold">{icons[type]}</span>
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {dismissible && onClose && (
        <button
          onClick={onClose}
          className="text-lg opacity-50 hover:opacity-100 transition-opacity"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Alert;
