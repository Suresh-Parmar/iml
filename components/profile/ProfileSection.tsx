import { setGetData } from "@/helpers/getLocalStorage";
import { Card } from "@mantine/core";
import Image from "next/image";
import React, { useState } from "react";
import DownLoadProduct from "./DownLoadProduct";
import ProductForYou from "./ProductForYou";
import YourProduct from "./YourProduct";

function ProfileSection(props: any) {
  const { dataJson, resetPassword, activePage, passwordVisible, setPasswordVisible } = props;
  let userDataDetails = setGetData("userData", "", true);
  userDataDetails = userDataDetails?.user;

  const togglePasswordVisibility = (index: any) => {
    setPasswordVisible({
      ...passwordVisible,
      [index]: !passwordVisible[index],
    });
  };

  const renderFields = () => {
    let dataJsonToRender;
    if (activePage.link == "password") {
      dataJsonToRender = resetPassword;
    } else {
      dataJsonToRender = dataJson;
    }
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
      } else if (newItem.inputType === "password") {
        return (
          <div className="mb-3 row" key={index}>
            <label className="col-form-label capitalize">{item.label}</label>
            <div className="input-group">
              <input className="form-control" {...newItem} />
              <div className=" ">
                <button
                  className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
                  type="button"
                  onClick={() => togglePasswordVisibility(index)}
                >
                  {passwordVisible[index] ? (
                    <span className="material-symbols-outlined">visibility_off</span>
                  ) : (
                    <span className="material-symbols-outlined">visibility</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="mb-3 row" key={index}>
            <label className="col-form-label capitalize">{item.label}</label>
            <input
              checked={newItem.inputType}
              className={`${newItem.inputType ? "form-check-input" : "form-control"}`}
              {...newItem}
            />
          </div>
        );
      }
    });
  };

  return (
    <div>
      <>
        {activePage.link == "yourProduct" && <YourProduct />}
        {activePage.link === "productForYou" && <ProductForYou />}
        {activePage.link === "downloads" && <DownLoadProduct />}
      </>
      {activePage.link == "profile" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "47% 47%",
            gap: "10px",
            justifyContent: "space-between",
          }}
        >
          {renderFields()}
        </div>
      )}
      {activePage.link == "password" && renderFields()}
    </div>
  );
}

export default ProfileSection;
