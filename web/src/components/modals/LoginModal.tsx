/**
 * Login Modal Component
 */

import React, { useState } from 'react';
import { Modal, Button, Alert } from '../common';
import { useAppDispatch } from '../../hooks/use-redux';
import { loginUser } from '../../store/slices/auth.slice';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsLoading(true);
    try {
      const result = await dispatch(loginUser(name));
      if (loginUser.fulfilled.match(result)) {
        setName('');
        onClose();
      } else if (loginUser.rejected.match(result)) {
        setError(result.payload as string);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Welcome to Barkyn" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert type="error" message={error} dismissible onClose={() => setError(null)} />}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-900 mb-2">
            Enter Your Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
          <p className="mt-2 text-xs text-neutral-500">
            Enter any name to get started learning with us!
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isLoading}
          className="w-full"
        >
          Start Learning
        </Button>
      </form>
    </Modal>
  );
};

export default LoginModal;
