import { ControlApplicationShellComponents, changeColorTheme } from "@/redux/slice";
import { ActionIcon, Aside, Badge, Flex, Title, useMantineColorScheme } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";

type AsideHeaderPropsType = {
  title: string | undefined;
};

function AsideHeader({ title }: AsideHeaderPropsType) {
  const dispatch = useDispatch();
  const allReduxData = useSelector((state: any) => state.data);

  let colorScheme = allReduxData.colorScheme;
  let toggleColorScheme = () => {
    dispatch(changeColorTheme(""));
  };

  return (
    <Aside.Section>
      <Flex align={"center"} justify={"space-between"}>
        <Title size={"h2"}>{title?.split(";").slice(0, 1) || ""}</Title>
        <Badge size="xl" color={colorScheme === "dark" ? "gray" : "dark"} radius="xs" variant="dot">
          {title?.split(";").slice(-1)}
        </Badge>
        <ActionIcon
          onClick={() => {
            dispatch(ControlApplicationShellComponents({ ...allReduxData, showAsideBar: !allReduxData.showAsideBar }));
          }}
        >
          <IconX size={"1.5rem"} />
        </ActionIcon>
      </Flex>
    </Aside.Section>
  );
}

export default AsideHeader;
