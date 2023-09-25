"use client";
import { UserProfile } from "@/components/profile";
import { useState } from "react";

function Profile() {
  let [fieldsDataJson, setFieldsDataJson] = useState<any>({});
  let [resetPasswordFieldsJson, setResetPasswordFieldsJson] = useState<any>({});

  console.log(resetPasswordFieldsJson, "resetPasswordFieldsJson");
  console.log(fieldsDataJson, "fieldsDataJson");
  const handleFieldsChange = (json: any, setJson: any, key: string, evt: any) => {
    let value = evt.target.value;
    json[key] = value;
    setJson({
      ...json,
    });
  };

  let handle;

  const dataJson = [
    {
      label: "name",
      placeholder: "John Smith",
      value: fieldsDataJson.name || "",
      type: "text",
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, "name", e),
    },
    {
      label: "Email",
      placeholder: "John@gmail.com",
      value: fieldsDataJson.email || "",
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, "email", e),
      type: "email",
    },
    {
      label: "Registration Number",
      value: fieldsDataJson.registrationnumber || "",
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, "registrationnumber", e),
      placeholder: "0000000000",
      type: "text",
    },
  ];

  const resetPasswordJson = [
    {
      label: "password",
      placeholder: "**********",
      value: resetPasswordFieldsJson.password || "",
      type: "password",
      onChange: (e: any) => handleFieldsChange(resetPasswordFieldsJson, setResetPasswordFieldsJson, "password", e),
    },
    {
      label: "New Password",
      placeholder: "**********",
      value: resetPasswordFieldsJson.newPassword || "",
      onChange: (e: any) => handleFieldsChange(resetPasswordFieldsJson, setResetPasswordFieldsJson, "newPassword", e),
      type: "password",
    },
    {
      label: "Confirm Password",
      placeholder: "**********",
      value: resetPasswordFieldsJson.confirmPassword || "",
      onChange: (e: any) =>
        handleFieldsChange(resetPasswordFieldsJson, setResetPasswordFieldsJson, "confirmPassword", e),

      type: "password",
    },
  ];

  return <UserProfile dataJson={dataJson} resetPassword={resetPasswordJson} />;
}

export default Profile;
