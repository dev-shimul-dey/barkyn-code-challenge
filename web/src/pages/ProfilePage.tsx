/**
 * Profile Page
 */

import React, { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/use-redux';
import { fetchMyEnrollments } from '../store/slices/enrollments.slice';
import { useAuth } from '../hooks/use-redux';
import { LoadingSpinner } from '../components/common';
import { formatPrice, formatDate } from '../utils/helpers';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAuth();
  const enrollments = useAppSelector((state) => state.enrollments.enrollments);
  const enrollmentsLoading = useAppSelector((state) => state.enrollments.isLoading);
  const enrollmentsError = useAppSelector((state) => state.enrollments.error);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    // Fetch enrollments once on mount
    if (!initializedRef.current && isAuthenticated) {
      initializedRef.current = true;
      dispatch(fetchMyEnrollments());
    }
  }, [isAuthenticated, navigate, dispatch]);

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600 text-lg mb-4">Please login to view your profile</p>
      </div>
    );
  }

  if (enrollmentsLoading) {
    return <LoadingSpinner fullScreen text="Loading profile..." />;
  }

  if (enrollmentsError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {enrollmentsError}
      </div>
    );
  }

  // Separate enrolled and completed courses
  const enrolledCourses = enrollments.filter((e) => !e.completed);
  const completedCourses = enrollments.filter((e) => e.completed);
  const totalCredits = enrolledCourses.length + completedCourses.length;

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-neutral-900">Hi {user?.name}!</h1>
        <p className="text-neutral-600 text-lg">Learn about anything dog related with us.</p>
      </div>

      {/* Credits Section */}
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6 flex items-center justify-between">
        <div>
          <p className="text-neutral-600 text-sm mb-2">Available credits</p>
          <p className="text-4xl font-bold text-primary">{totalCredits} credits</p>
        </div>
        <div className="text-6xl">📚</div>
      </div>

      {/* Ongoing Courses */}
      {enrolledCourses.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-neutral-900">Ongoing courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrolledCourses.map((enrollment) => (
              <Link
                key={enrollment.id}
                to={`/courses/${enrollment.courseUuid}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                <div className="relative h-40 bg-gradient-to-r from-primary to-primary/60 overflow-hidden flex items-center justify-center">
                  <span className="text-5xl group-hover:scale-110 transition-transform">🎓</span>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-primary text-sm font-semibold">In Progress</p>
                    <p className="text-neutral-600 text-xs">Enrolled on {formatDate(enrollment.enrolledAt || enrollment.createdAt)}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      In Progress • 50%
                    </span>
                    <span className="text-primary font-bold">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Completed Courses */}
      {completedCourses.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-neutral-900">Completed</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {completedCourses.map((enrollment) => (
              <Link
                key={enrollment.id}
                to={`/courses/${enrollment.courseUuid}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group relative"
              >
                <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                  Completed
                </div>

                <div className="relative h-40 bg-gradient-to-r from-green-400 to-green-600 overflow-hidden flex items-center justify-center opacity-80">
                  <span className="text-5xl group-hover:scale-110 transition-transform">✓</span>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-green-600 text-sm font-semibold">Completed</p>
                    <p className="text-neutral-600 text-xs">Completed on {formatDate(enrollment.completedAt)}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
                    <span className="text-sm text-green-600 font-semibold">✓ Completed</span>
                    <span className="text-green-500 font-bold">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {enrolledCourses.length === 0 && completedCourses.length === 0 && (
        <div className="bg-white rounded-lg p-12 text-center border border-neutral-200">
          <p className="text-neutral-600 text-lg mb-4">You haven't enrolled in any courses yet</p>
          <Link
            to="/"
            className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Browse Courses
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
