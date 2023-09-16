import React, { useEffect, useState } from "react";
import SingleCard from "./SingleCard";
import { Carousel } from "@mantine/carousel";
import { Box, Center, Grid, Overlay, Title, createStyles } from "@mantine/core";
import { readCompetitionsLanding } from "@/utilities/API";

const data = [
  {
    _id:1,
    image:
      "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    name: "Best forests to visit in North America",
    subject_id: "Maths",
  },
  {
    _id:2,
    image:
      "https://images.unsplash.com/photo-1559494007-9f5847c49d94?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    name: "Hawaii beaches review: better than you think",
    subject_id: "Science",
  },
  {
    _id:3,
    image:
      "https://images.unsplash.com/photo-1608481337062-4093bf3ed404?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    name: "Mountains at night: 12 best locations to enjoy the view",
    subject_id: "English",
  },
  {
    _id:4,
    image:
      "https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    name: "Aurora in Norway: when to visit for best experience",
    subject_id: "Science",
  },
  {
    _id:5,
    image:
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    name: "Best places to visit this winter",
    subject_id: "Maths",
  },
  {
    _id:6,
    image:
      "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80",
    name: "Mountains at night: 12 best locations to enjoy the view",
    subject_id: "Maths",
  },
];

type competitionType = {
  code: string;
  country: string;
  created_at: string;
  message: string;
  mode_id: string;
  name: string;
  parent_competition_id: string;
  status: boolean;
  subject_id: string;
  tags: string;
  updated_at: string;
  _id: string;
};

const useStyles = createStyles(() => ({
  headingBorder: {
    background: "#1250A2",
    borderStyle: "none",
    borderRadius: "0px",
    zIndex: 17,
    width: "97px",
    height: "3px",
    position: "relative",
    margin: "10px 0",
  },
}));

function Courses() {
  const [competitionData, setcompetitionData] = useState<competitionType[]>([]);
  const { classes } = useStyles();

  const slides = data?.map((item) => (
    <Grid.Col span={12} md={4} lg={3} sm={6} key={item._id}>
      <SingleCard {...item} />
    </Grid.Col>
  ));

  const getCompetitionData = async () => {
    let competitions: any = await readCompetitionsLanding();
    setcompetitionData(competitions);
  };

  useEffect(() => {
    getCompetitionData();
  }, []);

  return (
    <Box
    id={"Courses"}
      pt={60}
      pb={70}
      sx={{
        color: "#fff",
        height:"inherit",
      }}
    >
      <Box w={"80%"} m={"auto"}>
        <h2 style={{ lineHeight: "19px" }}>
          <span
            style={{
              fontSize: "18px",
              fontFamily: "Montserrat",
            }}
          >
            <span style={{ fontWeight: 400 }}>POPULAR COURSES </span>
          </span>
        </h2>
        <Box className={classes.headingBorder}>
          <Box
            sx={{
              position: "absolute",
              background: "none",
              height: "3px",
              width: "97px",
            }}
          ></Box>
        </Box>
        <Box pb={"40px"}>
          <h2>
            <span
              style={{
                fontSize: "48px",
                fontFamily: "Playfair Display",
                fontWeight: 900,
              }}
            >
              Our Most
            </span>
            <span
              style={{
                fontFamily: `"Playfair Display"`,
                fontSize: "48px",
                fontWeight: 900,
                color: "",
              }}
            >
              <span style={{ color: "rgb(0, 0, 0)" }}>&nbsp;</span>
              <span
                style={{
                  color:"#E21D22",
                  // background:
                  //   "linear-gradient(to bottom right, #E21D22, #1250A2)",
                  // WebkitBackgroundClip: "text",
                  // WebkitTextFillColor: "transparent",
                  // color: 'linear-gradient(to bottom right, #E21D22, #1250A2)'
                }}
              >
                Popular And Trending
              </span>
            </span>
          </h2>
          <h2 style={{ lineHeight: "45px" }}>
            <span
              style={{
                fontSize: "48px",
                fontFamily: "Playfair Display",
                fontWeight: 900,
              }}
            >
              Online Courses
            </span>
          </h2>
        </Box>
        <Grid
          sx={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {/* <Box sx={{ backgroundColor: "#0074D9" }}>Primary Blue</Box>
          <Box sx={{ backgroundColor: "#3498DB" }}>Secondary Blue</Box>
          <Box sx={{ backgroundColor: "#F06B6F" }}>Accent Red: #E74C3C </Box>
          <Box sx={{ backgroundColor: "#1C3E7E" }}>Subdued Red: #C0392B </Box>
          <Box sx={{ backgroundColor: "#F0CA6B" }}>Neutral Gray: #A9A9A9 </Box>
          <Box sx={{ backgroundColor: "#F5F5F5 " }}>Off-white: #F5F5F5 </Box> */}

          {slides}
        </Grid>
      </Box>
    </Box>
  );
}

export default Courses;
