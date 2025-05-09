import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: {
    uid: string;
    email: string | null;
    displayName?: string | null;
    role: 'farmer' | 'consumer';
  } | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthState['user']>) => {
      state.user = {
        uid: action.payload.uid,
        email: action.payload.email,
        displayName: action.payload.displayName,
        role: action.payload.role,
      };
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
