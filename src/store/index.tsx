import { configureStore } from '@reduxjs/toolkit';
import sliceReducer from './slices';

const store = configureStore({
  reducer: {
    slices: sliceReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
