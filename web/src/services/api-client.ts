/**
 * API Configuration
 */

import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Interceptor to add user UUID header if user is authenticated
    this.client.interceptors.request.use((config) => {
      const userUuid = localStorage.getItem("userUuid");
      if (userUuid) {
        config.headers["x-user-id"] = userUuid;
      }
      return config;
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("userUuid");
          window.location.href = "/";
        }
        return Promise.reject(error);
      },
    );
  }

  public getClient(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient().getClient();
export const API_URL = API_BASE_URL;
