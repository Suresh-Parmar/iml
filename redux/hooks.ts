import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { ApplicationState, ApplicationDispatch } from './store';
import { signOutThunk } from '@/app/authentication/state/authenticationSlice';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
type DispatchFunc = () => ApplicationDispatch;
export const useApplicationDispatch: DispatchFunc = useDispatch;
export const useApplicationSelector: TypedUseSelectorHook<ApplicationState> =
  useSelector;

export const getReduxState: () => ApplicationState = () =>
  require('./store').default.getState();

export const dispatchSignoutThunk = () =>
  require('./store').default.dispatch(signOutThunk());
