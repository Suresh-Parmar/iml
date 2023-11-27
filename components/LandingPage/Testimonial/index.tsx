import { Box, Center, Text, Title } from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";
import StudentCard from "./StudentCard";
import { Carousel } from "@mantine/carousel";
import { useStyles } from "./style";
import Autoplay from "embla-carousel-autoplay";
import { TeacherCard } from "./TeacherCard";
import { readDataFromNEXT, readTestimonial } from "@/utilities/API";
import { setGetData } from "@/helpers/getLocalStorage";
// import Matrix, { MatrixDataType } from '@/components/Matrix';
const data = [
  {
    image:
      "https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    title: "Best forests to visit in North America",
    category: "nature",
  },
  {
    image:
      "https://images.unsplash.com/photo-1630841539293-bd20634c5d72?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    title: "Hawaii beaches review: better than you think",
    category: "beach",
  },
  {
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    title: "Mountains at night: 12 best locations to enjoy the view",
    category: "nature",
  },
  {
    image:
      "https://images.unsplash.com/photo-1632922267756-9b71242b1592?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    title: "Aurora in Norway: when to visit for best experience",
    category: "nature",
  },
  {
    image:
      "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    title: "Mountains at night: 12 best locations to enjoy the view",
    category: "nature",
  },
];

const teachers = [
  {
    image:
      "https://images.unsplash.com/photo-1602080858428-57174f9431cf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    category: "technology",
    title: "The best laptop for Frontend engineers in 2022",
    date: "Feb 6th",
    author: {
      name: "Elsa Brown",
      avatar:
        "https://images.unsplash.com/photo-1628890923662-2cb23c2e0cfe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    },
  },
  {
    image:
      "https://images.unsplash.com/photo-1602080858428-57174f9431cf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    category: "technology",
    title: "The best laptop for Frontend engineers in 2022",
    date: "Feb 6th",
    author: {
      name: "Elsa Brown",
      avatar:
        "https://images.unsplash.com/photo-1628890923662-2cb23c2e0cfe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    },
  },
  {
    image:
      "https://images.unsplash.com/photo-1602080858428-57174f9431cf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    category: "technology",
    title: "The best laptop for Frontend engineers in 2022",
    date: "Feb 6th",
    author: {
      name: "Elsa Brown",
      avatar:
        "https://images.unsplash.com/photo-1628890923662-2cb23c2e0cfe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    },
  },
  {
    image:
      "https://images.unsplash.com/photo-1602080858428-57174f9431cf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    category: "technology",
    title: "The best laptop for Frontend engineers in 2022",
    date: "Feb 6th",
    author: {
      name: "Elsa Brown",
      avatar:
        "https://images.unsplash.com/photo-1628890923662-2cb23c2e0cfe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    },
  },
];
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

function StudentTestimonial() {
  const autoplay = useRef(Autoplay({ delay: 2000 }));
  const teacherTestimonailRef = useRef(Autoplay({ delay: 3000 }));
  let isDarkThem = setGetData("colorScheme");

  const { classes } = useStyles(isDarkThem);
  const [StudentData, setStudentData] = useState<TestimonialResponse[]>([]);
  const [teacherData, setteacherData] = useState<TestimonialResponse[]>([]);
  const [apiRes, setapiRes] = useState<any>(false);

  const studentSlides = StudentData?.map((item) => (
    <Carousel.Slide key={item._id} ta={"center"} display={"flex"}>
      <StudentCard {...item} />
    </Carousel.Slide>
  ));

  const teacherSlides = teacherData.map((item) => (
    <Carousel.Slide key={item._id}>
      <TeacherCard {...item} />
    </Carousel.Slide>
  ));

  const getData = async () => {
    let data = { collection_name: `testimonials`, op_name: `find_many` };
    let testimonial: any = await readDataFromNEXT(data);
    testimonial = testimonial?.data;

    let teacherArr = testimonial?.filter((item: any) => {
      return item?.role === "teacher" && item;
    });
    setteacherData(teacherArr);
    let studentArr = testimonial?.filter((item: any) => {
      return item?.role !== "teacher" && item;
    });
    setStudentData(studentArr);
  };

  const getDataServer = async () => {
    const testimonial: any = await readTestimonial();

    let teacherArr = testimonial?.filter((item: any) => {
      return item?.role === "teacher" && item;
    });
    setteacherData(teacherArr);
    let studentArr = testimonial?.filter((item: any) => {
      return item?.role !== "teacher" && item;
    });
    setStudentData(studentArr);
    setapiRes(true);
  };

  useEffect(() => {
    if ((!StudentData.length || !teacherData.length) && apiRes) {
      getData();
    }
  }, [StudentData, teacherData]);

  useEffect(() => {
    getDataServer();
  }, []);

  return (
    <Box py={80} sx={{ backgroundColor: "rgb(243 241 254)" }}>
      <Center display={"grid"} ta={"center"}>
        <Title color="#0a5392" order={2} size={40}>
          Testimonials
        </Title>
        {StudentData?.length ? (
          <Text color="#495057" mt={"18px"} fz={"20px"} transform="uppercase">
            see what our students have to say
          </Text>
        ) : null}
      </Center>
      {StudentData?.length ? (
        <Box w={"90%"} m={"auto"}>
          <Carousel
            withIndicators
            height={400}
            slideSize="33.4%"
            slideGap="md"
            loop
            align="start"
            breakpoints={[
              { maxWidth: "md", slideSize: "50%" },
              { maxWidth: "sm", slideSize: "100%", slideGap: 1 },
            ]}
            mx="auto"
            plugins={[autoplay.current]}
            onMouseEnter={autoplay.current.stop}
            onMouseLeave={autoplay.current.reset}
            slidesToScroll={1}
            classNames={{
              viewport: classes.carouselCont,
              container: classes.carouselCont,
              indicators: classes.indicator,
              controls: classes.controlers,
            }}
          >
            {studentSlides}
          </Carousel>
        </Box>
      ) : null}

      <div style={{ marginTop: "25px" }}>
        <Center mb={"18px"} display={"grid"} ta={"center"}>
          <Text color="#495057" mt={"18px"} fz={"20px"} transform="uppercase">
            see what our teachers have to say
          </Text>
        </Center>
        <Box w={"90%"} mt={"40px"} m={"auto"}>
          <Carousel
            withIndicators
            height={400}
            slideSize="33.4%"
            slideGap="xs"
            loop
            align="start"
            breakpoints={[
              { maxWidth: "md", slideSize: "50%" },
              { maxWidth: "sm", slideSize: "100%", slideGap: 1 },
            ]}
            mx="auto"
            classNames={{
              viewport: classes.carouselCont,
              container: classes.carouselCont,
              indicators: classes.indicator,
              controls: classes.controlers,
            }}
            plugins={[teacherTestimonailRef.current]}
            onMouseEnter={teacherTestimonailRef.current.stop}
            onMouseLeave={teacherTestimonailRef.current.reset}
            slidesToScroll={1}
          >
            {teacherSlides}
          </Carousel>
        </Box>
      </div>
    </Box>
  );
}

export default StudentTestimonial;
