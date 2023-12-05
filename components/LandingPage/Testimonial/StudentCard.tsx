import { Blockquote, Box, Image, Paper, Text, Title } from "@mantine/core";
import React from "react";
import { useStyles } from "./style";
import Images from "next/image";
import { IconUser } from "@tabler/icons-react";
import { setGetData } from "@/helpers/getLocalStorage";
// import Avatar

type TestimonialResponse = {
  _id: string;
  name: string;
  school: string;
  description: string;
  startdate: string;
  enddate: string;
  thumbnail: string;
  country: string;
  status: string;
  created_at: string;
};

function StudentCard({ thumbnail, description, name, school }: TestimonialResponse) {
  let isDarkThem = setGetData("colorScheme");
  const backgroundClr = isDarkThem == "dark" ? "#25262b" : "#fff";
  const colorText = isDarkThem == "dark" ? "#fff" : "rgb(75, 75, 75)";

  const { classes } = useStyles(isDarkThem);
  return (
    <Paper shadow="lg" p="xl" radius="md" mt={52} sx={{ color: colorText }} className={classes.card}>
      <Image
        classNames={{
          imageWrapper: classes.imageWrapper,
          root: classes.imageroot,
          image: classes.image,
          figure: classes.imageFigure,
          caption: classes.caption,
          placeholder: classes.placeholder,
        }}
        src={thumbnail}
        alt=""
        caption={name}
        withPlaceholder
        placeholder={
          <Box className={classes.placeholderImage}>
            <IconUser
              style={{
                width: "100%",
                height: "68px",
                strokeWidth: 1,
                stroke: "#bababa",
              }}
            />
          </Box>
        }
      />
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        h={"100%"}
      >
        <Blockquote color='"#E01E22"' mt={"-5px"}>
          <Title
            order={3}
            className={classes.title}
            style={{ color: colorText }}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </Blockquote>
      </Box>
    </Paper>
  );
}

export default StudentCard;
