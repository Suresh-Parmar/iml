import React, { useState } from "react";
import styles from "./profile.module.css";

function UserProfile(props: any) {
  const { dataJson, resetPassword } = props;

  let [isPassword, setisPassword] = useState<any>(false);

  const renderFields = () => {
    let dataJsonToRender = isPassword ? resetPassword : dataJson;
    return dataJsonToRender.map((item: any, index: any) => {
      let newItem = { ...item };
      delete newItem.label;
      return (
        <div className="mb-3 row" key={index}>
          <label className="col-form-label">{item.label}</label>
          <input className="form-control" {...newItem} />
        </div>
      );
    });
  };

  return (
    <div className="m-3">
      <div className="row g-0">
        <div className="col-md-4">
          <div className={styles.userImage}>
            <div className={styles.imageView}>
              <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" />
              <span className="material-symbols-outlined">edit</span>
            </div>
            <div className={`${styles.userText} text-center`}>
              <div className={styles.userName}>User Name</div>
              <div className="role">Role</div>
            </div>
          </div>
        </div>
        <div className="col-md-8 px-4">
          {renderFields()}

          <div className="mb-3 row my-4">
            <button className="form-control btn btn-primary">Save</button>
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
