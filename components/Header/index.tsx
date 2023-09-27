import {
  Header as MantineHeader,
  HoverCard,
  SimpleGrid,
  ThemeIcon,
  Anchor,
  Center,
  Drawer,
  Collapse,
  Burger,
  Text,
  Box,
  Group,
  useMantineColorScheme,
  rem,
  Button,
  ScrollArea,
  Select,
  UnstyledButton,
  // LoadingOverlay,
  Divider,
  ActionIcon,
  Menu,
  Avatar,
} from "@mantine/core";
import { HeaderPropsType } from "./types";
import {
  IconChevronDown,
  IconChevronDownLeft,
  IconHome,
  IconLogout,
  IconMoonStars,
  IconSun,
  IconUser,
} from "@tabler/icons-react";
import { Logo } from "./_logo";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthentication } from "@/app/authentication/state";
import { forwardRef, useEffect, useState } from "react";
import { clientStateSelector } from "@/app/state/clientSelector";
import { getGeographicalInformation, readCountriesLandingWithFlags, readCountriesWithFlags } from "@/utilities/API";
import ReactCountryFlag from "react-country-flag";
import { useDisclosure } from "@mantine/hooks";

import { useStyles } from "../LandingPage/Hero/styles";
// import { mockdata } from "../LandingPage/Hero/Menu";
import Marquee from "react-fast-marquee";
import { GeographicalInformationType } from "@/utilities/api-types";
import { useApplicationDispatch, useApplicationSelector } from "@/redux/hooks";
import IsLoggedIn from "@/utilities/IsLoggedIn";
import { mockdata } from "../LandingPage/Hero/Menu";
import { signOutThunk } from "@/app/authentication/state/authenticationSlice";
import { IconDatabaseCog } from "@tabler/icons-react";
import ProgressBar from "./ProgressBar";
interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  value: string;
  label: string;
}

const CountryComponent = forwardRef<HTMLDivElement, ItemProps>(({ value, label, ...others }: ItemProps, ref) => {
  return (
    <div ref={ref} {...others}>
      <Group noWrap>
        <ReactCountryFlag countryCode={value} svg />
        <div>
          <Text size="sm">{label}</Text>
        </div>
      </Group>
    </div>
  );
});

CountryComponent.displayName = "CountryComponent";
let interval: any = undefined;

const RenderProgress = () => {
  let [progress, setProgress] = useState<number>(0);
  const [adverIndex, setAdverIndex] = useState(0);

  let arr = ["Example 1", "Example 2", "Example 3", "Example 4"];

  useEffect(() => {
    if (progress == 100) {
      if (adverIndex >= arr.length - 1) {
        setAdverIndex(0);
      } else {
        setAdverIndex(adverIndex + 1);
      }
    }

    let interval = setTimeout(() => {
      setProgress(progress == 100 ? 0 : (progress += 1));
    }, 100);

    return () => {
      clearTimeout(interval);
    };
  }, [progress]);

  return (
    <Box
      style={{
        letterSpacing: "0.5px",
        height: "30px",
        background: "rgb(17 24 29 / 44%)",
        position: "relative",
        color: "#fff",
        fontWeight: 700,
      }}
    >
      <Box
        pl={"40px"}
        style={{
          position: "relative",
          height: "30px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {arr[adverIndex]}
      </Box>

      <ProgressBar progress={progress} value={"arr[adverIndex% arr.length]"} />
    </Box>
  );
};

function Header() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const { classes, theme, cx } = useStyles();
  const [geoData, setGeoData] = useState<GeographicalInformationType>();
  const authentication = useAuthentication();
  const dispatch = useApplicationDispatch();
  const clientState = useApplicationSelector(clientStateSelector);
  const isloggedIn = IsLoggedIn();

  const previousCountry = clientState.selectedCountry;

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [countriesData, setCountriesData] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);

  const links = mockdata?.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.title}>
      <Group noWrap align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon size={rem(22)} color={theme.fn.primaryColor()} />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" color="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  const [selectedCountry, setSelectedCountry] = useState<string | null>(previousCountry.countryCode);
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  async function readCountriesData() {
    const countries = await readCountriesWithFlags();
    setCountriesData(countries);
  }
  async function readCountriesOnLanding() {
    const countries = await readCountriesLandingWithFlags();
    setCountriesData(countries);
  }
  const getGeoData = async () => {
    const geographicalInformation = await getGeographicalInformation();
    setGeoData(geographicalInformation);
    setSelectedCountry(geographicalInformation.country_code);
  };

  useEffect(() => {
    if (isloggedIn) {
      readCountriesData();
    } else {
      readCountriesOnLanding();
    }
    // Get Geo Data When no country is in redux
    if (!previousCountry.name) {
      getGeoData();
    }
  }, []);

  const [progress, setProgress] = useState(0);
  const [adverIndex, setAdverIndex] = useState(0);

  useEffect(() => {
    const countryName = countriesData.find((country) => country.value === selectedCountry)?.label;
    if (countryName) {
      dispatch({
        type: "Client/UpdateCountry",
        payload: {
          name: countryName,
          countryCode: selectedCountry,
        },
      });
    }
  }, [selectedCountry]);

  return (
    <>
      <MantineHeader height={96}>
        {!isloggedIn && <RenderProgress />}
        <Group position="apart" px="md" sx={{ height: "calc(100% - 34px)" }}>
          <Logo colorScheme={colorScheme} />
          <Box className={classes.flex}>
            {!isloggedIn ? (
              <Group sx={{ height: "100%" }} spacing={0} className={classes.hiddenMobile}>
                {/* <Button onClick={()=> {router.push('/')}} className={classes.link}> */}
                <IconHome
                  size={25}
                  onClick={() => {
                    router.replace("/");
                  }}
                  strokeWidth={1.5}
                  color={"black"}
                />
                {/* </Button> */}
                <Link href="#Aboutus" target="_self" className={classes.link}>
                  About Us
                </Link>
                <Link href="#Courses" target="_self" className={classes.link}>
                  Courses
                </Link>

                {/* <HoverCard
                  width={600}
                  position="bottom"
                  radius="md"
                  shadow="md"
                  withinPortal
                >
                  <HoverCard.Target>
                    <a href="#" className={classes.link}>
                      <Center inline>
                        <Box component="span" mr={5}>
                          Courses
                        </Box>
                        <IconChevronDown
                          size={16}
                          color={theme.fn.primaryColor()}
                        />
                      </Center>
                    </a>
                  </HoverCard.Target>

                  <HoverCard.Dropdown sx={{ overflow: "hidden" }}>
                    <Group position="apart" px="md">
                      <Text fw={500}>Features</Text>
                      <Anchor href="#" fz="xs">
                        View all
                      </Anchor>
                    </Group>

                    <Divider
                      my="sm"
                      mx="-md"
                      color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
                    />

                    <SimpleGrid cols={2} spacing={0}>
                      {links}
                    </SimpleGrid>
                  </HoverCard.Dropdown>
                </HoverCard> */}
                <a href="#" className={classes.link}>
                  Gallery
                </a>
                <a href="#" className={classes.link}>
                  Result
                </a>

                <Group>
                  {/* <LoadingOverlay
                    visible={geoData === undefined}
                    className={classes.hiddenTablet}
                    overlayBlur={2}
                  /> */}
                  <Select
                    itemComponent={CountryComponent}
                    style={{ width: "140px" }}
                    icon={<ReactCountryFlag countryCode={selectedCountry || ""} svg />}
                    value={selectedCountry}
                    onChange={(e) => {
                      setSelectedCountry(e);
                    }}
                    data={countriesData}
                    className={classes.hiddenTablet}
                  />
                  <Link href={"/authentication/signin"}>
                    <Button variant="default">Log in</Button>
                  </Link>
                  <Link href={"/authentication/signup"}>
                    <Button>Buy Online</Button>
                  </Link>
                  <ActionIcon variant="default" onClick={() => toggleColorScheme()} size={36}>
                    {colorScheme === "dark" ? <IconSun size="1rem" /> : <IconMoonStars size="1rem" />}
                  </ActionIcon>
                </Group>
              </Group>
            ) : (
              <Group>
                {/* <LoadingOverlay
                  visible={geoData === undefined}
                  className={classes.hiddenTablet}
                  overlayBlur={2}
                /> */}
                <Select
                  itemComponent={CountryComponent}
                  style={{ width: "140px" }}
                  icon={<ReactCountryFlag countryCode={selectedCountry || ""} svg />}
                  value={selectedCountry}
                  // onChange={setSelectedCountry}
                  data={countriesData}
                  className={classes.hiddenTablet}
                  onChange={(e) => {
                    setSelectedCountry(e);
                  }}
                />
                <ActionIcon variant="default" onClick={() => toggleColorScheme()} size={36}>
                  {colorScheme === "dark" ? <IconSun size="1rem" /> : <IconMoonStars size="1rem" />}
                </ActionIcon>
                <Menu
                  width={260}
                  position="bottom-end"
                  transitionProps={{ transition: "pop-top-right" }}
                  onClose={() => setUserMenuOpened(false)}
                  onOpen={() => setUserMenuOpened(true)}
                  withinPortal
                  closeOnItemClick={false}
                >
                  <Menu.Target>
                    <UnstyledButton
                      className={cx(classes.user, {
                        [classes.userActive]: userMenuOpened,
                      })}
                    >
                      <Group spacing={7}>
                        <Avatar alt={authentication?.user?.name} radius="xl" size={28} />
                        <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                          {authentication?.user?.name}
                        </Text>
                        <IconChevronDown size={rem(12)} stroke={1.5} />
                      </Group>
                    </UnstyledButton>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Link prefetch={false} href={"/profile"}>
                      <Menu.Item icon={<IconUser size="1rem" />}>Profile</Menu.Item>
                    </Link>
                    {pathname === "/" ? (
                      <Menu.Item icon={<IconDatabaseCog size="0.9rem" stroke={1.5} />}>
                        <Link
                          href={authentication.metadata.role === "super_admin" ? "/console" : "/authentication/signup"}
                        >
                          {authentication.metadata.role == "super_admin" ? "Admin Dashboard" : "Learning Portal"}
                        </Link>
                      </Menu.Item>
                    ) : (
                      <Menu.Item icon={<IconHome size="0.9rem" stroke={1.5} />}>
                        <Link href={"/"}>Home</Link>
                      </Menu.Item>
                    )}
                    {isloggedIn && (
                      <Menu.Item
                        onClick={() => {
                          const windowConfirm = window.confirm("Are you sure you want to sign out");
                          if (windowConfirm) {
                            router.replace("/");
                            localStorage.clear();
                            dispatch(signOutThunk()).unwrap();
                          }
                        }}
                        icon={<IconLogout size="0.9rem" stroke={1.5} />}
                      >
                        Sign-Out
                      </Menu.Item>
                    )}
                    <Menu.Divider />
                  </Menu.Dropdown>
                </Menu>
              </Group>
            )}
          </Box>
          <Burger opened={drawerOpened} onClick={toggleDrawer} className={classes.hiddenDesktop} />
        </Group>
      </MantineHeader>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(60)})`} mx="-md">
          <Divider my="sm" color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"} />

          <a href="#" className={classes.link}>
            Home
          </a>
          <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>
                Features
              </Box>
              <IconChevronDown size={16} color={theme.fn.primaryColor()} />
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{links}</Collapse>
          <a href="#" className={classes.link}>
            Learn
          </a>
          <a href="#" className={classes.link}>
            Academy
          </a>

          <Divider my="sm" color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"} />

          <Group position="center" grow pb="xl" px="md">
            <Button
              onClick={() => {
                // navigate("/authentication/signup");
              }}
              variant={"light"}
            >
              Sign Up
            </Button>
            <Button
              onClick={() => {
                // navigate("/authentication/signin");
              }}
              variant={"filled"}
            >
              Log In
            </Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </>

    // <MantineHeader height={{ base: 40, md: 50 }} p="sm">
    //   <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
    //   {/* <MediaQuery largerThan="sm" styles={{ display: 'none' }}> */}
    //   {/* {
    //       authentication.metadata.status === "authenticated" && pathname !== "/"
    //       && <ActionIcon size={"xl"} radius="xs" onClick={() => {
    //         dispatch({
    //           type: "Client/ControlApplicationShellComponents", payload: {
    //             ...clientState,
    //             showNavigationBar: !clientState.showNavigationBar,
    //           }
    //         });
    //       }}
    //       >
    //         {
    //           clientState.showNavigationBar
    //             ? <IconLayoutSidebarLeftCollapse size={rem(30)} />
    //             : <IconLayoutSidebarLeftExpand size={rem(30)} />
    //         }
    //       </ActionIcon>
    //     } */}

    //   <Box
    //       sx={(theme) => ({
    //         width: '100%',
    //       })}
    //     >
    //       <Group position="apart" px={0}>
    //         <Logo colorScheme={colorScheme} />
    //   <Group position="apart">
    //   <Box>
    //           <LoadingOverlay visible={geoData === undefined} overlayBlur={2} />
    //             <Select
    //               itemComponent={CountryComponent}
    //               icon={<ReactCountryFlag countryCode={selectedCountry || ""} svg />}
    //               value={selectedCountry}
    //               onChange={setSelectedCountry}
    //               data={countriesData}
    //             />
    //           </Box>
    //   {
    //             authentication.metadata.status === "authenticated"
    //               ? (
    //                 <>
    //   {/* {
    //                     pathname === "/" &&
    //                     (<Link href={"/console"}>
    //                       <Button variant={"filled"}>
    //                         {authentication.metadata.role === "admin" ? "Admin Dashboard" : "Learning Portal"}
    //                       </Button>
    //                     </Link>)
    //                   } */}
    //   </>
    //               )
    //               : (
    //                 <>
    //                   <Link href={"/authentication/signup"}>
    //                     <Button variant={"light"}>Sign-Up</Button>
    //                   </Link>
    //                   <Link href={"/authentication/signin"}>
    //                     <Button variant={"filled"}>Sign-In</Button>
    //                   </Link>
    //                 </>
    //               )
    //           }
    //   {
    //             authentication.metadata.status === "authenticated" &&
    //             <Menu
    //               width={260}
    //               position="bottom-end"
    //               transitionProps={{ transition: 'pop-top-right' }}
    //               onClose={() => setUserMenuOpened(false)}
    //               onOpen={() => setUserMenuOpened(true)}
    //               withinPortal
    //               closeOnItemClick={false}
    //             >
    //               <Menu.Target>
    //                 <UnstyledButton
    //                   className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
    //                 >
    //                   <Group spacing={7}>
    //                     <Avatar alt={authentication.user?.name} radius="xl" size={28} />
    //                     <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
    //                       {authentication.user?.name}
    //                     </Text>
    //                     <IconChevronDown size={rem(12)} stroke={1.5} />
    //                   </Group>
    //                 </UnstyledButton>
    //               </Menu.Target>
    //               <Menu.Dropdown>
    //                 {
    //                   pathname === "/" ?
    //                     <Menu.Item
    //                       icon={<IconDatabaseCog size="0.9rem" stroke={1.5} />}
    //                     >
    //                       <Link href={authentication.metadata.role === "super_admin" ? "/console" : "/authentication/signup"}>
    //                         {authentication.metadata.role === "super_admin" ? "Admin Dashboard" : "Learning Portal"}
    //                       </Link>
    //                     </Menu.Item>
    //                     : <Menu.Item
    //                       icon={<IconHome size="0.9rem" stroke={1.5} />}
    //                     >
    //                       <Link href={"/"}>
    //                         Home
    //                       </Link>
    //                     </Menu.Item>
    //                 }
    //                 {
    //                   authentication.metadata.status === "authenticated"
    //                   && <Menu.Item onClick={async () => {
    //                     await dispatch(signOutThunk()).unwrap();
    //                     router.push("/");
    //                   }} icon={<IconLogout size="0.9rem" stroke={1.5} />}>
    //                     Sign-Out
    //                   </Menu.Item>
    //                 }
    //                 <Menu.Divider />
    //                 <Menu.Item onClick={() => toggleColorScheme()} icon={colorScheme === 'dark' ? <IconSun size="0.9rem" stroke={1.5} /> : <IconMoonStars size="0.9rem" stroke={1.5} />}>
    //                   Change Theme
    //                 </Menu.Item>
    //               </Menu.Dropdown>
    //             </Menu>
    //           }
    //   {authentication.metadata.status === "unauthenticated" && (
    //     <ActionIcon
    //       variant="default"
    //       onClick={() => toggleColorScheme()}
    //       size={36}
    //     >
    //       {colorScheme === "dark" ? (
    //         <IconSun size="1rem" />
    //       ) : (
    //         <IconMoonStars size="1rem" />
    //       )}
    //     </ActionIcon>
    //   )}
    //   {
    //             authentication.metadata.status === "authenticated" && pathname !== "/"
    //             && <ActionIcon size={"xl"} radius="xs" onClick={() => {
    //               dispatch({
    //                 type: "Client/ControlApplicationShellComponents", payload: {
    //                   ...clientState,
    //                   showAsideBar: !clientState.showAsideBar,
    //                 }
    //               });
    //             }}
    //             >
    //               {
    //                 clientState.showAsideBar
    //                   ? <IconLayoutSidebarRightCollapse size={rem(30)} />
    //                   : <IconLayoutSidebarRightExpand size={rem(30)} />
    //               }
    //             </ActionIcon>
    //           }
    //   </Group>
    //       </Group>
    //     </Box>
    //   </div>
    // </MantineHeader>
  );
}

export default Header;
