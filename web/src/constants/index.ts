/**
 * Application Constants
 */

export const APP_NAME = "Barkyn";
export const APP_DESCRIPTION = "Learn about anything dog related with us.";

/**
 * API Configuration
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";
export const API_TIMEOUT = 10000; // 10 seconds

/**
 * Route Paths
 */
export const ROUTES = {
  HOME: "/",
  COURSES: "/courses",
  COURSE_DETAILS: "/courses/:courseUuid",
  PROFILE: "/profile",
} as const;

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  USER_UUID: "userUuid",
  AUTH_TOKEN: "authToken",
} as const;

/**
 * Course Status
 */
export const COURSE_STATUS = {
  AVAILABLE: "available",
  ENROLLED: "enrolled",
  COMPLETED: "completed",
  FULL: "full",
} as const;

/**
 * Pagination Defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  LOGIN_FAILED: "Login failed. Please try again.",
  ENROLLMENT_FAILED: "Failed to enroll in course.",
  FETCH_COURSES_FAILED: "Failed to fetch courses.",
  FETCH_PROFILE_FAILED: "Failed to fetch profile.",
  SESSION_EXPIRED: "Your session has expired. Please login again.",
  NETWORK_ERROR: "Network error. Please try again later.",
} as const;

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Login successful!",
  ENROLLMENT_SUCCESS: "Successfully enrolled in course!",
  COURSE_COMPLETED: "Congratulations! Course completed.",
} as const;
