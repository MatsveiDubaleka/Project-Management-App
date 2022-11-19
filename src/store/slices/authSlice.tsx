import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IBoardsOfUser } from 'types/types';

const initialState = {
  token: '',
  boards: [] as IBoardsOfUser[],
  isLoaded: false,
};

const slices = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setToken(state: Record<string, unknown>, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    setBoards(state: Record<string, unknown>, action: PayloadAction<IBoardsOfUser[]>) {
      state.boards = action.payload;
    },
    setIsLoaded(state: Record<string, unknown>, action: PayloadAction<boolean>) {
      state.isLoaded = action.payload;
    },
  },
});

export const { setToken, setBoards, setIsLoaded } = slices.actions;

export default slices.reducer;
