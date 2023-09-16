'use client';

import { createContext } from 'react';
import { AuthenticationStateType } from '../types';

export const AuthenticationContext = createContext<AuthenticationStateType>({
  metadata: {},
  user: {},
});
