"use client";
import { UserProfile } from "@/components/profile";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { forgotCreds } from "@/utilities/API";
import { useSelector } from "react-redux";
import { updateUser } from "../authentication/state/authenticationSlice";
import { useApplicationDispatch } from "@/redux/hooks";

function Profile() {
  let [fieldsDataJson, setFieldsDataJson] = useState<any>({});
  let [resetPasswordFieldsJson, setResetPasswordFieldsJson] = useState<any>({});
  const dispatch = useApplicationDispatch();
  const allReduxData: any = useSelector((state) => state);
  let userDataDetails = allReduxData?.authentication?.user;

  console.log(userDataDetails, "userDataDetails");

  let { username } = userDataDetails;

  useEffect(() => {
    setFieldsDataJson({ ...userDataDetails });
  }, [userDataDetails]);

  const handleFieldsChange = (json: any, setJson: any, key: string, evt: any) => {
    let value = evt.target.value;
    json[key] = value;
    setJson({
      ...json,
    });
  };

  const saveUserDetails = () => {
    dispatch(updateUser({ data: fieldsDataJson })).unwrap();
  };

  let handleSave = (isPassword: any) => {
    let { password, newPassword, confirmPassword } = resetPasswordFieldsJson;

    setResetPasswordFieldsJson({});
    if (isPassword) {
      if (!!password && !!newPassword && !!confirmPassword) {
        if (newPassword == confirmPassword) {
          let payload: any = {
            registration_details: username,
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
            title: `New Password And Confirm Password not match`,
            message: ``,
            autoClose: 8000,
          });
        }
      }
    } else {
      saveUserDetails();
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
      value: fieldsDataJson.email_1 || "",
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, "email_1", e),
      type: "email",
    },
    {
      label: "address",
      placeholder: "Address",
      value: fieldsDataJson.address || "",
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, "address", e),
      type: "text",
      inputType: "textArea",
    },
    {
      label: "Mobile",
      placeholder: "0123456789",
      value: fieldsDataJson.mobile_1 || "",
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, "mobile_1", e),
      type: "text",
    },
  ];

  const resetPasswordJson = [
    {
      label: "Old Password",
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
