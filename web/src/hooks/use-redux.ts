/**
 * Custom Redux Hooks
 */

import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "../store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Auth hooks
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  return {
    ...auth,
    dispatch,
  };
};

// Courses hooks
export const useCourses = () => {
  const dispatch = useAppDispatch();
  const courses = useAppSelector((state) => state.courses);

  return {
    ...courses,
    dispatch,
  };
};

// Enrollments hooks
export const useEnrollments = () => {
  const dispatch = useAppDispatch();
  const enrollments = useAppSelector((state) => state.enrollments);

  return {
    ...enrollments,
    dispatch,
  };
};

// Categories hooks
export const useCategories = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories);

  return {
    ...categories,
    dispatch,
  };
};
