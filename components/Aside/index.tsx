import { Aside as MantineAside, MediaQuery, Transition } from '@mantine/core';
import { AsideFooter, AsideHeader, AsideMain } from './components';
import { AsidePropsType } from './types';
import { useEffect, useState } from 'react';

function Aside({ form, header, mounted }: AsidePropsType) {
  return (
    <Transition mounted={mounted} keepMounted={false} transition={"slide-left"} duration={400} timingFunction="ease">
      {(styles) => (
        <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
          <MantineAside p="sm" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
            <AsideHeader title={`${header}`} />
            <AsideMain form={form} />
            {/* <AsideFooter /> */}
          </MantineAside>
        </MediaQuery>
      )}
    </Transition>
  );
}

export default Aside;