/**
 * Course Card Component
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Course, Enrollment } from '../../types';
import { getEnrollmentStatus, formatPrice, getAvailableSeats } from '../../utils/helpers';

interface CourseCardProps {
  course: Course;
  enrollments: Enrollment[];
  onEnroll?: (courseUuid: string) => Promise<void>;
  isLoading?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  enrollments,
  onEnroll,
  isLoading = false,
}) => {
  const status = getEnrollmentStatus(course, enrollments);
  const availableSeats = getAvailableSeats(course);
  const [optimisticStatus, setOptimisticStatus] = useState<string | null>(null);
  const [isOptimisticLoading, setIsOptimisticLoading] = useState(false);

  const displayStatus = optimisticStatus || status;
  const displayLoading = isOptimisticLoading || isLoading;

  const handleEnrollClick = async () => {
    if (displayLoading) return;
    
    // Optimistic update
    setOptimisticStatus('enrolled');
    setIsOptimisticLoading(true);

    try {
      await onEnroll?.(course.uuid);
      // Clear optimistic state - let server state take over
      setOptimisticStatus(null);
    } catch (error) {
      // Revert on error
      setOptimisticStatus(null);
    } finally {
      setIsOptimisticLoading(false);
    }
  };

  return (
    <Link
      to={`/courses/${course.uuid}`}
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      {/* Image */}
      <div className="relative h-40 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center text-4xl">
          🐕
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category Badge */}
        <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
          {course.category?.name || 'General'}
        </span>

        {/* Title */}
        <h3 className="text-lg font-bold text-neutral-900 line-clamp-2">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-neutral-600 line-clamp-2">
          {course.description}
        </p>

        {/* Status and Seats */}
        <div className="flex items-center justify-between text-xs">
          <span className={`px-2 py-1 rounded-full font-medium ${
            displayStatus === 'enrolled' ? 'bg-blue-100 text-blue-700' :
            displayStatus === 'completed' ? 'bg-green-100 text-green-700' :
            'bg-purple-100 text-purple-700'
          }`}>
            {displayStatus === 'enrolled' ? 'In Progress' :
             displayStatus === 'completed' ? '✓ Completed' :
             'Available'}
          </span>
          <span className="text-neutral-500">
            {availableSeats > 0 ? `${availableSeats} seats` : 'Full'}
          </span>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            {formatPrice(Number(course.price))}
          </span>
          {displayStatus === 'available' && (
            <button
              onClick={(e) => {
                e.preventDefault();
                handleEnrollClick();
              }}
              disabled={displayLoading}
              className="px-3 py-1 bg-primary text-white rounded text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-opacity"
            >
              {displayLoading ? '...' : 'Enroll'}
            </button>
          )}
          {displayStatus === 'enrolled' && (
            <span className="text-sm font-medium text-blue-600">In Progress</span>
          )}
          {displayStatus === 'completed' && (
            <span className="text-sm font-medium text-green-600">✓ Done</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
