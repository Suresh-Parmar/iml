import { useState } from "react";

import { Navbar } from "@mantine/core";
import { NavigationBarPropsType } from "./types";
import { NavigationBarMain } from "./components";

import { IconArrowBigLeftLines, IconArrowBigRightLine } from "@tabler/icons-react";
import { setGetData } from "@/helpers/getLocalStorage";

function NavigationBar(props: NavigationBarPropsType) {
  const [opened, setOpened] = useState(false);

  let isDarkThem = setGetData("colorScheme");
  isDarkThem = isDarkThem == "dark";
  const backgroundClr = isDarkThem ? " bg-dark" : " bg-light";

  return (
    <Navbar px={"xs"} py="md" width={{ sm: 200, lg: opened ? 80 : 220 }}>
      {/* <NavigationBarHeader /> */}
      <NavigationBarMain opened={opened} />
      {/* <NavigationBarFooter /> */}

      <div
        className={"d-flex justify-content-end mt-2 pointer " + backgroundClr}
        onClick={(event) => {
          setOpened(!opened);
        }}
      >
        {opened ? <IconArrowBigRightLine stroke={1.5} /> : <IconArrowBigLeftLines stroke={1.5} />}
      </div>
    </Navbar>
  );
}

export default NavigationBar;
