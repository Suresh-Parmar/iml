"use client";

// import { useAuthentication } from '@/app/authentication/state';
// import { useApplicationDispatch } from '@/redux/hooks';
// import { useEffect } from 'react';

export default function SubjectsLayout({ children }: { children: React.ReactNode }) {
  // const dispatch = useApplicationDispatch();
  // const authentication = useAuthentication();
  // useEffect(() => {
  //   async function readData() {
  //     if (
  //       authentication.metadata.status !== 'unauthenticated' &&
  //       authentication.metadata.status !== 'authenticating'
  //     ) {
  //       dispatch({
  //         type: 'Client/ControlApplicationShellComponents',
  //         payload: {
  //           showHeader: true,
  //           showFooter: false,
  //           showNavigationBar: false,
  //           showAsideBar: false,
  //           asideState: {
  //             title: '',
  //             data: [],
  //           },
  //         },
  //       });
  //     } else {
  //       dispatch({
  //         type: 'Client/ControlApplicationShellComponents',
  //         payload: {
  //           showHeader: true,
  //           showFooter: false,
  //           showNavigationBar: false,
  //           showAsideBar: false,
  //           asideState: {
  //             title: '',
  //             data: [],
  //           },
  //         },
  //       });
  //     }
  //   }
  //   readData();
  // }, [authentication.metadata.status, dispatch]);
  return <>{children}</>;
}
