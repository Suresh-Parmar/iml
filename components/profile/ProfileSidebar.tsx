import React, { useState } from "react";
import styles from "./profile.module.css";

function ProfileSidebar(props: any) {
  const { setActive } = props;
  const [activeBar, setActiveBar] = useState(0);

  const allData = [
    { title: "Profile", link: "profile", showImage: true },
    { title: "Password", link: "password", showImage: false },
  ];

  const renderData = () => {
    return allData.map((item, index) => {
      let active = index == activeBar ? styles.active : "";

      let { title, link } = item;
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
