// import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
// import { signOutThunk } from "@/pageComponents/state/authenticationSlice";

import store from "./store";

// // Use throughout your app instead of plain `useDispatch` and `useSelector`
// type DispatchFunc = () => ApplicationDispatch;
// export const useApplicationDispatch: DispatchFunc = useDispatch;
// export const useApplicationSelector: TypedUseSelectorHook<ApplicationState> = useSelector;

export const getReduxState = () => {
  return store.getState();
};

// export const dispatchSignoutThunk = () => require("./store").default.dispatch(signOutThunk());
