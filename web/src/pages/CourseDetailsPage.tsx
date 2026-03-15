/**
 * Course Details Page
 */

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/use-redux';
import { fetchCourse, clearSelectedCourse } from '../store/slices/courses.slice';
import { enrollCourse, completeCourse, fetchMyEnrollments } from '../store/slices/enrollments.slice';
import { useToast } from '../contexts/ToastContext';
import { useFetchCourse } from '../hooks';
import { Card, Button, LoadingSpinner } from '../components/common';
import { useAuth } from '../hooks/use-redux';
import { formatPrice, getEnrollmentStatus } from '../utils/helpers';

const CourseDetailsPage: React.FC = () => {
  const { courseUuid } = useParams<{ courseUuid: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { user, isAuthenticated } = useAuth();
  const course = useAppSelector((state) => state.courses.selectedCourse);
  const coursesState = useAppSelector((state) => state.courses);
  const enrollments = useAppSelector((state) => state.enrollments.enrollments);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const enrollPromiseRef = useRef<Promise<any> | null>(null);
  const completePromiseRef = useRef<Promise<any> | null>(null);

  // Fetch course details
  useFetchCourse(courseUuid || '');

  const status = course ? getEnrollmentStatus(course, enrollments) : 'available';

  const handleEnroll = async () => {
    // Prevent multiple concurrent requests
    if (isEnrolling || enrollPromiseRef.current) return;

    if (!isAuthenticated) {
      toast.warning('Please login to enroll in this course');
      return;
    }

    if (!courseUuid) return;

    setIsEnrolling(true);

    try {
      const enrollPromise = dispatch(enrollCourse(courseUuid));
      enrollPromiseRef.current = enrollPromise;

      const result = await enrollPromise;

      if (enrollCourse.fulfilled.match(result)) {
        toast.success('Successfully enrolled in course!');
        // Fetch updated enrollments and course
        await Promise.all([
          dispatch(fetchMyEnrollments()),
          dispatch(fetchCourse(courseUuid))
        ]);
      } else {
        const errorMsg = result.payload || 'Failed to enroll in course';
        toast.error(errorMsg);
      }
    } catch (error: any) {
      toast.error('An error occurred while enrolling');
    } finally {
      setIsEnrolling(false);
      enrollPromiseRef.current = null;
    }
  };

  const handleCompleteCourse = async () => {
    // Prevent multiple concurrent requests
    if (isCompleting || completePromiseRef.current) return;

    if (!courseUuid) return;

    setIsCompleting(true);

    try {
      const completePromise = dispatch(completeCourse(courseUuid));
      completePromiseRef.current = completePromise;

      const result = await completePromise;

      if (completeCourse.fulfilled.match(result)) {
        toast.success('Course marked as complete!');
        // Refetch enrollments and course
        await Promise.all([
          dispatch(fetchMyEnrollments()),
          dispatch(fetchCourse(courseUuid))
        ]);
      } else {
        const errorMsg = result.payload || 'Failed to mark course as complete';
        toast.error(errorMsg);
      }
    } catch (error: any) {
      toast.error('An error occurred while completing course');
    } finally {
      setIsCompleting(false);
      completePromiseRef.current = null;
    }
  };

  if (coursesState.isLoading && !course) {
    return <LoadingSpinner fullScreen text="Loading course details..." />;
  }

  if (coursesState.error && !course) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600 text-lg mb-4">Error loading course</p>
        <Button onClick={() => navigate('/')}>Back to Courses</Button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600 text-lg mb-4">Course not found</p>
        <Button onClick={() => navigate('/')}>Back to Courses</Button>
      </div>
    );
  }

  // Check if user is enrolled but course description is not available (locked course)
  const isCourseLocked = status === 'enrolled' && !course.description;

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Button
        onClick={() => navigate('/')}
        variant="primary"
        size="sm"
        className="flex items-center gap-2"
      >
        ← Back to Courses
      </Button>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-4">
              {course.category?.name || 'General'}
            </span>
            <h1 className="text-4xl font-bold text-neutral-900 mb-2">{course.title}</h1>
            {!isCourseLocked && (
              <p className="text-lg text-neutral-600">{course.description}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-primary">{formatPrice(Number(course.price))}</p>
          </div>
        </div>
      </div>

      {/* Locked Course Message */}
      {isCourseLocked && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
          <p className="text-amber-900 text-lg font-semibold mb-2">Course Locked</p>
          <p className="text-amber-800">Complete previously enrolled course to start the new course</p>
        </div>
      )}

      {/* Enrollment Error Alert */}
      
      {/* Status Message */}

      {!isCourseLocked && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Info */}
            <Card>
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Course Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-neutral-600 text-sm">Total Seats</p>
                    <p className="text-2xl font-bold text-neutral-900">{course.totalSeats}</p>
                  </div>
                  <div>
                    <p className="text-neutral-600 text-sm">Occupied Seats</p>
                    <p className="text-2xl font-bold text-neutral-900">{course.occupiedSeats}</p>
                  </div>
                  <div>
                    <p className="text-neutral-600 text-sm">Available Seats</p>
                    <p className="text-2xl font-bold text-primary">
                      {course.totalSeats - course.occupiedSeats}
                    </p>
                  </div>
                  <div>
                    <p className="text-neutral-600 text-sm">Status</p>
                    <p className="text-2xl font-bold text-neutral-900 capitalize">
                      {status === 'full' ? 'Full' : 'Available'}
                    </p>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">About This Course</h3>
                <p className="text-neutral-600 leading-relaxed">
                  {course.description}
                </p>
                { !course.description && (
                  <p className="text-neutral-500 italic mt-2">Course description and steps will be available once you enroll and unlock the course.</p>
                )}
              </div>

              {/* Course Steps - Only visible when enrolled and course is unlocked */}
              {(status === 'enrolled' || status === 'completed') && (
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-4">Course Steps</h3>
                  <div className="space-y-3">
                    {[
                      { step: 1, title: 'Introduction & Overview', duration: '15 mins' },
                      { step: 2, title: 'Core Concepts', duration: '45 mins' },
                      { step: 3, title: 'Practical Exercises', duration: '60 mins' },
                      { step: 4, title: 'Final Assessment', duration: '30 mins' },
                    ].map((item) => (
                      <div key={item.step} className="flex items-start gap-4 pb-3 border-b border-neutral-200 last:border-b-0">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-semibold text-sm">{item.step}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-neutral-900">{item.title}</p>
                          <p className="text-sm text-neutral-500">{item.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          <Card className="sticky top-24">
            <div className="space-y-4">
              <div>
                <p className="text-neutral-600 text-sm mb-1">Course Price</p>
                <p className="text-3xl font-bold text-primary">{formatPrice(Number(course.price))}</p>
              </div>

              <div className="bg-neutral-100 rounded-lg p-3">
                <p className="text-neutral-700 text-sm">
                  <span className="font-bold">{course.totalSeats - course.occupiedSeats}</span> seats available
                </p>
              </div>

              {status === 'completed' ? (
                <Button variant="outline" size="lg" className="w-full" disabled>
                  ✓ Completed
                </Button>
              ) : status === 'enrolled' ? (
                <Button
                  onClick={handleCompleteCourse}
                  loading={isCompleting}
                  size="lg"
                  className="w-full"
                >
                  Mark as Complete
                </Button>
              ) : status === 'full' ? (
                <Button variant="outline" size="lg" className="w-full" disabled>
                  Course Full
                </Button>
              ) : (
                <Button
                  onClick={handleEnroll}
                  loading={isEnrolling}
                  size="lg"
                  className="w-full"
                >
                  Enroll Now
                </Button>
              )}

              {!isAuthenticated && status === 'available' && (
                <p className="text-sm text-neutral-600 text-center">
                  Please login to enroll in this course
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
      )}
    </div>
  );
};

export default CourseDetailsPage;
