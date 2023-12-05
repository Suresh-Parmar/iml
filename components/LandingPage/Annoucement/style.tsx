import { createStyles, rem } from "@mantine/core";

const useStyles = createStyles((theme) => {
  let isDarkThem = theme?.colorScheme == "dark";
  return {
    card: {
      height: "20rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "flex-start",
      backgroundSize: "cover",
      backgroundPosition: "center",
    },

    title: {
      fontFamily: `Greycliff CF, ${theme.fontFamily}`,
      fontWeight: 900,
      color: isDarkThem ? "white" : "black",
      lineHeight: 1.2,
      fontSize: "17px",
      paddingBottom: "15px",
      marginTop: theme.spacing.xs,
    },

    category: {
      color: theme.white,
      opacity: 0.7,
      fontWeight: 700,
      textTransform: "uppercase",
    },
    imageroot: {
      width: "calc(100% - 64px) !important",
      position: "absolute",
      top: "15px",
      display: "flex",
      justifyContent: "center",
      maxWidth: "100% !important",
    },
    imageFigure: {
      padding: 6,
      backgroundColor: "rgb(243 241 254)",
      borderRadius: "50%",
    },
    imageWrapper: {
      height: "100px",
      width: "100%",
      borderRadius: "50%",
      display: "flex",
      justifyContent: "center",
      boxShadow:
        "rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px",
    },
    image: {
      borderRadius: "50%",
      border: "1px solid #dedede",
    },
    carouselCont: {
      height: "28rem",
    },
    indicator: {
      display: "none",
    },
    controlers: {
      left: "-50px",
      right: "-50px",
    },
    textCont: {
      height: "15rem",
      textOverflow: "ellipsis",
      whiteSpace: "normal",
      overflowX: "hidden",
      width: "350px",
      overflowY: "scroll",

      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
  };
});

export { useStyles };
