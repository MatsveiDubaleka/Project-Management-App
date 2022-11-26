import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import columnReducer from './slices/columnSlice';
import taskReducer from './slices/taskSlice';
import loadingSlice from './slices/loadingSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    columns: columnReducer.reducer,
    tasks: taskReducer.reducer,
    loading: loadingSlice.reducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
