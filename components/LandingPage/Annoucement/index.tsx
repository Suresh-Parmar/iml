import { Box, Center, Title, useMantineTheme } from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useMediaQuery } from "@mantine/hooks";
import SingleCard from "./SingleCard";
import { useStyles } from "./style";
import { readAnnoucements } from "@/utilities/API";
import { setGetData } from "@/helpers/getLocalStorage";

const data = [
  {
    imgLink: "https://www.ignitedmindlab.com/css/template1/images/circle1.png",
    title: "Best forests to visit in North America",
    category: "nature",
    // color:
  },
  {
    imgLink: "https://www.ignitedmindlab.com/css/template1/images/circle2.png",
    title: "Hawaii beaches review: better than you think",
    category: "beach",
    // color:
  },
  {
    imgLink: "https://www.ignitedmindlab.com/css/template1/images/circle3.png",
    title: "Mountains at night: 12 best locations to enjoy the view",
    category: "nature",
    // color:
  },
  {
    imgLink: "https://www.ignitedmindlab.com/css/template1/images/circle2.png",
    title: "Aurora in Norway: when to visit for best experience",
    category: "nature",
    // color:
  },
  {
    imgLink: "https://www.ignitedmindlab.com/css/template1/images/circle3.png",
    title: "Mountains at night: 12 best locations to enjoy the view",
    category: "nature",
    // color:
  },
];

type AnnoucementType = {
  country: string;
  created_at: string;
  enddate: string;
  name: string;
  status: boolean;
  whatsnew: string;
  _id: string;
};

function Annoucement() {
  const autoplay = useRef(Autoplay({ delay: 2000 }));

  const { classes } = useStyles();
  const [annoucementData, setannoucementData] = useState<AnnoucementType[]>([]);
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const slides = annoucementData?.map((item, idx) => (
    <Carousel.Slide key={item._id}>
      <SingleCard image={data[idx]?.imgLink} {...item} />
    </Carousel.Slide>
  ));

  const getAnnoucemnets = async () => {
    const Annoucement: any = await readAnnoucements();
    setannoucementData(Annoucement);
  };

  useEffect(() => {
    getAnnoucemnets();
  }, []);

  return (
    <Box pt={80} pb={40} sx={{ backgroundColor: "rgb(243 241 254)" }}>
      {/* <Center>
        <Title order={2} size={40}>
          Annoucements
        </Title>
      </Center> */}
      <Box w={"80%"} m={"auto"}>
        <Carousel
          withIndicators
          height={400}
          slideSize="24%"
          slideGap="md"
          loop
          align="start"
          breakpoints={[
            { maxWidth: "md", slideSize: "50%" },
            { maxWidth: "sm", slideSize: "100%", slideGap: 2 },
          ]}
          mx="auto"
          classNames={{
            viewport: classes.carouselCont,
            container: classes.carouselCont,
            indicators: classes.indicator,
            controls: classes.controlers,
          }}
          // plugins={[autoplay.current]}
          // onMouseEnter={autoplay.current.stop}
          // onMouseLeave={autoplay.current.reset}
          // slidesToScroll={1}
        >
          {slides}
        </Carousel>
      </Box>
    </Box>
  );
}

export default Annoucement;
