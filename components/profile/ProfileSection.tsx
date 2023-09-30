import React from "react";

function ProfileSection(props: any) {
  const { dataJson, resetPassword, activePage } = props;

  const renderFields = () => {
    let dataJsonToRender = activePage.link == "password" ? resetPassword : dataJson;
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

  return <div>{renderFields()}</div>;
}

export default ProfileSection;
