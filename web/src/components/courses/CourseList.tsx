/**
 * Courses List Component
 */

import React from 'react';
import CourseCard from './CourseCard';
import { LoadingSpinner } from '../common';
import { getEnrollmentStatus } from '../../utils/helpers';
import type { Course, Enrollment } from '../../types';

interface CourseListProps {
  courses: Course[];
  enrollments: Enrollment[];
  isLoading: boolean;
  error: string | null;
  onEnroll: (courseUuid: string) => Promise<void>;
  enrollingCourseUuid?: string;
  onErrorClose?: () => void;
}

const CourseList: React.FC<CourseListProps> = ({
  courses,
  enrollments,
  isLoading,
  error,
  onEnroll,
  enrollingCourseUuid,
  onErrorClose,
}) => {
  if (isLoading && courses.length === 0) {
    return <LoadingSpinner fullScreen text="Loading courses..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  // Filter out enrolled and completed courses - only show available courses
  const availableCourses = courses.filter((course) => {
    const status = getEnrollmentStatus(course, enrollments);
    return status !== 'enrolled' && status !== 'completed';
  });

  if (availableCourses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600 text-lg">No courses found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {availableCourses.map((course) => (
        <CourseCard
          key={course.uuid}
          course={course}
          enrollments={enrollments}
          onEnroll={onEnroll}
          isLoading={enrollingCourseUuid === course.uuid}
        />
      ))}
    </div>
  );
};

export default CourseList;
