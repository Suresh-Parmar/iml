"use client";

import Hero from "@/components/LandingPage/Hero";
import { Container, ScrollArea } from "@mantine/core";
import { useEffect } from "react";
import { useApplicationDispatch } from "@/redux/hooks";
import { useAuthentication } from "./authentication/state";
import { notifications } from "@mantine/notifications";
import { useSelector } from "react-redux";

export default function Home() {
  const authentication = useAuthentication();
  const dispatch = useApplicationDispatch();
  useEffect(() => {
    dispatch({
      type: "Client/UpdateApplicationShellPadding",
      payload: {
        applicationShellPadding: 0,
      },
    });
    dispatch({
      type: "Client/ControlApplicationShellComponents",
      payload: {
        showHeader: true,
        showFooter: false,
        showNavigationBar: false,
        hideNavigationBar: true,
        showAsideBar: false,
      },
    });
    if (authentication.metadata.status === "authenticated") {
      notifications.show({
        title: "Welcome back!",
        message: `Last Login: ${new Date(authentication.user?.last_login || Date()).toLocaleString()}`,
      });
    }
  }, [dispatch]);
  return (
    <Container
      fluid
      h={"100%"}
      mah={"100%"}
      miw={"100%"}
      p={0}
      mih={"100%"}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ScrollArea h={"100%"} w={"100%"} maw={"100%"}>
        <Hero />
      </ScrollArea>
    </Container>
  );
}
