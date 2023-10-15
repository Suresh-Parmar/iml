import { Logo } from "@/components/Header/_logo";
import { createStyles, Text, Container, ActionIcon, Group, rem, useMantineColorScheme, Button } from "@mantine/core";
import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram } from "@tabler/icons-react";
import { useStyles } from "./styles";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { setGetData } from "@/helpers/getLocalStorage";

interface FooterLinksProps {
  data: {
    title: string;
    links: { label: string; link: string }[];
  }[];
}

export function Footer({ data }: FooterLinksProps) {
  let reduxData: any = useSelector((state: any) => state);
  let colorScheme = reduxData?.data?.colorScheme;

  let isDarkThem = setGetData("colorScheme");
  const { classes } = useStyles(isDarkThem);

  const router = useRouter();

  const handleNavigate = (nav: string) => {
    router.replace(nav);
  };

  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <Button
        key={index}
        className={classes.link}
        // component="a"
        // href={link.link}
        onClick={(event) => handleNavigate(link.link)}
      >
        {link.label}
      </Button>
    ));

    return (
      <div className={classes.wrapper} key={group.title}>
        <Text className={classes.title}>{group.title}</Text>
        {links}
      </div>
    );
  });

  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <div className={classes.logo}>
          <Logo colorScheme={colorScheme} />
          <Text size="xs" className={classes.description}>
            Math develops your ability to see the world in a different way. Teaches you how to think outside the box.
          </Text>
        </div>
        <div className={classes.groups}>{groups}</div>
      </Container>
      <Container className={classes.afterFooter}>
        <Text size="sm">© 2020 ignitedmathlab.com. All rights reserved.</Text>

        <Group spacing={0} className={classes.social} position="right" noWrap>
          <ActionIcon size="lg">
            <IconBrandTwitter size="1.05rem" stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg">
            <IconBrandYoutube size="1.05rem" stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg">
            <IconBrandInstagram size="1.05rem" stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  );
}
