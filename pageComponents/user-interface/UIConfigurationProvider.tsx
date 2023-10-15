import { useState } from "react";
import MantineProvider from "@/pageComponents/user-interface/MantineProvider";
import ColorSchemeProvider from "@/pageComponents/user-interface/ColorSchemeProvider";
import { ColorScheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { useDispatch, useSelector } from "react-redux";
import { changeColorTheme } from "@/redux/slice";

export function UIConfigurationProvider({ children }: { children: React.ReactNode }) {
  let reduxData: any = useSelector((state: any) => state.data);
  let colorScheme: any = reduxData?.colorScheme;

  const dispatch = useDispatch();

  const toggleColorScheme = (value?: ColorScheme) => {
    dispatch(changeColorTheme(""));
  };

  return (
    <ColorSchemeProvider colorScheme={reduxData?.colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme, loader: "dots" }}>
        <Notifications position={"top-center"} autoClose={1500} />
        {children}
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
