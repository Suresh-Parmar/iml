import { Box, Grid, Text, Title } from "@mantine/core";
import Image from "next/image";
import React from "react";
import AboutUsImage from "../assets/aboutusImage.png";

function Aboutus() {
  return (
    <Box id="Aboutus" sx={{ backgroundColor: "#fff", color:"#000" }} py={80}>
      <Box w={"80%"} m={"auto"}>
        <Grid>
          <Grid.Col sm={12} md={4} lg={5.5} p={"10px 5% 10px 10px"}>
            <Box mb={"30px"} sx={{ borderLeft: "3px solid #1C3E7E" }}>
              <Title
                sx={{
                  display: "flex",
                  fontSize: "46px",
                  fontWeight: 900,
                  paddingLeft: "15px",
                  fontFamily: `"Playfair Display"`,
                 
                }}
              >
                {" "}
                About{" "}
                <span style={{ color: "#E01E22", paddingLeft: "10px" }}>
                  {" "}
                  {"  Us"}{" "}
                </span>
              </Title>
            </Box>
            <Text fw={600} ta={"left"} fz={16}>
              IGNITED MIND LAB Mental Maths Competition
            </Text>

            <Text ta={"left"} color="#343232" pb={20} fz={"14px"}>
              Ignited Mind Lab Mental Maths Competition is very unique and
              immensely effective in developing interest in Maths. Our main
              objective is to develop interest in Maths by engaging students
              into solving variety of problems at different levels of difficulty
              and give them confidence that they can do it. It is much more than
              a mere competition.
            </Text>
            <Text ta={"center"} fz={18} pb={25} fw={600}>
              Excellence in Arithmetic * Application of Maths concepts * HOTS
              (higher order thinking skills)
            </Text>
            <Text ta={"left"} pb={20} fz={"14px"}>
              <span style={{ fontWeight: 600 }}>
                Objectives of Mental Maths Competition:-
              </span>
              <Box sx={{color:"#343232"}} pl={"10px"}>
              <p>To promote interest in mental maths,</p>
              <p>To test speed and accuracy of arithmetic calculations, </p>
              <p>
                To inspire confidence in students that they can solve
                challenging problems themselves.{" "}
              </p>
              </Box>
            </Text>
            <Text ta={"left"} pb={20} color="#343232" fz={"14px"}>
              <span style={{ width: "100%",color:"#000", fontWeight: 600 }}>
                {" "}
                Curriculum / Syllabus and Study materials:-
              </span>
              <br />
              The curriculum covers the fundamental concepts of Mathematics.
              Every Grade has a separate curriculum, appropriate for its level
              (Sr. KG to VII). Study material is our strength. A lot of thinking
              and efforts have gone into evolving the study material over the
              years. We approach the subject in a step-wise and scientific
              manner..
            </Text>
            {/* <Text ta={"left"} pb={20}>
              Read More...
            </Text> */}
          </Grid.Col>
          <Grid.Col sm={12} md={8} lg={6.5}>
            <Box>
              <Image
                src={AboutUsImage}
                alt=""
                style={{ width: "fit-content", objectFit: "contain" }}
              />
            </Box>
          </Grid.Col>
        </Grid>
      </Box>
    </Box>
  );
}

export default Aboutus;
