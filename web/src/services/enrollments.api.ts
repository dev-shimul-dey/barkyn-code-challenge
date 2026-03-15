/**
 * Enrollments API Service
 */

import { apiClient } from "./api-client";
import type { Enrollment } from "../types";

export const enrollmentsApi = {
  /**
   * Enroll a user in a course
   */
  enroll: async (courseUuid: string): Promise<Enrollment> => {
    const response = await apiClient.post("/api/enrollments", { courseUuid });
    return response.data;
  },

  /**
   * Mark a course as completed
   */
  completeCourse: async (courseUuid: string): Promise<Enrollment> => {
    const response = await apiClient.patch(
      `/api/enrollments/${courseUuid}/complete`,
    );
    return response.data;
  },

  /**
   * Get user's enrollments
   */
  getMyEnrollments: async (): Promise<Enrollment[]> => {
    const response = await apiClient.get("/api/enrollments");
    return response.data;
  },
};
