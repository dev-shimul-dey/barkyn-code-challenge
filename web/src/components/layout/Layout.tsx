/**
 * Main Layout Component
 */

import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  onLoginClick?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onLoginClick }) => {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <Header onLoginClick={onLoginClick} />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {children}
      </main>
      <footer className="bg-neutral-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-neutral-400">
            © 2026 Barkyn. Learn Dog Training Courses Online.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
