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
};

const initialState: AuthState = {
  // Note: a real app would probably have more complex auth state,
  // but for this example we'll keep things simple
  id: null,
  username: null,
  email: null,
  password: null,
  created_at: null,
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
    },
  },
  extraReducers: (builder) => {
    // and handle the thunk actions instead
    builder.addCase(login.fulfilled, (state, action) => {
      state.id = action.payload.id ?? null;
      state.username = action.payload.username ?? null;
      state.email = action.payload.email ?? null;
      state.password = action.payload.password ?? null;
      state.created_at = action.payload.created_at
        ? action.payload.created_at.toString()
        : null;
    });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth;
export const selectCurrentUserId = (state: RootState) => state.auth.id;
export const selectCurrentUsername = (state: RootState) => state.auth.username;
