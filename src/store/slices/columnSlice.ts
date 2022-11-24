import { IBoardColumns } from 'types/types';
import { createSlice, createAction } from '@reduxjs/toolkit';

const setColumns = createAction<IBoardColumns[]>('SET_COLUMNS');

const columnSlice = createSlice({
  name: 'columns',
  initialState: [] as IBoardColumns[],
  reducers: {
    setColumns: (state, action) => {
      return [...action.payload];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setColumns, (state, action) => {
      return [...action.payload];
    });
  },
});

export default columnSlice;
