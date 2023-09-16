import { clientStateSelector } from '@/app/state/clientSelector';
import { useApplicationDispatch, useApplicationSelector } from '@/redux/hooks';
import { ActionIcon, Aside, Badge, Flex, Title, useMantineColorScheme } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

type AsideHeaderPropsType = {
  title: string | undefined;
}

function AsideHeader({ title }: AsideHeaderPropsType) {
  const dispatch = useApplicationDispatch();
  const clientState = useApplicationSelector(clientStateSelector);
  return (
    <Aside.Section>
      <Flex align={"center"} justify={"space-between"}>
        <Title size={"h2"}>
          {title?.split(";").slice(0, 1) || ""}
        </Title>
        {/* <Badge size='xl' color={colorScheme === 'dark' ? 'gray' : 'dark'} radius="xs" variant="dot">{title?.split(";").slice(-1)}</Badge> */}
        <ActionIcon onClick={() => {
          dispatch({
            type: "Client/ControlApplicationShellComponents", payload: {
              ...clientState,
              showAsideBar: !clientState.showAsideBar,
            }
          });
        }}>
          <IconX size={"1.5rem"} />
        </ActionIcon>
      </Flex>
    </Aside.Section>
  );
}

export default AsideHeader;