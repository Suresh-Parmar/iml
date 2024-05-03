import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NavLink, Navbar, ScrollArea, ThemeIcon, createStyles, rem } from "@mantine/core";
import { findFromJson } from "@/helpers/filterFromJson";
import { setGetData } from "@/helpers/getLocalStorage";
import { useRoleCrudOpsgetQuery } from "@/redux/apiSlice";
import { iterateData } from "@/helpers/getData";
import { useDispatch } from "react-redux";
import { selectedTabUpdate } from "@/redux/slice";
import NavigationLinks from "./JsonLInks";
import navigationData from "./rmManager";

const rmNavData = navigationData;

function NavigationBarMain({ opened }: { opened: boolean }) {
  let consoleBaseURL = "/console";

  const router = useRouter();
  const pathname = usePathname();
  const [siteJson, setSiteJson] = useState<any>([]);

  let userData: any = setGetData("userData", false, true);
  let activeUserID = userData?.user?._id;
  let userRole = userData?.metadata?.role;
  let defaultShow = userRole == "super_admin";
  let isRmUser = userRole == "rm";

  if (isRmUser) {
    consoleBaseURL = "/relationshipmanager";
  }

  let excludePaths = ["profile"];

  const dispatch = useDispatch();

  let rolesData: any = "";
  rolesData = useRoleCrudOpsgetQuery({ id: activeUserID, exit: isRmUser });
  if (isRmUser) {
    rolesData = rmNavData;
  } else {
    rolesData = iterateData(rolesData);
  }

  const changeTab = (tab: string) => {
    dispatch(selectedTabUpdate(tab));
  };

  // const fetchData = () => {
  //   updateDataRes("rolemappings", "", "name", activeUserID, "find_many")
  //     .then((res) => {
  //       let data = res?.data?.response[0];
  //       if (data && data?.data) {
  //         setGetData("rolemappings", data.data, true);
  //         setSiteJson([...data.data]);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  useEffect(() => {
    if (rolesData[0]?.data && Array.isArray(rolesData[0].data)) {
      setSiteJson(rolesData[0]?.data);
    }
  }, [rolesData, isRmUser]);

  useEffect(() => {
    if (!isRmUser) {
      handleisValid(pathname);
    }
  }, [pathname, siteJson]);

  const handleisValid = (pathname: string) => {
    if (defaultShow) {
      return true;
    }
    if (pathname.includes("/")) {
      let arrKey = pathname.split("/");
      pathname = pathname.split("/")[arrKey.length - 1];
    }

    let data = findFromJson(siteJson, pathname, "link");

    if (!data?.permissions?.view && !excludePaths.includes(pathname)) {
      setTimeout(() => {
        router.replace(consoleBaseURL);
      }, 100);
    }
  };

  const getDataFromJson = (key: string = "") => {
    if (defaultShow || isRmUser) {
      return true;
    }

    if (key.includes("/")) {
      let arrKey = key.split("/");
      key = key.split("/")[arrKey.length - 1];
    }
    let data = findFromJson(siteJson, key, "link");
    return !!data.permissions && !!data.permissions.view;
  };

  let navigationBarLinks: any = [];

  if (isRmUser) {
    navigationBarLinks = rolesData;
  } else {
    navigationBarLinks = NavigationLinks({ consoleBaseURL });
  }

  const useStyles = createStyles((theme, colorScheme: any) => ({
    navbar: {
      backgroundColor: colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
      paddingBottom: 0,
    },

    header: {
      padding: theme.spacing.md,
      paddingTop: 0,
      marginLeft: `calc(${theme.spacing.md} * -1)`,
      marginRight: `calc(${theme.spacing.md} * -1)`,
      color: colorScheme === "dark" ? theme.white : theme.black,
      borderBottom: `${rem(1)} solid ${colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`,
    },

    links: {
      marginLeft: `calc(${theme.spacing.md} * -1)`,
      marginRight: `calc(${theme.spacing.md} * -1)`,
    },

    linksInner: {
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.xl,
    },

    footer: {
      marginLeft: `calc(${theme.spacing.md} * -1)`,
      marginRight: `calc(${theme.spacing.md} * -1)`,
      borderTop: `${rem(1)} solid ${colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`,
    },
  }));

  let colorScheme = setGetData("colorScheme");
  const { classes } = useStyles(colorScheme);

  const NavLinkIcon = (navigationBarLink: any) => {
    return (
      <ThemeIcon
        mx={0}
        sx={(theme) => ({ padding: theme.spacing.xs })}
        size={36}
        color={navigationBarLink.color}
        variant="light"
      >
        {navigationBarLink.icon}
      </ThemeIcon>
    );
  };

  return (
    <Navbar.Section grow className={classes.links} component={ScrollArea}>
      {navigationBarLinks.map((navigationBarLink: any) => {
        let showMenu = getDataFromJson(navigationBarLink.href || navigationBarLink.linkHref);
        if (!showMenu) {
          return;
        }
        return (
          <NavLink
            key={navigationBarLink.label}
            active={pathname === navigationBarLink.href}
            label={opened ? "" : navigationBarLink.label}
            icon={NavLinkIcon(navigationBarLink)}
            onClick={() => {
              if (navigationBarLink.navlinks?.length) {
                return;
              } else {
                if (pathname != navigationBarLink.href) {
                  navigationBarLink.label && changeTab(navigationBarLink.label);
                  router.replace(navigationBarLink.href);
                }
              }
            }}
            childrenOffset={28}
          >
            {navigationBarLink.navlinks?.map((navLink: any) => {
              let showMenu = getDataFromJson(navLink.href);
              if (!showMenu) {
                return;
              }

              return (
                <NavLink
                  key={navLink.label}
                  active={window.location.pathname === navLink.href}
                  label={opened ? "" : navLink.label}
                  icon={NavLinkIcon(navLink)}
                  onClick={() => {
                    if (pathname != navLink.href) {
                      navLink.label && changeTab(navLink.label);
                      router.replace(navLink.href);
                    }
                  }}
                />
              );
            })}
          </NavLink>
        );
      })}
    </Navbar.Section>
  );
}

export default NavigationBarMain;
