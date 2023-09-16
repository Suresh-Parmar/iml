"use client";

// import { useAuthentication } from "@/app/authentication/state";
// import { useApplicationDispatch } from "@/redux/hooks";
// import { ChangeEvent, useEffect, useState } from "react";
// import { Button, Center, Text, Container, Loader, Paper, TextInput } from "@mantine/core";
// import { IconNetwork } from "@tabler/icons-react";

export default function StudentsLayout({ children }: { children: React.ReactNode }) {
  // const dispatch = useApplicationDispatch();
  // const authentication = useAuthentication();
  // useEffect(() => {
  //   async function readData() {
  //     if (authentication.metadata.status !== "unauthenticated" && authentication.metadata.status !== "authenticating") {
  //       dispatch({
  //         type: "Client/ControlApplicationShellComponents", payload: {
  //           showHeader: true,
  //           showFooter: false,
  //           showNavigationBar: false,
  //           showAsideBar: false,
  //           asideState: {
  //             title: "",
  //             data: [],
  //           }
  //         }
  //       });
  //     } else {
  //       dispatch({
  //         type: "Client/ControlApplicationShellComponents", payload: {
  //           showHeader: true,
  //           showFooter: false,
  //           showNavigationBar: false,
  //           showAsideBar: false,
  //           asideState: {
  //             title: "",
  //             data: [],
  //           }
  //         }
  //       });
  //     }
  //   }
  //   readData();
  // }, [authentication.metadata.status, dispatch]);
  return (
    // <Container h={"100%"} w={"100%"} fluid sx={{ border: "1px solid green" }}>
    <>{children}</>
    // </Container>
  );
}
