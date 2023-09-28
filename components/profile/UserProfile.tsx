import React, { useRef, useState } from "react";
import styles from "./profile.module.css";
import { useSelector } from "react-redux";

function UserProfile(props: any) {
  const { dataJson, resetPassword, handleSave } = props;
  let [isPassword, setisPassword] = useState<any>(false);
  let [userImage, setuserImage] = useState<any>("https://cdn-icons-png.flaticon.com/512/149/149071.png");

  const userDataDetails: any = useSelector((state: any) => state?.authentication?.user);
  let inputRef: any = useRef(null);

  const handleSaveData = () => {
    handleSave(isPassword);
  };

  const handleFile = (e: any) => {
    setuserImage(e.target.files[0]);
  };

  const renderFields = () => {
    let dataJsonToRender = isPassword ? resetPassword : dataJson;
    return dataJsonToRender.map((item: any, index: any) => {
      let newItem = { ...item };
      delete newItem.label;
      if (newItem.inputType === "textArea") {
        return (
          <div className="mb-3 row" key={index}>
            <label className="col-form-label capitalize">{item.label}</label>
            <textarea className="form-control" {...newItem} />
          </div>
        );
      } else {
        return (
          <div className="mb-3 row" key={index}>
            <label className="col-form-label capitalize">{item.label}</label>
            <input className="form-control" {...newItem} />
          </div>
        );
      }
    });
  };

  let userImageShow = typeof userImage == "string" ? userImage : URL.createObjectURL(userImage);

  return (
    <div className="m-3">
      <div className="row g-0">
        <div className="col-md-4">
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
        </div>
        <div className="col-md-8 px-4">
          {renderFields()}

          <div className="mb-3 row my-4">
            <button onClick={handleSaveData} className="form-control btn btn-primary">
              Save
            </button>
          </div>
          <div className="my-2 row">
            <a
              className="pointer w-max px-0 py-2 text-primary"
              onClick={() => {
                setisPassword(!isPassword);
              }}
            >
              {isPassword ? "Edit Profile" : " change Password"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
