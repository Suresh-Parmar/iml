import Hero from "@/components/LandingPage/Hero";
import { Container, ScrollArea } from "@mantine/core";
import { useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { useDispatch, useSelector } from "react-redux";
import { setGetData } from "@/helpers/getLocalStorage";
import { ControlApplicationShellComponents } from "@/redux/slice";

export default function Home() {
  const authentication = setGetData("userData", "", true);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      ControlApplicationShellComponents({
        showHeader: true,
        showFooter: false,
        showNavigationBar: true,
        hideNavigationBar: true,
        showAsideBar: false,
      })
    );
    if (authentication?.metadata?.status === "authenticated") {
      notifications.show({
        title: "Welcome back!",
        message: `Last Login: ${new Date(authentication?.user?.last_login || Date()).toLocaleString()}`,
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
