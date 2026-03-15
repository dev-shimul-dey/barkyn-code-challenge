/**
 * Courses API Service
 */

import { apiClient } from "./api-client";
import type { Course, PaginationParams, PaginatedResponse } from "../types";

export const coursesApi = {
  /**
   * Get all courses with pagination and filtering
   */
  getCourses: async (
    params?: PaginationParams,
  ): Promise<PaginatedResponse<Course>> => {
    const response = await apiClient.get("/api/courses", { params });
    return response.data;
  },

  /**
   * Get a single course by UUID
   */
  getCourse: async (uuid: string): Promise<Course> => {
    const response = await apiClient.get(`/api/courses/${uuid}`);
    return response.data;
  },

  /**
   * Search courses
   */
  searchCourses: async (
    search: string,
    params?: PaginationParams,
  ): Promise<PaginatedResponse<Course>> => {
    return coursesApi.getCourses({ ...params, search });
  },

  /**
   * Filter courses by category
   */
  getCoursesByCategory: async (
    categoryId: number,
    params?: PaginationParams,
  ): Promise<PaginatedResponse<Course>> => {
    return coursesApi.getCourses({ ...params, categoryId });
  },
};
