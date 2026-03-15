/**
 * Users API Service
 */

import { apiClient } from "./api-client";
import type { User, UserProfile } from "../types";

export const usersApi = {
  /**
   * Create or login a user
   */
  login: async (name: string): Promise<User> => {
    const response = await apiClient.post("/api/users", { name });
    return response.data;
  },

  /**
   * Get user by UUID
   */
  getUser: async (uuid: string): Promise<User> => {
    const response = await apiClient.get(`/api/users/${uuid}`);
    return response.data;
  },

  /**
   * Get user profile with enrollment information
   */
  getProfile: async (uuid: string): Promise<UserProfile> => {
    const response = await apiClient.get(`/api/users/${uuid}/profile`);
    return response.data;
  },
};
