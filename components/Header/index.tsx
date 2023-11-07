import {
  Header as MantineHeader,
  ThemeIcon,
  Center,
  Drawer,
  Collapse,
  Burger,
  Text,
  Box,
  Group,
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
import {
  IconChevronDown,
  IconHome,
  IconLogout,
  IconMoonStars,
  IconPassword,
  IconSun,
  IconUser,
} from "@tabler/icons-react";
import { Logo } from "./_logo";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import { forwardRef, useEffect, useMemo, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useDisclosure } from "@mantine/hooks";
import { useStyles } from "../LandingPage/Hero/styles";
import { mockdata } from "../LandingPage/Hero/Menu";
import { IconDatabaseCog } from "@tabler/icons-react";
import ProgressBar from "./ProgressBar";
import { useFinduserGeoLocationQuery, useGetAllLocationsQuery, useLandingPageAPisQuery } from "@/redux/apiSlice";
import { getUserData, iterateData } from "@/helpers/getData";
import { useDispatch, useSelector } from "react-redux";
import { changeColorTheme, setSelectedCountryRedux } from "@/redux/slice";
import { findFromJson } from "@/helpers/filterFromJson";
import { clearLocalData, setGetData } from "@/helpers/getLocalStorage";
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
        marginBottom: 10,
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
  const dispatch = useDispatch();
  // const isloggedIn = IsLoggedIn();
  let authentication: any = setGetData("userData", "", true);
  let isloggedIn: any = authentication?.metadata?.status == "authenticated";

  let locationData = useFinduserGeoLocationQuery("");
  locationData = iterateData(locationData);
  const localCountry = setGetData("selectedCountry", "", true);
  let isStudent = authentication?.user?.role == "student";

  let apiCountryData = {
    value: locationData.country,
    label: locationData?.country_name,
    currency: locationData?.currency,
    country_code: String(locationData.country_calling_code).replace("+", ""),
  };

  const allReduxData = useSelector((state: any) => state.data);

  useEffect(() => {
    if (!allReduxData?.selectedCountry?.value) {
      setGetData("selectedCountry", apiCountryData, true);
    }
  }, [apiCountryData, allReduxData?.selectedCountry?.value]);

  let colorScheme = allReduxData.colorScheme;
  const { classes, theme, cx } = useStyles();

  let toggleColorScheme = () => {
    dispatch(changeColorTheme(""));
  };

  const [countriesData, setCountriesData] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);

  let userCountry: any = getUserData("country");

  let payload = {
    collection_name: "countries",
    op_name: "find_many",
    filter_var: {
      status: true,
    },
  };

  let landingPageCountriesPayload = {
    collection_name: "countries",
    op_name: "find_many",
    filter_var: {
      status: true,
    },
  };

  // let countriesDataApi: any = useGetAllLocationsQuery(payload);
  // countriesDataApi = iterateData(countriesDataApi);

  let landingPageCountries = useLandingPageAPisQuery(landingPageCountriesPayload);
  landingPageCountries = iterateData(landingPageCountries);

  useEffect(() => {
    // let countryApiData = isloggedIn ? countriesDataApi : landingPageCountries;
    let countryApiData = landingPageCountries;
    if (Array.isArray(countryApiData)) {
      const countriesWithFlags = countryApiData.map((country) => {
        return {
          value: country["ISO Alpha-2 Code"],
          label: country.name,
          country_code: country["ISD Code"],
          currency: country["Currency Short Name"],
        };
      });
      setCountriesData(countriesWithFlags);
    }
  }, [landingPageCountries]);

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

  const [selectedCountry, setSelectedCountry] = useState<string | null>("");
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (localCountry) {
      setSelectedCountry(localCountry.value);
    } else if (!userCountry) {
      setSelectedCountry(locationData?.country_code);
    } else {
      let key = findFromJson(countriesData, userCountry, "label");
      setSelectedCountry(key?.value);
    }
  }, [locationData, userCountry, countriesData]);

  useEffect(() => {
    let country = findFromJson(countriesData, selectedCountry, "value");
    if (country?.value) {
      dispatch(setSelectedCountryRedux(country));
      setGetData("selectedCountry", country, true);
    }
  }, [selectedCountry]);

  const signoutUser = () => {
    let windowConfirm = window.confirm("Are you sure you want to sign out");

    if (windowConfirm) {
      clearLocalData();
      router.replace("/authentication/signin");
      // window.location.pathname = "/";
    }
  };

  const handleCountryChange = (e: any) => {
    let country = findFromJson(countriesData, e, "value");
    setSelectedCountry(e);
  };
  let height = isloggedIn ? 65 : 96;

  return (
    <>
      <MantineHeader height={height}>
        {!isloggedIn && <RenderProgress />}
        <Group position="apart" px="md" pb={10} pt={5} sx={{ height: "calc(100% - 34px)" }}>
          <Logo
            // colorScheme={colorScheme}
            colorScheme={"light"}
          />
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

                <a href="#" className={classes.link}>
                  Gallery
                </a>
                <a href="#" className={classes.link}>
                  Result
                </a>

                <Group>
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
                  <ActionIcon
                    variant="default"
                    onClick={() => {
                      toggleColorScheme();
                    }}
                    size={36}
                  >
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

                {!isStudent && (
                  <Select
                    itemComponent={CountryComponent}
                    style={{ width: "140px" }}
                    icon={<ReactCountryFlag countryCode={selectedCountry || ""} svg />}
                    value={selectedCountry}
                    // onChange={setSelectedCountry}
                    data={countriesData}
                    className={classes.hiddenTablet}
                    onChange={handleCountryChange}
                  />
                )}
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
                    <Link prefetch={false} href={"/changePassword"}>
                      <Menu.Item icon={<IconPassword size="1rem" />}>Change Password</Menu.Item>
                    </Link>
                    {pathname === "/" ? (
                      <Menu.Item
                        onClick={() => {
                          router.replace(authentication?.metadata?.role === "super_admin" ? "/console" : "/");
                        }}
                        icon={<IconDatabaseCog size="0.9rem" stroke={1.5} />}
                      >
                        <Link href={authentication?.metadata?.role === "super_admin" ? "/console" : "/"}>
                          {authentication?.metadata?.role == "super_admin" ? "Admin Dashboard" : "Learning Portal"}
                        </Link>
                      </Menu.Item>
                    ) : (
                      <Menu.Item
                        onClick={() => {
                          router.replace("/");
                        }}
                        icon={<IconHome size="0.9rem" stroke={1.5} />}
                      >
                        <Link href="/" prefetch={false}>
                          Home
                        </Link>
                      </Menu.Item>
                    )}
                    {isloggedIn && (
                      <Menu.Item onClick={signoutUser} icon={<IconLogout size="0.9rem" stroke={1.5} />}>
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
                router.replace("/authentication/signup");
              }}
              variant={"light"}
            >
              Sign Up
            </Button>
            <Button
              onClick={() => {
                router.replace("/authentication/signin");
              }}
              variant={"filled"}
            >
              Log In
            </Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </>
  );
}

export default Header;
