import { createStyles, rem } from "@mantine/core";

const useStyles = createStyles((theme) => ({
    footer: {
      // marginTop: rem(120),
      height:"100%",
      paddingTop: `calc(${theme.spacing.xl} * 2)`,
      // paddingBottom: `calc(${theme.spacing.xl} * 2)`,
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : '#fff',
      borderTop: `${rem(1)} solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
      }`,
    },
  
    logo: {
      maxWidth: rem(200),
      color:theme.colorScheme === 'dark' ? theme.colors.gray[3] : theme.colors.gray[8],
      [theme.fn.smallerThan('sm')]: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
    },
  
    description: {
      marginTop: rem(5),
  
      [theme.fn.smallerThan('sm')]: {
        marginTop: theme.spacing.xs,
        textAlign: 'center',
      },
    },
  
    inner: {
      display: 'flex',
      justifyContent: 'space-between',
      maxWidth:"80%",
      maxHeight:'74.5%',
      height:"74%",
  
      [theme.fn.smallerThan('sm')]: {
        flexDirection: 'column',
        alignItems: 'center',
      },
    },
  
    groups: {
      display: 'flex',
      flexWrap: 'wrap',
  
      [theme.fn.smallerThan('sm')]: {
        display: 'none',
      },
    },
  
    wrapper: {
      width: rem(193),
      color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[8],
    },
  
    link: {
      display: 'block',
      fontSize: theme.fontSizes.sm,
      paddingTop: rem(3),
      paddingBottom: rem(3),
      backgroundColor: 'transparent',
      padding: 0,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[8],
  
      '&:hover': {
        backgroundColor: 'transparent',
        textDecoration: 'underline',
      },
    },
  
    title: {
      fontSize: theme.fontSizes.lg,
      fontWeight: 700,
      fontFamily: `Greycliff CF, ${theme.fontFamily}`,
      marginBottom: `calc(${theme.spacing.xs} / 2)`,
      
    },
  
    afterFooter: {
      display: 'flex',
      position:"relative",
      bottom:0,
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: theme.spacing.xl,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.md,
      maxWidth:"100%",
      maxHeight:"100px",
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      color:"#000", 
      borderTop: `${rem(1)} solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
      }`,
  
      [theme.fn.smallerThan('sm')]: {
        flexDirection: 'column',
      },
    },
  
    social: {
      [theme.fn.smallerThan('sm')]: {
        marginTop: theme.spacing.xs,
      },
    },
  }));

  export {useStyles}