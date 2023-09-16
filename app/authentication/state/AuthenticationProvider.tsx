'use client';

import { useApplicationSelector } from '@/redux/hooks';
import { AuthenticationContext } from './AuthenticationContext';
import { authenticationSelector } from './authenticationSelector';
import { useEffect, useState } from 'react';

export function AuthenticationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  let authentication = useApplicationSelector(authenticationSelector);
  const [
    authenticationStateFromSessionStorage,
    setAuthenticationStateFromSessionStorage,
  ] = useState<string | null>(null);
  useEffect(() => {
    const fetchedAuthenticationStateFromSessionStorage =
      window.sessionStorage.getItem('authentication.shunyaek.se');
    setAuthenticationStateFromSessionStorage(
      fetchedAuthenticationStateFromSessionStorage
    );
  }, []);
  if (authenticationStateFromSessionStorage !== null) {
    authentication = JSON.parse(authenticationStateFromSessionStorage);
  }
  return (
    <AuthenticationContext.Provider value={authentication}>
      {children}
    </AuthenticationContext.Provider>
  );
}
