import React from "react";
import { useStyles } from "./style";
import { Box, Button, Image, Paper, Text, Title } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { setGetData } from "@/helpers/getLocalStorage";

type AnnoucementType = {
  country: string;
  created_at: string;
  enddate: string;
  name: string;
  status: boolean;
  whatsnew: string;
  _id: string;
  image: string;
};

function SingleCard({ image, name, whatsnew, enddate }: AnnoucementType) {
  let isDarkThem = setGetData("colorScheme");
  isDarkThem = isDarkThem == "dark";
  const backgroundClr = isDarkThem ? "#1A1B1E" : "rgb(243 241 254)";
  const color = isDarkThem ? "#fff" : "";

  const { classes } = useStyles(isDarkThem);
  const { hovered, ref } = useHover();

  return (
    <Paper
      // shadow={hovered ? "xl" : "md"}
      p="xl"
      radius="md"
      mt={80}
      ref={ref}
      sx={
        hovered
          ? {
              backgroundColor: backgroundClr,
              color: color,
              boxShadow:
                "rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px",
            }
          : { backgroundColor: "transparent" }
      }
      className={classes.card}
    >
      <Image
        classNames={{
          imageWrapper: classes.imageWrapper,
          root: classes.imageroot,
          image: classes.image,
          figure: classes.imageFigure,
        }}
        src={image}
        alt=""
      />
      <Box mt={34} ta={"center"} h={"100%"} className={""}>
        <Title order={3} className={classes.title} color={isDarkThem ? "white" : "#5a5858"}>
          {name}
        </Title>
        <Text color={isDarkThem ? "white" : "#5a5858"} fz={"14px"} dangerouslySetInnerHTML={{ __html: whatsnew }} />
      </Box>
    </Paper>
  );
}

export default SingleCard;
