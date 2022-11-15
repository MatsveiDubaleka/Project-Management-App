import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  token: '',
};

const slices = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setToken(state: Record<string, unknown>, action: PayloadAction<string>) {
      state.token = action.payload;
    },
  },
});

export const { setToken } = slices.actions;

export default slices.reducer;
