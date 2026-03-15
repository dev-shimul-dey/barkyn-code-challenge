/**
 * Utility Functions
 */

import type { Course, Enrollment } from "../types";

/**
 * Get enrollment status for a course
 */
export const getEnrollmentStatus = (
  course: Course,
  enrollments: Enrollment[],
): "enrolled" | "completed" | "available" | "full" => {
  const enrollment = enrollments.find(
    (e) => e.courseUuid === course.uuid || e.course?.uuid === course.uuid,
  );

  if (enrollment) {
    return enrollment.completed ? "completed" : "enrolled";
  }

  if (course.occupiedSeats >= course.totalSeats) {
    return "full";
  }

  return "available";
};

/**
 * Format price to currency
 */
export const formatPrice = (price: number, currency = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
};

/**
 * Calculate available seats
 */
export const getAvailableSeats = (course: Course): number => {
  return course.totalSeats - course.occupiedSeats;
};

/**
 * Check if course is full
 */
export const isCourseFull = (course: Course): boolean => {
  return course.occupiedSeats >= course.totalSeats;
};

/**
 * Safe date formatting with fallback
 */
export const formatDate = (dateStr?: string | null): string => {
  if (!dateStr) return "N/A";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString();
  } catch {
    return "N/A";
  }
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, length: number = 100): string => {
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

/**
 * Debounce function for search inputs
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
