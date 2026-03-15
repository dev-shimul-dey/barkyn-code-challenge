/**
 * Redux Store Configuration
 */

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import coursesReducer from "./slices/courses.slice";
import enrollmentsReducer from "./slices/enrollments.slice";
import categoriesReducer from "./slices/categories.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    enrollments: enrollmentsReducer,
    categories: categoriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
