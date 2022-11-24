import { ITaskOutputData } from './../../types/types';
import { createSlice, createAction } from '@reduxjs/toolkit';

const setTasks = createAction<ITaskOutputData[]>('SET_TASKS');

const taskSlice = createSlice({
  name: 'tasks',
  initialState: [] as ITaskOutputData[],
  reducers: {
    setTasks: (state, action) => {
      return [...action.payload];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setTasks, (state, action) => {
      return [...action.payload];
    });
  },
});

export default taskSlice;
