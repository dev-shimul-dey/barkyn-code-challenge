/**
 * Toast Notification Component
 */

import React, { useEffect } from 'react';
import clsx from 'clsx';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps extends ToastMessage {
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, duration = 3000, onClose }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-white',
  };

  const typeIcons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  return (
    <div
      className={clsx(
        'fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300',
        typeStyles[type]
      )}
    >
      <span className="text-xl font-bold">{typeIcons[type]}</span>
      <span className="font-medium">{message}</span>
      <button
        onClick={() => onClose(id)}
        className="ml-2 p-1 bg-white rounded transition-colors hover:bg-neutral-100"
      >
        <span className="text-black">✕</span>
      </button>
    </div>
  );
};

export default Toast;
