import { Box, Overlay } from "@mantine/core";
import React from "react";
import styles from "./Stylling.module.css";
import Aboutus from "./Aboutus";
import { Banner } from "./Banner";
import Annoucement from "./Annoucement";
import StudentTestimonial from "./Testimonial";
import data from "./Footer/data.json";
import { Footer } from "./Footer";
import Courses from "./Courses";
import Contactus from "./Contactus";
import { MarksResult } from "../result";

function Wrapper() {
  return (
    <Box className={styles.mainCont}>
      <Banner />
      <Aboutus />
      <Annoucement />
      <div className={styles.bgimg1}>
        <div className={styles.overlay}></div>
        <div className={styles.caption}>
          {/* <span className={styles.border}> */}
          <Courses />
          {/* </span> */}
        </div>
      </div>
      {/* <div className={styles.bgimg2}>
        <div className={styles.caption}>
          <span className={`${styles.border} ${styles.container}`}>
            LESS HEIGHT
          </span>
        </div>
      </div> */}
      <div className={styles.relative}>
        <StudentTestimonial />
      </div>
      {/* <div className={styles.bgimg3}>
        <div className={styles.caption}>
          <span className={`${styles.border} ${styles.container}`}>
            SCROLL UP
          </span>
        </div>
      </div> */}
      {/* 
      <div className={styles.relative}>
        <div className={styles.wrapCont}>
          <p>
            Scroll up and down to really get the feeling of how Parallax
            Scrolling works.
          </p>
        </div>
      </div> */}
      <Contactus />
      <div className={styles.bgimg1}>
        <div className={styles.caption}>
          <Footer {...data} />
          {/* <span className={styles.border}>COOL!</span> */}
        </div>
      </div>
    </Box>
  );
}

export default Wrapper;
