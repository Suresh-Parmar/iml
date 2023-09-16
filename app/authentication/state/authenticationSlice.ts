import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { signInWithEMail } from './authenticationAPI';
import { AuthenticationStateType } from '../types';

const initialState: AuthenticationStateType = {
  metadata: {},
  user: {},
};

export const signOutThunk = createAsyncThunk(
  'Authentication/SignOut',
  async () => {
    return {
      user: {},
      metadata: {
        status: 'unauthenticated',
      },
    };
  }
);

export const signInWithEMailThunk = createAsyncThunk(
  'Authentication/SignInWithEMail',
  async ({
    loginType,
    email,
    password,
  }: {
    loginType: 'super_admin' | 'users';
    email: string;
    password: string;
  }) => {
    if (email !== undefined && password !== undefined) {
      const response = await signInWithEMail(loginType, email, password);
      return response;
    } else {
      return {
        user: {},
        metadata: {},
      };
    }
  }
);

export const authenticationSlice = createSlice({
  name: 'Authentication',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signInWithEMailThunk.pending, (state) => ({
        ...state,
        metadata: {
          ...state.metadata,
          status: 'authenticating',
          role: undefined,
          geodata: undefined,
        },
        user: {},
      }))
      .addCase(signInWithEMailThunk.fulfilled, (state, action) => ({
        ...state,
        user: action.payload.user,
        metadata: {
          geodata: action.payload.metadata.geodata,
          status: action.payload.metadata.status,
          role: action.payload.metadata.role,
          token: action.payload.metadata.token,
        },
      }))
      .addCase(signOutThunk.fulfilled, () => ({
        user: {},
        metadata: {
          status: 'unauthenticated',
        },
      }));
  },
});

export default authenticationSlice;
