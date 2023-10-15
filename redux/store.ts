import { configureStore, createSerializableStateInvariantMiddleware, isPlain } from "@reduxjs/toolkit";
import dataslice from "./slice";
import { apiSlice } from "./apiSlice";

const serializableMiddleware = createSerializableStateInvariantMiddleware({
  isSerializable: () => true,
});
export const store = configureStore({
  reducer: {
    data: dataslice,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: false,
    }).concat(serializableMiddleware, apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
