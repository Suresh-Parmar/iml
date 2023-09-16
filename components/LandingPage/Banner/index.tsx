import { Title, Text, Container, Button, Overlay, createStyles, rem, Box } from '@mantine/core';
import BgImage from '../assets/background.jpg';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    paddingTop: rem(240),
    paddingBottom: rem(240),
    textAlign:"justify",
    backgroundImage:
    `url(${BgImage.src})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',

    [theme.fn.smallerThan('xs')]: {
      paddingTop: rem(80),
      paddingBottom: rem(50),
    },
  },

  inner: {
    position: 'relative',
    zIndex: 1,
    width: "50%",
    margin:"auto",
    marginRight:0,
  },

  title: {
    fontWeight: 800,
    fontSize: rem(60),
    letterSpacing: rem(-1),
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    color: theme.black,
    marginBottom: theme.spacing.xs,
    textAlign: 'left',
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan('xs')]: {
      fontSize: rem(28),
      textAlign: 'left',
    },
  },

  highlight: {
    color: '#0c5390',
  },

  description: {
    color: theme.colors.gray[7],
    textAlign: 'left',
    margin:0,

    [theme.fn.smallerThan('xs')]: {
      fontSize: theme.fontSizes.md,
      textAlign: 'left',
    },
  },

  controls: {
    marginTop: `calc(${theme.spacing.xl} * 1.5)`,
    display: 'flex',
    justifyContent: 'center',
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column',
    },
  },

  control: {
    height: rem(42),
    fontSize: theme.fontSizes.md,

    '&:not(:first-of-type)': {
      marginLeft: theme.spacing.md,
    },

    [theme.fn.smallerThan('xs')]: {
      '&:not(:first-of-type)': {
        marginTop: theme.spacing.md,
        marginLeft: 0,
      },
    },
  },

  secondaryControl: {
    color: theme.white,
    backgroundColor: 'rgba(255, 255, 255, .4)',

    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, .45) !important',
    },
  },
}));

export function Banner() {
  const { classes, cx } = useStyles();

  return (
    <Box id={'/'} className={classes.wrapper}>
      {/* <Overlay color="#000" opacity={0.65} zIndex={1} /> */}

      <div className={classes.inner}>
        <Title className={classes.title}>
          Go from Curious to{' '}
          <Text component="span" inherit className={classes.highlight}>
            Confident
          </Text>
        </Title>

        <Container size={640} m={0}>
          <Text size="lg" className={classes.description}>
            Ignited Mind Lab gives you more than fast solving skills. We give you the confidence and 
            experience you need to reach your potential.
          </Text>
        </Container>

        {/* <div className={classes.controls}>
          <Button className={classes.control} variant="white" size="lg">
            Get started
          </Button>
        </div> */}
      </div>
    </Box>
  );
}