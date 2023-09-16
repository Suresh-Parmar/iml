"use client"

import { useApplicationDispatch } from "@/redux/hooks";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";
import { useAuthentication } from "../authentication/state";

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useApplicationDispatch();
  const authentication = useAuthentication();
  useEffect(() => {
    if (!authentication?.metadata?.status || authentication.metadata.status === "unauthenticated") {
      router.push("/authentication/signin");
    } else {
      dispatch({
        type: "Client/UpdateApplicationShellPadding", payload: {
          applicationShellPadding: 0,
        }
      });
      dispatch({
        type: "Client/ControlApplicationShellComponents", payload: {
          showHeader: true,
          showFooter: false,
          showNavigationBar: true,
          hideNavigationBar: false,
          showAsideBar: false,
        }
      });
    }
  }, [authentication.metadata.status, dispatch, router]);
  return (
    <>
      {children}
    </>
  )
}
