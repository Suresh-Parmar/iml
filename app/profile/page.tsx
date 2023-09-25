"use client";
import { UserProfile } from "@/components/profile";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { forgotCreds } from "@/utilities/API";
import { useSelector } from "react-redux";

function Profile() {
  let [fieldsDataJson, setFieldsDataJson] = useState<any>({});
  let [resetPasswordFieldsJson, setResetPasswordFieldsJson] = useState<any>({});
  const allReduxData: any = useSelector((state) => state);
  let userDataDetails = allReduxData?.authentication?.user?.username;

  const handleFieldsChange = (json: any, setJson: any, key: string, evt: any) => {
    let value = evt.target.value;
    json[key] = value;
    setJson({
      ...json,
    });
  };

  let handleSave = (isPassword: any) => {
    let { password, newPassword, confirmPassword } = resetPasswordFieldsJson;

    setResetPasswordFieldsJson({});
    if (isPassword) {
      if (!!password && !!newPassword && !!confirmPassword) {
        if (newPassword == confirmPassword) {
          let payload: any = {
            registration_details: userDataDetails,
            ops_identifier: "change_password",
            new_password: newPassword,
            password: password,
          };

          forgotCreds(payload, true)
            .then((res) => {
              notifications.show({
                title: `Password updated successfully`,
                message: ``,
                autoClose: 8000,
              });
            })
            .catch((err) => {
              console.log(err, "resres");
            });
        } else {
          notifications.show({
            title: `Password didn't match`,
            message: ``,
            autoClose: 8000,
          });
        }
      }
    } else {
      console.log(fieldsDataJson);
      notifications.show({
        message: "user Profile",
        autoClose: 8000,
      });
    }
  };

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

  return <UserProfile handleSave={handleSave} dataJson={dataJson} resetPassword={resetPasswordJson} />;
}

export default Profile;
