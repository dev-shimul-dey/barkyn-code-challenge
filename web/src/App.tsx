/**
 * Main App Component
 */

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { ToastProvider } from './contexts/ToastContext';
import { useRestoreSession, useAuth } from './hooks';
import Layout from './components/layout/Layout';
import LoginModal from './components/modals/LoginModal';
import CoursesPage from './pages/CoursesPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import ProfilePage from './pages/ProfilePage';
import { LoadingSpinner } from './components/common';

/**
 * Main App Router
 */
function AppContent() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { isLoading: authLoading } = useAuth();

  // Restore session on mount
  useRestoreSession();

  if (authLoading) {
    return <LoadingSpinner fullScreen text="Loading..." />;
  }

  return (
    <>
      <Layout onLoginClick={() => setLoginModalOpen(true)}>
        <Routes>
          <Route path="/" element={<CoursesPage />} />
          <Route path="/courses/:courseUuid" element={<CourseDetailsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>

      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
}

/**
 * App Root with Redux Provider and Toast Provider
 */
function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <Router>
          <AppContent />
        </Router>
      </ToastProvider>
    </Provider>
  );
}

export default App;
