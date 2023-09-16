"use client";

import ApplicationShell from "@/components/ApplicationShell";
import { Footer } from "@/components/LandingPage/Footer";
import SchoolRegistrationForm from "@/components/LandingPage/form/schoolRegistrationForm";
import { Box, Container, Title, createStyles } from "@mantine/core";
import React from "react";
import data from "@/components/LandingPage/Footer/data.json";

const useStyles = createStyles((theme) => ({
  wrapper: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[1],
    paddingTop: "45px",
  },
  input: {
    color: theme.colorScheme === "dark" ? theme.colors.gray[3] : "#495057",
    fontSize: "15px",
    marginBottom: "12px",
  },
  title: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[0]
        : theme.colors.dark[8],
    display: "flex",
    fontSize: "46px",
    fontWeight: 900,
    paddingLeft: "15px",
    fontFamily: `"Playfair Display"`,
  },
}));

function ReferYourSchool() {
  const { classes } = useStyles();

  return (
    <Box className={classes.wrapper}>
      <Container pb={"40px"}>
        <Box mb={"30px"} sx={{ borderLeft: "3px solid #1C3E7E" }}>
          <Title className={classes.title}>
            {" "}
            School{" "}
            <span style={{ color: "#E01E22", paddingLeft: "10px" }}>
              {" "}
              {"  Registration"}{" "}
            </span>
          </Title>
        </Box>
        <Box className={classes.input}>
          If you would like to affiliate your school and enrol students for
          mental maths competition, please fill up the following details and our
          representative will contact school authorities as soon as possible.
        </Box>
        <SchoolRegistrationForm />
      </Container>
      <Footer {...data} />
    </Box>
  );
}

export default ReferYourSchool;
