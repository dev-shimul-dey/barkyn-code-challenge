/**
 * Categories API Service
 */

import { apiClient } from "./api-client";
import type { Category } from "../types";

export const categoriesApi = {
  /**
   * Get all categories
   */
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get("/api/categories");
    return response.data;
  },
};
