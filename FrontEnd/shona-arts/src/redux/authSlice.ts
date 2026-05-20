import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { api } from '../services/api';
import type { User } from '../utils/types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

const token = localStorage.getItem('shona_token');

export const login = createAsyncThunk('auth/login', async (payload: { email: string; password: string }) => {
  const { data } = await api.post<{ user: User; token: string }>('/auth/login', payload);
  return data;
});

export const register = createAsyncThunk('auth/register', async (payload: { name: string; email: string; password: string }) => {
  const { data } = await api.post<{ user: User; token: string }>('/auth/register', payload);
  return data;
});

export const googleLogin = createAsyncThunk('auth/google', async (payload: { credential: string }) => {
  const { data } = await api.post<{ user: User; token: string }>('/auth/google', payload);
  return data;
});

const initialState: AuthState = { user: null, token, loading: false };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('shona_token');
    },
    hydrateUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isAnyOf(login.pending, register.pending, googleLogin.pending), (state) => {
        state.loading = true;
      })
      .addMatcher(isAnyOf(login.fulfilled, register.fulfilled, googleLogin.fulfilled), (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('shona_token', action.payload.token);
      })
      .addMatcher(isAnyOf(login.rejected, register.rejected, googleLogin.rejected), (state) => {
        state.loading = false;
      });
  },
});

export const { logout, hydrateUser } = authSlice.actions;
export default authSlice.reducer;
