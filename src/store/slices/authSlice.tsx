import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IBoardsOfUser } from 'types/types';

const initialState = {
  token: '',
  boards: [] as IBoardsOfUser[],
  userBoards: [] as IBoardsOfUser[],
  isLoaded: false,
  board: [] as IBoardsOfUser,
  isValidated: false,
  modal: '',
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
    setBoard(state: Record<string, unknown>, action: PayloadAction<IBoardsOfUser>) {
      state.board = action.payload;
    },
    setUserBoards(state: Record<string, unknown>, action: PayloadAction<IBoardsOfUser>) {
      state.userBoards = action.payload;
    },
    setValidation(state: Record<string, unknown>, action: PayloadAction<boolean>) {
      state.isValidated = action.payload;
    },
    setModal(state: Record<string, unknown>, action: PayloadAction<string>) {
      state.modal = action.payload;
    },
  },
});

export const {
  setToken,
  setBoards,
  setUserBoards,
  setIsLoaded,
  setBoard,
  setValidation,
  setModal,
} = slices.actions;

export default slices.reducer;
