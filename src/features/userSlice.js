import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: typeof window !== 'undefined' && window.localStorage.getItem("newInventariador")
    ? JSON.parse(window.localStorage.getItem("newInventariador") || "")
    : null,
  ultimoBien: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUltimoBien: (state, action) => {
      state.ultimoBien = action.payload;
    }
  },
});

// Action creators are generated for each case reducer function
export const { setUser, setUltimoBien } = userSlice.actions;

export default userSlice.reducer;