import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NavLink, Navbar, ScrollArea, ThemeIcon, createStyles, rem } from "@mantine/core";
import {
  IconMap,
  IconVocabulary,
  IconSchool,
  IconTrophy,
  IconChalkboard,
  IconUser,
  IconBuilding,
  IconAffiliate,
  IconDownload,
} from "@tabler/icons-react";
import { findFromJson } from "@/helpers/filterFromJson";
import { setGetData } from "@/helpers/getLocalStorage";
import { useRoleCrudOpsgetQuery } from "@/redux/apiSlice";
import { iterateData } from "@/helpers/getData";

function NavigationBarMain({ opened }: { opened: boolean }) {
  const consoleBaseURL = "/console";
  const router = useRouter();
  const pathname = usePathname();
  const [siteJson, setSiteJson] = useState<any>([]);

  let userData: any = setGetData("userData", false, true);
  let activeUserID = userData?.user?._id;
  let defaultShow = userData?.metadata?.role == "super_admin";

  let excludePaths = ["profile"];

  let rolesData = useRoleCrudOpsgetQuery(activeUserID);
  rolesData = iterateData(rolesData);

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
  }, [rolesData]);

  useEffect(() => {
    handleisValid(pathname);
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
      router.replace(consoleBaseURL);
    }
  };

  const getDataFromJson = (key: string = "") => {
    if (defaultShow) {
      return true;
    }

    if (key.includes("/")) {
      let arrKey = key.split("/");
      key = key.split("/")[arrKey.length - 1];
    }
    let data = findFromJson(siteJson, key, "link");
    return !!data.permissions && !!data.permissions.view;
  };

  const navigationBarLinks = [
    {
      href: "",
      linkHref: "locations",
      icon: <IconUser size="2rem" />,
      color: "gray",
      label: "Locations",
      description: "All locations of the system",
      navlinks: [
        {
          href: `${consoleBaseURL}/countries`,
          icon: <IconMap size="2rem" />,
          color: "blue",
          label: "Countries",
          description: "Countries, states and cities",
        },
        {
          href: `${consoleBaseURL}/states`,
          icon: <IconMap size="2rem" />,
          color: "blue",
          label: "States",
          description: "Countries, states and cities",
        },
        {
          href: `${consoleBaseURL}/cities`,
          icon: <IconMap size="2rem" />,
          color: "blue",
          label: "Cities",
          description: "Countries, states and cities",
        },
      ],
    },
    {
      href: "",
      linkHref: "settings",
      icon: <IconUser size="2rem" />,
      color: "gray",
      label: "Settings",
      description: "All settings of the system",
      navlinks: [
        {
          href: `${consoleBaseURL}/smtp`,
          icon: <IconMap size="2rem" />,
          color: "blue",
          label: "SMTP Config",
          description: "SMTP Config",
        },
        {
          href: `${consoleBaseURL}/smsConfig`,
          icon: <IconMap size="2rem" />,
          color: "blue",
          label: "SMS Config",
          description: "SMS Config",
        },
        {
          href: `${consoleBaseURL}/templates`,
          icon: <IconMap size="2rem" />,
          color: "blue",
          label: "Templates",
          description: "Templates",
        },
        {
          href: `${consoleBaseURL}/orderConfig`,
          icon: <IconMap size="2rem" />,
          color: "blue",
          label: "Order Config",
          description: "Order Config",
        },
        {
          href: `${consoleBaseURL}/siteConfig`,
          icon: <IconMap size="2rem" />,
          color: "blue",
          label: "Site Configs",
          description: "Site Configs",
        },
        {
          href: `${consoleBaseURL}/bulkEmail`,
          icon: <IconMap size="2rem" />,
          color: "blue",
          label: "Bulk Email",
          description: "Bulk Email",
        },
      ],
    },
    {
      href: "",
      linkHref: "others",
      icon: <IconUser size="2rem" />,
      color: "gray",
      label: "Others",
      description: "All others data of the system",
      navlinks: [
        {
          href: `${consoleBaseURL}/products`,
          icon: <IconMap size="2rem" />,
          color: "blue",
          label: "Products",
          description: "Products",
        },
        {
          href: `${consoleBaseURL}/productTypes`,
          icon: <IconMap size="2rem" />,
          color: "blue",
          label: "Product Category",
          description: "Product Category",
        },
        {
          href: `${consoleBaseURL}/payments`,
          icon: <IconMap size="2rem" />,
          color: "blue",
          label: "Payments",
          description: "Payments of the system",
        },
        {
          href: `${consoleBaseURL}/dispatch`,
          icon: <IconMap size="2rem" />,
          color: "blue",
          label: "Dispatch",
          description: "dispatch of the system",
        },
        {
          href: `${consoleBaseURL}/boards`,
          icon: <IconVocabulary size="2rem" />,
          color: "pink",
          label: "Boards",
          description: "Governing education boards",
        },
        {
          href: `${consoleBaseURL}/classes`,
          icon: <IconChalkboard size="2rem" />,
          color: "green",
          label: "Classes",
          description: "Grades and levels",
        },
        {
          href: `${consoleBaseURL}/markssheet`,
          icon: <IconChalkboard size="2rem" />,
          color: "green",
          label: "Marks Sheet",
          description: "Grades and levels",
        },
        {
          href: `${consoleBaseURL}/subjects`,
          icon: <IconTrophy size="2rem" />,
          color: "violet",
          label: "Subjects",
          description: "Subjects",
        },
        {
          href: `${consoleBaseURL}/groups`,
          icon: <IconChalkboard size="2rem" />,
          color: "green",
          label: "Groups",
          description: "Grades and levels",
        },
        {
          href: `${consoleBaseURL}/cohorts`,
          icon: <IconTrophy size="2rem" />,
          color: "violet",
          label: "Cohorts",
          description: "Cohorts",
        },
      ],
    },

    {
      href: `${consoleBaseURL}/schools`,
      icon: <IconSchool size="2rem" />,
      color: "yellow",
      label: "Schools",
      description: "Institutes for learning",
    },
    {
      href: `${consoleBaseURL}/students`,
      icon: <IconAffiliate size="2rem" />,
      color: "violet",
      label: "Students",
      description: "All users of the system",
    },

    {
      href: `${consoleBaseURL}/competitions`,
      icon: <IconTrophy size="2rem" />,
      color: "violet",
      label: "Competitions",
      description: "Educational quizes and games",
    },
    // {
    //   href: `${consoleBaseURL}/annoucements`,
    //   icon: <IconTrophy size="2rem" />,
    //   color: 'violet',
    //   label: 'Annoucements',
    //   description: 'Annoucements',
    // },
    {
      href: `${consoleBaseURL}/examcenters`,
      icon: <IconBuilding size="2rem" />,
      color: "cyan",
      label: "Exam Centers",
      description: "Institutes for conducting exams",
    },
    {
      href: `${consoleBaseURL}/examcentermappings`,
      icon: <IconAffiliate size="2rem" />,
      color: "teal",
      label: "Center Mappings",
      description: "Mapping seats to centers",
    },

    {
      href: "",
      linkHref: "users",
      icon: <IconUser size="2rem" />,
      color: "gray",
      label: "Users",
      description: "All users of the system",
      navlinks: [
        {
          href: `${consoleBaseURL}/teachers`,
          icon: <IconUser size="2rem" />,
          color: "gray",
          label: "Teachers",
          description: "All users of the system",
        },
        {
          href: `${consoleBaseURL}/relationshipmanagers`,
          icon: <IconUser size="2rem" />,
          color: "gray",
          label: "Relationship Managers",
          description: "All users of the system",
        },
        {
          href: `${consoleBaseURL}/superadmins`,
          icon: <IconUser size="2rem" />,
          color: "gray",
          label: "Super Admins",
          description: "All users of the system",
        },
        {
          href: `${consoleBaseURL}/admins`,
          icon: <IconUser size="2rem" />,
          color: "gray",
          label: "Admins",
          description: "All users of the system",
        },
      ],
    },
    {
      linkHref: "cms",
      href: "",
      icon: <IconAffiliate size="2rem" />,
      color: "gray",
      label: "CMS",
      description: "All users of the system",
      navlinks: [
        {
          href: `${consoleBaseURL}/testimonials`,
          icon: <IconUser size="2rem" />,
          color: "gray",
          label: "Testimonials",
          description: "All users of the system",
        },
        {
          href: `${consoleBaseURL}/announcements`,
          icon: <IconUser size="2rem" />,
          color: "gray",
          label: "Announcements",
          description: "All users of the system",
        },
      ],
    },
    {
      linkHref: "download",
      href: "",
      icon: <IconDownload size="2rem" />,
      color: "gray",
      label: "Download",
      description: "All users of the system",
      navlinks: [
        {
          href: `${consoleBaseURL}/admitcard`,
          icon: <IconUser size="2rem" />,
          color: "gray",
          label: "Admit Card",
          description: "All users of the system",
        },
        {
          href: `${consoleBaseURL}/markssheetdownload`,
          icon: <IconUser size="2rem" />,
          color: "gray",
          label: "Marks Sheet",
          description: "All users of the system",
        },
        {
          href: `${consoleBaseURL}/certificate`,
          icon: <IconUser size="2rem" />,
          color: "gray",
          label: "Certificate",
          description: "All users of the system",
        },
        {
          href: `${consoleBaseURL}/omrsheet`,
          icon: <IconUser size="2rem" />,
          color: "gray",
          label: "OMR Sheet",
          description: "All users of the system",
        },
      ],
    },
  ];
  const [showLabel, setShowLabel] = useState<boolean>(false);

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
        onMouseEnter={() => setShowLabel(true)}
        onMouseLeave={() => setShowLabel(false)}
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
      {navigationBarLinks.map((navigationBarLink) => {
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
                  router.replace(navigationBarLink.href);
                }
              }
            }}
            childrenOffset={28}
          >
            {navigationBarLink.navlinks?.map((navLink) => {
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
