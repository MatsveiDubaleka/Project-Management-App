import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IBoardsOfUser } from 'types/types';

const initialState = {
  token: '',
  boards: [] as IBoardsOfUser[],
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
  },
});

export const { setToken, setBoards } = slices.actions;

export default slices.reducer;
