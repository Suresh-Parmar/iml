import { UserProfile } from "@/components/profile";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { forgotCreds, updateDataRes } from "@/utilities/API";
import { useDispatch, useSelector } from "react-redux";
// import { updateUser } from "../../pageComponents/state/authenticationSlice";
import Loader from "@/components/common/Loader";
import { setGetData } from "@/helpers/getLocalStorage";
import { UpdateUserRedux } from "@/redux/slice";

function Profile(props: any) {
  const { onlyPassWord } = props;

  let [fieldsDataJson, setFieldsDataJson] = useState<any>({});
  let [resetPasswordFieldsJson, setResetPasswordFieldsJson] = useState<any>({});
  const [passwordVisible, setPasswordVisible] = useState<boolean[]>([]);
  let [loading, setLoading] = useState<any>(false);
  const dispatch = useDispatch();

  let userDataDetalAll = setGetData("userData", "", true);
  let userDataDetails = userDataDetalAll?.user;

  let { username } = userDataDetails;

  let reduxData = useSelector((state: any) => state.data);
  let selectedCountryLocal = setGetData("selectedCountry", "", true);

  const getSelectedCountry = () => {
    return reduxData?.selectedCountry?.country_code || selectedCountryLocal?.country_code || "";
  };

  const getMobileCode = () => {
    return `+${getSelectedCountry()}`;
  };

  useEffect(() => {
    let data = structuredClone(userDataDetails);
    if (data?.mobile_1) data.mobile_1 = data.mobile_1?.replace(getMobileCode(), "").trim();
    if (data?.mobile_2) data.mobile_2 = data.mobile_2?.replace(getMobileCode(), "").trim();
    setFieldsDataJson(data);
  }, [!!username]);

  const handleFieldsChange = (json: any, setJson: any, key: string, evt: any) => {
    let value = evt.target.value;
    json[key] = value;
    setJson({
      ...json,
    });
  };

  const saveUserDetails = (imageurl: any = "") => {
    let newFieldData = structuredClone(fieldsDataJson);
    if (!!newFieldData.mobile_1) newFieldData.mobile_1 = getMobileCode() + newFieldData.mobile_1;
    if (!!newFieldData.mobile_2) newFieldData.mobile_2 = getMobileCode() + newFieldData.mobile_2;
    if (imageurl) newFieldData.profile_url = imageurl;
    setLoading(true);
    updateDataRes("users", newFieldData, "_id", newFieldData._id, "update")
      .then(async (res) => {
        setLoading(false);
        if (res.data.response == "document updated") {
          let newData = structuredClone(userDataDetalAll);
          newData.user = newFieldData;
          dispatch(UpdateUserRedux(newData));
          setGetData("userData", newData, true);
        }

        notifications.show({
          title: `Profile Updated!`,
          message: ``,
          color: "blue",
          autoClose: 5000,
        });
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);

        notifications.show({
          title: `There is an issue please try again after some time !`,
          message: ``,
          color: "red",
          autoClose: 5000,
        });
      });
  };

  let handleSave = (activePage: any, profileUPdate: any = "") => {
    if (profileUPdate) {
      saveUserDetails(profileUPdate);
    } else {
      let { password, newPassword, confirmPassword } = resetPasswordFieldsJson;
      let isPassword = activePage.link == "password";

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
      disabled: true,
      label: "User Name",
      placeholder: "User Name",
      value: fieldsDataJson.username || "",
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, "username", e),
      type: "text",
    },
    {
      label: "Mobile 1",
      placeholder: "0123456789",
      value: fieldsDataJson.mobile_1 || "",
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, "mobile_1", e),
      type: "text",
    },
    {
      label: "Mobile 2",
      placeholder: "0123456789",
      value: fieldsDataJson.mobile_2 || "",
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, "mobile_2", e),
      type: "text",
    },
    {
      label: "Email 1",
      placeholder: "John@gmail.com",
      value: fieldsDataJson.email_1 || "",
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, "email_1", e),
      type: "email",
    },
    {
      label: "Email 2",
      placeholder: "John@gmail.com",
      value: fieldsDataJson.email_2 || "",
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, "email_2", e),
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
      disabled: true,
      label: "City",
      placeholder: "City",
      value: fieldsDataJson.city || "",
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, "city", e),
      type: "text",
    },
    {
      disabled: true,
      label: "State",
      placeholder: "State",
      value: fieldsDataJson.state || "",
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, "state", e),
      type: "text",
    },
    {
      disabled: true,
      label: "Country",
      placeholder: "Country",
      value: fieldsDataJson.country || "",
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, "country", e),
      type: "text",
    },
    {
      disabled: true,
      label: "DOB",
      placeholder: "dob",
      value: fieldsDataJson.dob || "",
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, "dob", e),
      type: "dob",
    },
    {
      disabled: true,
      label: "Gender",
      placeholder: "Gender",
      value: fieldsDataJson.gender || "",
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, "gender", e),
      type: "text",
    },
    {
      disabled: true,
      label: "Class",
      placeholder: "Class",
      value: fieldsDataJson.class_code || "",
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, "class_code", e),
      type: "text",
    },
    {
      disabled: true,
      label: "Section",
      placeholder: "Section",
      value: fieldsDataJson.section || "",
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, "section", e),
      type: "text",
    },
    {
      disabled: true,
      label: "School Name",
      placeholder: "School Name",
      value: fieldsDataJson.school_name || "",
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, "school_name", e),
      type: "text",
    },

    // {
    //   disabled: true,
    //   label: 'Update At',
    //   placeholder: 'Update At',
    //   value: fieldsDataJson.updated_at || '',
    //   onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, 'updated_at', e),
    //   type: 'text',
    // },
    // {
    //   disabled: true,
    //   label: 'Update By',
    //   placeholder: 'Update By',
    //   value: fieldsDataJson.updated_by || '',
    //   onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, 'updated_by', e),
    //   type: 'text',
    // },

    // {
    //   disabled: true,
    //   label: 'Id',
    //   placeholder: 'Id',
    //   value: fieldsDataJson._id || '',
    //   onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, '_id', e),
    //   type: 'text',
    // },
    // {
    //   disabled: true,
    //   label: 'Status',
    //   placeholder: 'Status',
    //   value: fieldsDataJson.status || '',
    //   onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, 'status', e),
    //   type: 'checkbox',
    //   inputType: 'checkbox',
    // },
    // {
    //   disabled: true,
    //   label: 'Consented',
    //   placeholder: 'Consented',
    //   value: fieldsDataJson.consented || '',
    //   onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, 'consented', e),
    //   type: 'checkbox',
    //   inputType: 'checkbox',
    // },
  ];

  const resetPasswordJson = [
    {
      label: "Old Password",
      placeholder: "**********",
      value: resetPasswordFieldsJson.password || "",
      type: passwordVisible[0] ? "text" : "password",
      inputType: "password",
      onChange: (e: any) => handleFieldsChange(resetPasswordFieldsJson, setResetPasswordFieldsJson, "password", e),
    },
    {
      label: "New Password",
      placeholder: "**********",
      value: resetPasswordFieldsJson.newPassword || "",
      onChange: (e: any) => handleFieldsChange(resetPasswordFieldsJson, setResetPasswordFieldsJson, "newPassword", e),
      inputType: "password",
      type: passwordVisible[1] ? "text" : "password",
    },
    {
      label: "Confirm Password",
      placeholder: "**********",
      value: resetPasswordFieldsJson.confirmPassword || "",
      onChange: (e: any) =>
        handleFieldsChange(resetPasswordFieldsJson, setResetPasswordFieldsJson, "confirmPassword", e),
      type: passwordVisible[2] ? "text" : "password",
      inputType: "password",
    },
  ];

  return (
    <>
      <UserProfile
        onlyPassWord={onlyPassWord}
        handleSave={handleSave}
        dataJson={dataJson}
        resetPassword={resetPasswordJson}
        passwordVisible={passwordVisible}
        setPasswordVisible={setPasswordVisible}
      />
      <Loader show={loading} />
    </>
  );
}

export default Profile;
