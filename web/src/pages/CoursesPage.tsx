/**
 * Courses Page
 */

import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/use-redux';
import { fetchCourses } from '../store/slices/courses.slice';
import { fetchMyEnrollments, enrollCourse } from '../store/slices/enrollments.slice';
import { fetchCategories } from '../store/slices/categories.slice';
import { useToast } from '../contexts/ToastContext';
import CourseList from '../components/courses/CourseList';
import { useAuth } from '../hooks/use-redux';

const CoursesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { user, isAuthenticated } = useAuth();
  const courses = useAppSelector((state) => state.courses);
  const enrollments = useAppSelector((state) => state.enrollments);
  const categories = useAppSelector((state) => state.categories);
  const [enrollingCourseUuid, setEnrollingCourseUuid] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const initializedRef = useRef(false);
  const enrollPromiseRef = useRef<Promise<any> | null>(null);

  // Load initial data once on mount
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    dispatch(fetchCategories());
    dispatch(fetchCourses({ page: 1, limit: 10 }));
    if (isAuthenticated && user) {
      dispatch(fetchMyEnrollments());
    }
  }, []);

  // Handle category filter changes (skip first render)
  useEffect(() => {
    if (!initializedRef.current) return;
    dispatch(fetchCourses({ page: 1, limit: 10, categoryId: selectedCategory }));
  }, [selectedCategory, dispatch]);

  const handleEnroll = async (courseUuid: string) => {
    // Prevent multiple concurrent requests for the same or different courses
    if (enrollingCourseUuid || enrollPromiseRef.current) {
      return;
    }

    if (!isAuthenticated) {
      toast.warning('Please login to enroll in a course');
      return;
    }

    setEnrollingCourseUuid(courseUuid);

    try {
      // Create and store the enrollment promise
      const enrollPromise = dispatch(enrollCourse(courseUuid));
      enrollPromiseRef.current = enrollPromise;

      const result = await enrollPromise;

      if (enrollCourse.fulfilled.match(result)) {
        toast.success('Successfully enrolled in course!');
        // Fetch updated enrollments and courses
        await Promise.all([
          dispatch(fetchMyEnrollments()),
          dispatch(fetchCourses({ page: 1, limit: 10, categoryId: selectedCategory }))
        ]);
      } else {
        const errorMsg = result.payload || 'Failed to enroll in course';
        toast.error(errorMsg);
      }
    } catch (error: any) {
      toast.error('An error occurred while enrolling');
    } finally {
      setEnrollingCourseUuid(null);
      enrollPromiseRef.current = null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">Available Courses</h1>
        <p className="text-neutral-600">Learn about anything dog related with us.</p>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Category Filter */}
        {categories.categories.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setSelectedCategory(undefined)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === undefined
                  ? 'bg-primary text-white'
                  : 'bg-white text-neutral-600 border border-neutral-300 hover:bg-neutral-100'
              }`}
            >
              All Categories
            </button>
            {categories.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-medium transition-colors flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-white'
                    : 'bg-white text-neutral-600 border border-neutral-300 hover:bg-neutral-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Course List */}
      <CourseList
        courses={courses.courses}
        enrollments={enrollments.enrollments}
        isLoading={courses.isLoading}
        error={courses.error}
        onEnroll={handleEnroll}
        enrollingCourseUuid={enrollingCourseUuid || undefined}
        onErrorClose={() => {}}
      />
    </div>
  );
};

export default CoursesPage;
