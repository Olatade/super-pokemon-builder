// This file outlines all Redux slices, thunks, reducers, and listeners needed for the Pokemon Team Builder app.

import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { createAppAsyncThunk } from '../withTypes';
import axios from 'axios';
import { Profile } from '@super-pokemon-builder/shared/data-models';

//--------------------------------------
// AUTH SLICE
//--------------------------------------

export const apiHome = 'http://localhost:3000';
export const authHeader = (
  username: string | null,
  password: string | null
) => ({
  headers: {
    Authorization: `Basic ${btoa(`${username}:${password}`)}`,
    'Content-Type': 'application/json',
  },
});

type AuthState = {
  id: string | null;
  username: string | null;
  email: string | null;
  password: string | null;
  created_at: string | null;
  status: 'idle' | 'pending' | 'succeeded' | 'rejected';
  error: string | null;
};

const initialState: AuthState = {
  // Note: a real app would probably have more complex auth state,
  // but for this example we'll keep things simple
  id: null,
  username: null,
  email: null,
  password: null,
  created_at: null,
  status: 'idle',
  error: null,
};

type ApiError = {
  message: string;
};

export const login = createAppAsyncThunk<
  Profile,
  { username: string; password: string },
  { rejectValue: ApiError }
>('profile/fetchProfile', async ({ username, password }, thunkAPI) => {
  try {
    const authHeader = 'Basic ' + btoa(`${username}:${password}`);

    const response = await axios.get<Profile>(`${apiHome}/profile/me`, {
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error: any) {
    const fallbackMessage = 'Network error or invalid credentials';
    return thunkAPI.rejectWithValue(
      error.response?.data || { message: fallbackMessage }
    );
  }
});

export const createProfile = createAppAsyncThunk<
  Profile,
  { username: string; email: string; password: string },
  { rejectValue: ApiError }
>('profile/createProfile', async ({ username, email, password }, thunkAPI) => {
  try {
    const response = await axios.post<Profile>(`${apiHome}/profile`, {
      username,
      email,
      password,
    });

    // Log in the user after successful profile creation
    thunkAPI.dispatch(login({ username, password }));

    return response.data;
  } catch (error: any) {
    let message = 'Network error or profile creation failed';
    if (
      error.response?.data?.message &&
      Array.isArray(error.response.data.message)
    ) {
      message = error.response.data.message.join(', ');
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    }
    return thunkAPI.rejectWithValue({ message });
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.id = null;
      state.username = null;
      state.email = null;
      state.password = null;
      state.created_at = null;
      state.status = 'idle';
      state.error = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // and handle the thunk actions instead
    builder
      .addCase(login.pending, (state) => {
        state.status = 'pending';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.id = action.payload.id ?? null;
        state.username = action.meta.arg.username;
        state.email = action.payload.email ?? null;
        state.password = action.meta.arg.password;
        state.created_at = action.payload.created_at
          ? action.payload.created_at.toString()
          : null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.payload?.message || 'Login failed';
      })
      .addCase(createProfile.pending, (state) => {
        state.status = 'pending';
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.id = action.payload.id ?? null;
        state.username = action.meta.arg.username;
        state.email = action.meta.arg.email;
        state.password = action.meta.arg.password;
        state.created_at = action.payload.created_at
          ? action.payload.created_at.toString()
          : null;
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.payload?.message || 'Profile creation failed';
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth;
export const selectCurrentUserId = (state: RootState) => state.auth.id;
export const selectCurrentUsername = (state: RootState) => state.auth.username;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;
