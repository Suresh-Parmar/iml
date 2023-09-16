'use client';

import { useState } from 'react';
import MantineProvider from "@/app/state/user-interface/MantineProvider";
import ColorSchemeProvider from "@/app/state/user-interface/ColorSchemeProvider";
import { ColorScheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

export function UIConfigurationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{ colorScheme, loader: 'dots' }}
      >
        <Notifications position={"top-center"} autoClose={1500} />
        {children}
      </MantineProvider>
    </ColorSchemeProvider>
  );
}