/**
 * Custom React Hooks
 */

import { useEffect } from "react";
import { useAppDispatch } from "./use-redux";
import { fetchCourses, fetchCourse } from "../store/slices/courses.slice";
import { fetchMyEnrollments } from "../store/slices/enrollments.slice";
import { fetchCategories } from "../store/slices/categories.slice";
import { restoreSession } from "../store/slices/auth.slice";
import type { PaginationParams } from "../types";

// Export Redux hooks
export {
  useAuth,
  useCourses,
  useEnrollments,
  useCategories,
  useAppDispatch,
  useAppSelector,
} from "./use-redux";

/**
 * Hook to restore user session on app load
 */
export const useRestoreSession = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);
};

/**
 * Hook to fetch courses with pagination and filtering
 */
export const useFetchCourses = (params?: PaginationParams) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCourses(params));
  }, [
    dispatch,
    params?.page,
    params?.limit,
    params?.categoryId,
    params?.search,
  ]);
};

/**
 * Hook to fetch single course
 */
export const useFetchCourse = (uuid: string) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (uuid) {
      dispatch(fetchCourse(uuid));
    }
  }, [dispatch, uuid]);
};

/**
 * Hook to fetch user enrollments
 */
export const useFetchEnrollments = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchMyEnrollments());
  }, [dispatch]);
};

/**
 * Hook to fetch categories
 */
export const useFetchCategories = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
};
