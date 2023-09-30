import React, { useRef, useState } from "react";
import styles from "./profile.module.css";
import { useSelector } from "react-redux";
import { ProfileSection, ProfileSidebar } from "./index";

function UserProfile(props: any) {
  const { handleSave } = props;
  let [userImage, setuserImage] = useState<any>("https://cdn-icons-png.flaticon.com/512/149/149071.png");
  const [activePage, setActivePage] = useState<any>({ title: "Profile", link: "profile", showImage: true });

  const userDataDetails: any = useSelector((state: any) => state?.authentication?.user);
  let inputRef: any = useRef(null);

  const handleFile = (e: any) => {
    setuserImage(e.target.files[0]);
  };

  let userImageShow = typeof userImage == "string" ? userImage : URL.createObjectURL(userImage);

  const renderProfileImage = () => {
    return (
      <div className={styles.userImage}>
        <div className={styles.imageView}>
          <img src={userImageShow} />
          <input
            onChange={handleFile}
            ref={inputRef}
            type="file"
            style={{ display: "none" }}
            accept="image/*"
            value=""
          />
          <span
            onClick={() => {
              inputRef.current.click();
            }}
            className="material-symbols-outlined"
          >
            edit
          </span>
        </div>
        <div className={`${styles.userText} text-center`}>
          <div className={styles.userName}>{userDataDetails?.name || "User Name"}</div>
          <div className="role capitalize"> {userDataDetails?.role?.replace("_", " ") || "Role"}</div>
        </div>
      </div>
    );
  };

  let smlWidth = activePage.showImage ? "col-md-8" : "";

  return (
    <div className="m-3">
      <div className="row g-0">
        <div className="col-3">
          <ProfileSidebar setActive={setActivePage} />
        </div>
        <div className="col-9">
          <div className="row g-0">
            <div className={`${smlWidth} px-4`}>
              <ProfileSection {...props} activePage={activePage} />
              <div className="mb-3 row my-4">
                <button
                  onClick={() => {
                    handleSave(activePage);
                  }}
                  className="form-control btn btn-primary"
                >
                  Save
                </button>
              </div>
            </div>
            {activePage.showImage && <div className="col-md-4">{renderProfileImage()}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
