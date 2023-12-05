import React, { useState } from "react";
import { Box, Button, Flex, Grid, Text, TextInput, Title, createStyles } from "@mantine/core";
import ContactForm from "../form/contactForm";
import { setGetData } from "@/helpers/getLocalStorage";
import { useSelector } from "react-redux";
import { useLandingPageAPisQuery } from "@/redux/apiSlice";
import { iterateData } from "@/helpers/getData";

const useStyles = createStyles((theme, colorScheme: any) => ({
  wrapper: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.white,
  },
  title: {
    color: theme.colorScheme === "dark" ? theme.colors.gray[0] : theme.colors.dark[8],
  },
  text: {
    color: theme.colorScheme === "dark" ? theme.colors.gray[1] : "#495057",
  },
  subHead: {
    color: theme.colorScheme === "dark" ? "#3b79ee" : "#072e78",
  },
}));

function Contactus() {
  // SiteConfigs;
  let isDarkThem = setGetData("colorScheme");

  const { classes } = useStyles(isDarkThem);
  const [MobileNo, setMobileNo] = useState("");

  const reduxData = useSelector((state: any) => state?.data);
  let selectedCountry = reduxData.selectedCountry;

  let productsDataPayload: any = {
    collection_name: "site_configs",
    op_name: "find_many",
    filter_var: {
      status: true,
      country: selectedCountry.label || "India",
    },
  };

  let productsData = useLandingPageAPisQuery(productsDataPayload);
  productsData = iterateData(productsData);
  if (productsData) {
    productsData = productsData[0];
  }

  return (
    <Box id="Contactus" className={classes.wrapper} py={80}>
      <Box w={"80%"} m={"auto"}>
        <Grid>
          <Grid.Col sm={12} md={4} lg={6.5} p={"10px 5% 10px 10px"}>
            <Box mb={"30px"} sx={{ borderLeft: "3px solid #1C3E7E" }}>
              <Title
                className={classes.title}
                sx={{
                  display: "flex",
                  fontSize: "46px",
                  fontWeight: 900,
                  paddingLeft: "15px",
                  fontFamily: `"Playfair Display"`,
                }}
              >
                {" "}
                Contact <span style={{ color: "#E01E22", paddingLeft: "10px" }}> {"  Us"} </span>
              </Title>
            </Box>
            <ContactForm />
          </Grid.Col>
          <Grid.Col
            sm={12}
            md={8}
            lg={5.5}
            style={{
              display: "flex",
              justifyContent: "center",
              // alignItems: "center",
              marginTop: "118px",
            }}
          >
            <Box>
              <Title variant="h4" className={classes.title} style={{ padding: "8px 0" }}>
                Office <span style={{ color: "#E01E22" }}>Address</span>
              </Title>
              <div dangerouslySetInnerHTML={{ __html: productsData?.address }} />
              {/* <div className={classes.subHead} style={{ textTransform: "uppercase", marginTop: "10px" }}>
                Ignited Mind Lab
              </div>
              <div>
                <p>C-157, Antop Hill Warehouse Complex,</p>
                <p>Near Barkat Ali Naka, Wadala (E),</p>
                <p>Mumbai – 400 037</p>
                <br />
                <Box className={classes.subHead}>Email</Box>
                support@ignitedmindlab.com
                <br />
                <Box className={classes.subHead}>Phone</Box>
                022-50020110 / 50020120
              </div> */}
              <br />
              <Box>
                <span className={classes.subHead} style={{ fontSize: "16px" }}>
                  Get address by SMS:
                </span>
                <Flex direction={"column"} gap={"md"}>
                  <TextInput
                    label="Mobile"
                    placeholder="9876543210"
                    w={"100%"}
                    mt={"xs"}
                    size="md"
                    onChange={(e) => {
                      setMobileNo(e.target.value);
                    }}
                  />
                  <Button type="submit">Send SMS</Button>
                </Flex>
              </Box>
            </Box>
          </Grid.Col>
        </Grid>
      </Box>
    </Box>
  );
}

export default Contactus;
