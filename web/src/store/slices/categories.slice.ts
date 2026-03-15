/**
 * Categories Redux Slice
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Category, CategoriesState } from "../../types";
import { categoriesApi } from "../../services/categories.api";

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      return await categoriesApi.getCategories();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories",
      );
    }
  },
);

const initialState: CategoriesState = {
  categories: [],
  isLoading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      fetchCategories.fulfilled,
      (state, action: PayloadAction<Category[]>) => {
        state.isLoading = false;
        state.categories = action.payload;
      },
    );
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError } = categoriesSlice.actions;
export default categoriesSlice.reducer;
