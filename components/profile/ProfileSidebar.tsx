import { setGetData } from "@/helpers/getLocalStorage";
import React, { useState } from "react";
import styles from "./profile.module.css";

function ProfileSidebar(props: any) {
  const { setActive } = props;
  const [activeBar, setActiveBar] = useState(0);
  let userDataDetails = setGetData("userData", "", true);
  userDataDetails = userDataDetails?.user;
  const allData = [
    { title: "Profile", link: "profile", showImage: true },
    { title: "Password", link: "password", showImage: false },
    userDataDetails?.role == "student" && { title: "Your Product", link: "yourProduct", showImage: false },
    userDataDetails?.role == "student" && { title: "Product For You", link: "productForYou", showImage: false },
    userDataDetails?.role == "student" && { title: "Downloads", link: "downloads", showImage: false },
  ];

  const renderData = () => {
    return allData.map((item, index) => {
      let active = index == activeBar ? styles.active : "";

      let { title, link }: any = item;
      return (
        <div
          className={`${styles.sidemenuProfile} ${active}`}
          key={index}
          onClick={() => {
            setActiveBar(index);
            setActive && setActive(item);
          }}
        >
          {title}
        </div>
      );
    });
  };

  return <div>{renderData()}</div>;
}

export default ProfileSidebar;
