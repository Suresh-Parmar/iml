'use client';

import './globals.css';
import { Inter } from 'next/font/google';

import AuthenticationProvider from '@/app/authentication/state';
import UIConfigurationProvider from './state';
import ApplicationShell from '@/components/ApplicationShell';
import ReduxProvider from '@/redux/persistProvider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <AuthenticationProvider>
            <UIConfigurationProvider>
              <ApplicationShell>{children}</ApplicationShell>
            </UIConfigurationProvider>
          </AuthenticationProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
