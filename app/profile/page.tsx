"use client";
import { UserProfile } from "@/components/profile";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { forgotCreds, updateDataRes } from "@/utilities/API";
import { useSelector } from "react-redux";
import { updateUser } from "../authentication/state/authenticationSlice";
import { getReduxState, useApplicationDispatch } from "@/redux/hooks";
import { getInternationalDailingCode } from "@/utilities/countriesUtils";
import Loader from "@/components/common/Loader";

function Profile() {
  let [fieldsDataJson, setFieldsDataJson] = useState<any>({});
  let [resetPasswordFieldsJson, setResetPasswordFieldsJson] = useState<any>({});
  let [loading, setLoading] = useState<any>(false);
  const dispatch = useApplicationDispatch();
  const allReduxData: any = useSelector((state) => state);
  let userDataDetails = allReduxData?.authentication?.user;

  let { username } = userDataDetails;
  const getSelectedCountry = () => {
    const state = getReduxState();
    return state.client.selectedCountry.name;
  };

  const getMobileCode = () => {
    return `+${getInternationalDailingCode(getSelectedCountry())}`;
  };

  useEffect(() => {
    let data = structuredClone(userDataDetails);
    if (data?.mobile_1) data.mobile_1 = data.mobile_1?.replace(getMobileCode(), "").trim();
    if (data?.mobile_2) data.mobile_2 = data.mobile_2?.replace(getMobileCode(), "").trim();

    setFieldsDataJson(data);
  }, [userDataDetails]);

  const handleFieldsChange = (json: any, setJson: any, key: string, evt: any) => {
    let value = evt.target.value;
    json[key] = value;
    setJson({
      ...json,
    });
  };

  const saveUserDetails = () => {
    let newFieldData = structuredClone(fieldsDataJson);
    if (!!newFieldData.mobile_1) newFieldData.mobile_1 = getMobileCode() + newFieldData.mobile_1;
    if (!!newFieldData.mobile_2) newFieldData.mobile_2 = getMobileCode() + newFieldData.mobile_2;
    setLoading(true);

    updateDataRes("users", newFieldData, "_id", newFieldData._id, "update")
      .then(async (res) => {
        setLoading(false);

        dispatch(updateUser({ data: newFieldData })).unwrap();
        notifications.show({
          title: `Profile Updated!`,
          message: ``,
          color: "blue",
          autoClose: 5000,
        });
      })
      .catch((error) => {
        setLoading(false);

        notifications.show({
          title: `There is an issue please try again after some time !`,
          message: ``,
          color: "red",
          autoClose: 5000,
        });
      });
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

          setLoading(true);
          forgotCreds(payload, true)
            .then((res) => {
              setLoading(false);
              notifications.show({
                title: `Password updated successfully`,
                message: ``,
                autoClose: 8000,
              });
            })
            .catch((err) => {
              setLoading(false);

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

  return (
    <>
      <UserProfile handleSave={handleSave} dataJson={dataJson} resetPassword={resetPasswordJson} />
      <Loader show={loading} />
    </>
  );
}

export default Profile;
