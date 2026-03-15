/**
 * Enrollments Redux Slice
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Enrollment, EnrollmentState } from "../../types";
import { enrollmentsApi } from "../../services/enrollments.api";

export const enrollCourse = createAsyncThunk(
  "enrollments/enrollCourse",
  async (courseUuid: string, { rejectWithValue }) => {
    try {
      return await enrollmentsApi.enroll(courseUuid);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Enrollment failed",
      );
    }
  },
);

export const completeCourse = createAsyncThunk(
  "enrollments/completeCourse",
  async (courseUuid: string, { rejectWithValue }) => {
    try {
      return await enrollmentsApi.completeCourse(courseUuid);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to complete course",
      );
    }
  },
);

export const fetchMyEnrollments = createAsyncThunk(
  "enrollments/fetchMyEnrollments",
  async (_, { rejectWithValue }) => {
    try {
      return await enrollmentsApi.getMyEnrollments();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch enrollments",
      );
    }
  },
);

const initialState: EnrollmentState = {
  enrollments: [],
  isLoading: false,
  error: null,
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Enroll course
    builder.addCase(enrollCourse.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      enrollCourse.fulfilled,
      (state, action: PayloadAction<Enrollment>) => {
        state.isLoading = false;
        state.enrollments.push(action.payload);
      },
    );
    builder.addCase(enrollCourse.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Complete course
    builder.addCase(completeCourse.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      completeCourse.fulfilled,
      (state, action: PayloadAction<Enrollment>) => {
        state.isLoading = false;
        const index = state.enrollments.findIndex(
          (e) => e.courseUuid === action.payload.courseUuid,
        );
        if (index !== -1) {
          state.enrollments[index] = action.payload;
        }
      },
    );
    builder.addCase(completeCourse.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch enrollments
    builder.addCase(fetchMyEnrollments.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      fetchMyEnrollments.fulfilled,
      (state, action: PayloadAction<Enrollment[]>) => {
        state.isLoading = false;
        state.enrollments = action.payload;
      },
    );
    builder.addCase(fetchMyEnrollments.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;
