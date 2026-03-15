/**
 * Header/Navbar Component
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../common';
import { useAppDispatch, useAuth } from '../../hooks/use-redux';
import { logout } from '../../store/slices/auth.slice';

interface HeaderProps {
  onLoginClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const { user, isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">🐕 Barkyn</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 ml-auto mr-6">
          <Link
            to="/"
            className="text-neutral-600 hover:text-primary transition-colors font-medium"
          >
            Courses
          </Link>
          <Link
            to="/profile"
            className="text-neutral-600 hover:text-primary transition-colors font-medium"
          >
            Profile
          </Link>
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <span className="text-neutral-700 font-medium">{user.name}</span>
              <Button variant="primary" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Button variant="primary" size="sm" onClick={onLoginClick}>
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
