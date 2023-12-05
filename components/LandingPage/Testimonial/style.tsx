import { createStyles, rem } from "@mantine/core";

const useStyles = createStyles((theme: any) => {
  let isDark = theme?.colorScheme == "dark";
  return {
    card: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "flex-start",
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "219px",
      // width: "390px",
      backgroundColor: isDark ? "#1a1b1e" : "#fff",
    },

    title: {
      fontFamily: `Greycliff CF, ${theme.fontFamily}`,
      fontWeight: 400,
      color: "black",
      lineHeight: 1.2,
      fontSize: rem(12),
      marginTop: "1rem",
      marginBottom: "1.8rem",
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
      bottom: "15px",
      display: "flex",
      justifyContent: "center",
      maxWidth: "100% !important",
    },
    imageFigure: {
      padding: 0,
      backgroundColor: "transparent",
      borderRadius: "50%",
    },
    imageWrapper: {
      height: "85px",
      width: "100%",
      borderRadius: "50%",
      display: "flex",
      justifyContent: "center",
    },
    image: {
      borderRadius: "50%",
      border: "1px solid #dedede",
      height: "85px !important",
      width: "85px !important",
    },
    carouselCont: {
      height: "22rem",
    },
    viewport: {
      height: "22rem",
    },
    indicator: {
      display: "none",
    },
    controlers: {
      left: "-50px",
      right: "-50px",
    },
    caption: {
      padding: "0px",
      textAlign: "center",
      color: isDark ? "white" : "",
    },
    placeholder: {
      backgroundColor: "transparent",
    },
    placeholderImage: {
      width: "85px",
      height: "100%",
      borderRadius: "50%",
      display: "flex",
      border: "1px solid #c0c0c0",
      justifyContent: "center",
      alignItems: "self-end",
      background: "#ecebeb",
    },
  };
});

export { useStyles };
