import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
  createSerializableStateInvariantMiddleware,
} from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

import { authenticationReducer } from "../app/authentication/state";
import { clientReducer } from "../app/state";

const persistConfig = {
  key: "root",
  storage,
};

const serializableMiddleware = createSerializableStateInvariantMiddleware({
  isSerializable: () => true,
});

const reducers = combineReducers({
  client: clientReducer,
  authentication: authenticationReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export function makeStore() {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefault) =>
      getDefault({
        serializableCheck: false,
      }).concat(serializableMiddleware),
  });
}

const store = makeStore();

export type ApplicationState = ReturnType<typeof store.getState>;
export type ApplicationDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, ApplicationState, unknown, Action<string>>;

export default store;
