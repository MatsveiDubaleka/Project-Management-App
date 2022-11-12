import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  // initial states
};

const slices = createSlice({
  name: 'slices',
  initialState,
  reducers: {
    // setFirstState(state: Record<string, unknown>, action: PayloadAction<string>) {
    //   state.searchValue = action.payload;
    // }
  },
});

export const {
  setFirstState,
} = slices.actions;

export default slices.reducer;
