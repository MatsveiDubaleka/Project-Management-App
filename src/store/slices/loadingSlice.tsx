import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setIsLoaded } from 'store/slices/authSlice';
const initialState = {
  isLoading: false,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoading(state: Record<string, unknown>, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setLoading } = loadingSlice.actions;

export default loadingSlice;
