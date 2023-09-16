'use client';

import ApplicationShell from "@/components/ApplicationShell";
import { Footer } from "@/components/LandingPage/Footer";
import JoinAsCordinator from "@/components/LandingPage/form/joinAsCordinator";
import { Box, Container, Title, createStyles } from "@mantine/core";
import React from "react";
import data from '@/components/LandingPage/Footer/data.json'

const useStyles = createStyles((theme) => ({
  wrapper:{
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[1],
    paddingTop:"45px",
  },
  input :{
     color : theme.colorScheme === "dark" ? theme.colors.gray[3] : '#495057'
  },
  title :{
    color: theme.colorScheme === "dark" ? theme.colors.gray[0] : theme.colors.dark[8],
  },
}))

function JoinAsCordinatorLayout() {

  const { classes } = useStyles();

  return (
    <Box className={classes.wrapper}>
      <Container pb={"45px"}>
        <Box mb={"30px"} sx={{ borderLeft: "3px solid #1C3E7E" }}>
          <Title
            sx={{
              display: "flex",
              fontSize: "46px",
              fontWeight: 900,
              paddingLeft: "15px",
              fontFamily: `"Playfair Display"`,
            }}
            className={classes.title}
          >
            {" "}
            Join us as{" "}
            <span style={{ color: "#E01E22", paddingLeft: "10px" }}>
              {" "}
              {"  Cordinator"}{" "}
            </span>
          </Title>
        </Box>
        <Box
        className={classes.input}
          style={{ fontSize: "15px", marginBottom: "12px", color: "" }}
        >
          We present a great career opportunity to you if you are passionate
          about education, have excellent communication skills and care for
          customer satisfaction.
          <br />
          Profile – Approach schools in your region, enrol students for
          competition, conduct examination and solve queries if any.
        </Box>
        <JoinAsCordinator />
      </Container>
      <Footer {...data} />
    </Box>
  );
}

export default JoinAsCordinatorLayout;
