import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser, MeData } from "@/lib/api/types";

export interface AuthState {
  accessToken: string | null;
  user: AuthUser | MeData | null;
  isAuthenticated: boolean;
  sessionRestored: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
  sessionRestored: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
        user: AuthUser | MeData;
        rememberMe?: boolean;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.sessionRestored = true;
    },
    setUser: (state, action: PayloadAction<MeData>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
      state.sessionRestored = true;
    },
    hydrateToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
      state.sessionRestored = true;
    },
    restoreSessionComplete: (state) => {
      state.sessionRestored = true;
    },
  },
});

export const {
  setCredentials,
  setUser,
  logout,
  hydrateToken,
  restoreSessionComplete,
} = authSlice.actions;

export default authSlice.reducer;
