/**
 * Auth Redux Slice
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User, AuthState } from "../../types";
import { usersApi } from "../../services/users.api";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (name: string, { rejectWithValue }) => {
    try {
      const user = await usersApi.login(name);
      localStorage.setItem("userUuid", user.uuid);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

export const restoreSession = createAsyncThunk(
  "auth/restoreSession",
  async (_, { rejectWithValue }) => {
    try {
      const userUuid = localStorage.getItem("userUuid");
      if (!userUuid) {
        throw new Error("No session found");
      }
      const user = await usersApi.getUser(userUuid);
      return user;
    } catch (error: any) {
      localStorage.removeItem("userUuid");
      return rejectWithValue("Session expired");
    }
  },
);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("userUuid");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      loginUser.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      },
    );
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.isAuthenticated = false;
    });

    // Restore session
    builder.addCase(restoreSession.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      restoreSession.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      },
    );
    builder.addCase(restoreSession.rejected, (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
    });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
