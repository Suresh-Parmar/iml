import { useState } from 'react';
import {
  Group,
  Box,
  Collapse,
  ThemeIcon,
  Text,
  UnstyledButton,
  createStyles,
  rem,
  Tooltip,
} from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import { setGetData } from '@/helpers/getLocalStorage';

const useStyles = createStyles((theme,colorScheme:any) => ({
  control: {
    fontWeight: 500,
    display: 'block',
    width: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    color: colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.sm,

    '&:hover': {
      backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
      color: colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  link: {
    fontWeight: 500,
    display: 'block',
    textDecoration: 'none',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    paddingLeft: rem(31),
    marginLeft: rem(30),
    fontSize: theme.fontSizes.sm,
    color: colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    borderLeft: `${rem(1)} solid ${colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
      }`,

    '&:hover': {
      backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
      color: colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  chevron: {
    transition: 'transform 200ms ease',
  },
}));

interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
}

export function LinksGroup({ icon: Icon, label, initiallyOpened, links }: LinksGroupProps) {
let colorScheme = setGetData("colorScheme");

  const { classes, theme } = useStyles(colorScheme);
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const ChevronIcon = theme.dir === 'ltr' ? IconChevronRight : IconChevronLeft;
  const items = (hasLinks ? links : []).map((link) => (
    <Tooltip position="right" transitionProps={{ duration: 0 }} withinPortal color={"white"} c={"dark"} label={link.label} key={link.label}>
      <Link
        href={link.link}
      >
        <Text
          // component="a"
          className={classes.link}
          // href={link.link}
          key={link.label}
          // onClick={(event) => event.preventDefault()}
        >
          {link.label}
        </Text>
      </Link>
    </Tooltip>
  ));

  return (
    <>
      <Tooltip position="right" transitionProps={{ duration: 0 }} withinPortal color={"white"} c={"dark"} label={label} key={label}>
        <UnstyledButton onClick={() => setOpened((o) => !o)} className={classes.control}>
          <Group position="apart" spacing={0}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ThemeIcon mx={0} sx={(theme) => ({ padding: theme.spacing.xs })} size={36} variant="light">
                <Icon size="2rem" />
              </ThemeIcon>
              <Box ml="md">{label}</Box>
            </Box>
            {hasLinks && (
              <ChevronIcon
                className={classes.chevron}
                size="1rem"
                stroke={1.5}
                style={{
                  transform: opened ? `rotate(${theme.dir === 'rtl' ? -90 : 90}deg)` : 'none',
                }}
              />
            )}
          </Group>
        </UnstyledButton>
      </Tooltip>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}
