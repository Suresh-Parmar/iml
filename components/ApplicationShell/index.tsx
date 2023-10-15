import { AppShell as MantineAppShell, Text } from "@mantine/core";
import Header from "../Header";
import NavigationBar from "../NavigationBar";
import Footer from "../Footer";
import Aside from "../Aside";
import { useState } from "react";
import { setGetData } from "@/helpers/getLocalStorage";
import { useSelector } from "react-redux";

function ApplicationShell({ children }: any) {
  let getUserData: any = setGetData("userData", "", true);
  const allReduxData: any = useSelector((state) => state);
  const clientState = allReduxData.data;

  let isloggedIn = getUserData?.metadata?.status;
  let hideNavBar = isloggedIn != "authenticated" || clientState?.showNavigationBar;

  const [opened, setOpened] = useState<boolean>(clientState?.showNavigationBar);
  return (
    <MantineAppShell
      padding={clientState?.applicationShellPadding}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={hideNavBar ? undefined : <NavigationBar opened={!opened} setOpened={setOpened} />}
      aside={
        clientState?.showAsideBar ? (
          <Aside
            mounted={clientState?.showAsideBar}
            header={clientState?.asideState.title}
            form={clientState?.asideState.form}
          />
        ) : undefined
      }
      header={clientState?.showHeader ? <Header /> : undefined}
      footer={clientState?.showFooter ? <Footer /> : undefined}
      styles={(theme) => ({
        main: {
          background: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
          maxHeight: "100vh",
          maxWidth: "100vw",
        },
      })}
    >
      {children}
    </MantineAppShell>
  );
}

export default ApplicationShell;
