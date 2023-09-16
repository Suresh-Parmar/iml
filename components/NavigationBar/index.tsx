import { Navbar } from '@mantine/core';
import { NavigationBarPropsType } from './types';
import { NavigationBarFooter, NavigationBarHeader, NavigationBarMain } from './components';
import { useHover } from '@mantine/hooks';

function NavigationBar(props: NavigationBarPropsType) {
  const { opened, setOpened } = props;
  const { hovered, ref } = useHover();
  return (
    <Navbar ref={ref} px={"xs"} py="md" width={{ sm: 200, lg: !hovered && opened ? 80 : 220 }}>
      {/* <NavigationBarHeader /> */}
      <NavigationBarMain opened={!hovered && opened} />
      {/* <NavigationBarFooter /> */}
    </Navbar>
  );
}

export default NavigationBar;