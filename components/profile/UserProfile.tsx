import React, { useEffect, useRef, useState } from "react";
import styles from "./profile.module.css";
import { useDispatch, useSelector } from "react-redux";
import { ProfileSection, ProfileSidebar } from "./index";
import { ControlApplicationShellComponents } from "@/redux/slice";
import { uploadMedia } from "@/utilities/API";
import Loader from "../common/Loader";

function UserProfile(props: any) {
  const dispatch = useDispatch();
  const { handleSave, onlyPassWord } = props;
  let [userImage, setuserImage] = useState<any>("https://cdn-icons-png.flaticon.com/512/149/149071.png");
  const [activePage, setActivePage] = useState<any>(
    onlyPassWord
      ? { title: "Password", link: "password", showImage: false }
      : { title: "Profile", link: "profile", showImage: true }
  );
  let [loading, setLoading] = useState<any>(false);

  const userDataDetails: any = useSelector((state: any) => state?.data?.userData?.user);
  let inputRef: any = useRef(null);

  let isRMuser = userDataDetails?.role != "rm";

  const handleFile = (e: any) => {
    let confirm = window.confirm("Are you sure you want to change profile Image?");
    if (confirm) {
      setuserImage(e.target.files[0]);
    }
  };

  useEffect(() => {
    userDataDetails?.profile_url && setuserImage(userDataDetails?.profile_url);
  }, [userDataDetails?.profile_url]);

  useEffect(() => {
    if (typeof userImage == "object") {
      updateUserImage();
    }
  }, [userImage]);

  useEffect(() => {
    dispatch(
      ControlApplicationShellComponents({
        showHeader: true,
        showFooter: false,
        showNavigationBar: isRMuser,
        hideNavigationBar: true,
        showAsideBar: false,
      })
    );
  }, []);

  const updateUserImage = () => {
    const payload = new FormData();
    payload.append("file", userImage);
    payload.append("meta_data", JSON.stringify({ file_path: "profile" }));

    setLoading(true);
    uploadMedia(payload)
      .then((res) => {
        setLoading(false);
        if (res.data.actual_url) {
          setuserImage(res.data.actual_url);
          handleSave(activePage, res.data.actual_url);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  let userImageShow = typeof userImage == "string" ? userImage : URL.createObjectURL(userImage);

  const renderProfileImage = () => {
    return (
      <div className={styles.userImage}>
        <div className={styles.imageView}>
          <img
            src={userImageShow}
            alt=""
            width="100"
            height="100"
            style={{ width: "250px", height: "250px", objectFit: "cover" }}
          />
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
          <div className="role capitalize">
            {userDataDetails?.role != "rm" && (userDataDetails?.role?.replace("_", " ") || "Role")}{" "}
            {userDataDetails?.username || ""}
          </div>
        </div>
      </div>
    );
  };

  let smlWidth = activePage.showImage ? "col-md-8" : "";

  return (
    <div className="m-3">
      <div className="row g-0">
        {!onlyPassWord && (
          <div className="col-2">
            <ProfileSidebar setActive={setActivePage} />
          </div>
        )}
        <div className={!onlyPassWord ? "col-10" : ""}>
          <div className="row g-0">
            <div className={`${smlWidth} px-4`} style={{ height: "90vh", overflow: "auto" }}>
              <ProfileSection {...props} activePage={activePage} />
              {activePage.link !== "yourProduct" &&
                activePage.link !== "productForYou" &&
                activePage.link !== "downloads" && (
                  <div className="mb-3 row my-4">
                    <button
                      // onClick={() => {
                      //   handleSave(activePage);
                      // }}
                      onClick={() => {
                        let windowConfirm = window.confirm("Are you sure you want to save?");
                        if (windowConfirm) {
                          handleSave(activePage);
                        }
                      }}
                      className="form-control btn btn-primary"
                    >
                      Save
                    </button>
                  </div>
                )}
            </div>
            {activePage.showImage && <div className="col-md-4">{renderProfileImage()}</div>}
          </div>
        </div>
      </div>
      <Loader show={loading} />
    </div>
  );
}

export default UserProfile;
