'use client';

import { AppShell as MantineAppShell, Text } from '@mantine/core';
import { ApplicationShellPropsType } from './types';
import Header from '../Header';
import NavigationBar from '../NavigationBar';
import Footer from '../Footer';
import Aside from '../Aside';
import { useState } from 'react';
import { useApplicationSelector } from '@/redux/hooks';
import { clientStateSelector } from '@/app/state/clientSelector';

function ApplicationShell({ children }: ApplicationShellPropsType) {
  const clientState = useApplicationSelector(clientStateSelector);
  const [opened, setOpened] = useState<boolean>(clientState.showNavigationBar);
  return (
    <MantineAppShell
      padding={clientState.applicationShellPadding}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        clientState.hideNavigationBar ? undefined : (
          <NavigationBar
            opened={!clientState.showNavigationBar}
            setOpened={setOpened}
          />
        )
      }
      aside={
        clientState.showAsideBar ? (
          <Aside
            mounted={clientState.showAsideBar}
            header={clientState.asideState.title}
            form={clientState.asideState.form}
          />
        ) : undefined
      }
      header={
        clientState.showHeader ? (
          <Header />
        ) : undefined
      }
      footer={clientState.showFooter ? <Footer /> : undefined}
      styles={(theme) => ({
        main: {
          background:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
          maxHeight: '100vh',
          maxWidth: '100vw',
        },
      })}
    >
      {children}
    </MantineAppShell>
  );
}

export default ApplicationShell;
