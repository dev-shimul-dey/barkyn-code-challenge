/**
 * Courses Redux Slice
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  Course,
  CoursesState,
  PaginationParams,
  PaginatedResponse,
} from "../../types";
import { coursesApi } from "../../services/courses.api";

export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (params: PaginationParams | undefined, { rejectWithValue }) => {
    try {
      return await coursesApi.getCourses(params);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch courses",
      );
    }
  },
);

export const fetchCourse = createAsyncThunk(
  "courses/fetchCourse",
  async (uuid: string, { rejectWithValue }) => {
    try {
      return await coursesApi.getCourse(uuid);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch course",
      );
    }
  },
);

const initialState: CoursesState = {
  courses: [],
  selectedCourse: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {},
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<PaginationParams>) => {
      state.filters = action.payload;
    },
    clearSelectedCourse: (state) => {
      state.selectedCourse = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch courses
    builder.addCase(fetchCourses.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      fetchCourses.fulfilled,
      (state, action: PayloadAction<PaginatedResponse<Course>>) => {
        state.isLoading = false;
        state.courses = action.payload.data;
        state.pagination = action.payload.meta;
      },
    );
    builder.addCase(fetchCourses.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch single course
    builder.addCase(fetchCourse.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      fetchCourse.fulfilled,
      (state, action: PayloadAction<Course>) => {
        state.isLoading = false;
        state.selectedCourse = action.payload;
      },
    );
    builder.addCase(fetchCourse.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setFilters, clearSelectedCourse, clearError } =
  coursesSlice.actions;
export default coursesSlice.reducer;
