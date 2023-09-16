'use client';

import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import store from './store';
import { ReduxMainProvider } from './provider';

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  let persistor = persistStore(store);
  return (
    <ReduxMainProvider>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </ReduxMainProvider>
  );
}
