/**
 * Core types for the application
 */

export interface User {
  uuid: string;
  name: string;
}

export interface UserProfile extends User {
  enrolledCourses: string[];
  completedCourses: string[];
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  uuid: string;
  title: string;
  description: string;
  price: number;
  totalSeats: number;
  occupiedSeats: number;
  category: Category;
  enrollmentStatus?: "enrolled" | "completed" | "available" | "full";
  prerequisite?: Course;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: number;
  userUuid: string;
  courseUuid: string;
  completed: boolean;
  course?: Course;
  createdAt: string;
  updatedAt: string;
  enrolledAt?: string;
  completedAt?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  categoryId?: number;
  search?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface CoursesState {
  courses: Course[];
  selectedCourse: Course | null;
  isLoading: boolean;
  error: string | null;
  pagination: PaginationMeta;
  filters: PaginationParams;
}

export interface EnrollmentState {
  enrollments: Enrollment[];
  isLoading: boolean;
  error: string | null;
}

export interface CategoriesState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}
