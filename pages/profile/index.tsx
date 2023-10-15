import { UserProfile } from '@/components/profile';
import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { forgotCreds, updateDataRes } from '@/utilities/API';
import { useDispatch, useSelector } from 'react-redux';
// import { updateUser } from "../../pageComponents/state/authenticationSlice";
import { getInternationalDailingCode } from '@/utilities/countriesUtils';
import Loader from '@/components/common/Loader';
import { setGetData } from '@/helpers/getLocalStorage';

function Profile() {
  let [fieldsDataJson, setFieldsDataJson] = useState<any>({});
  let [resetPasswordFieldsJson, setResetPasswordFieldsJson] = useState<any>({});
  const [passwordVisible, setPasswordVisible] = useState<boolean[]>([]);
  let [loading, setLoading] = useState<any>(false);
  const dispatch = useDispatch();

  let userDataDetails = setGetData('userData', '', true);
  userDataDetails = userDataDetails?.user;

  let { username } = userDataDetails;

  let reduxData = useSelector((state: any) => state.data);
  let selectedCountryLocal = setGetData('selectedCountry', '', true);

  const getSelectedCountry = () => {
    return reduxData?.selectedCountry?.country_code || selectedCountryLocal?.country_code || '';
  };

  const getMobileCode = () => {
    return `+${getSelectedCountry()}`;
  };

  useEffect(() => {
    let data = structuredClone(userDataDetails);
    if (data?.mobile_1) data.mobile_1 = data.mobile_1?.replace(getMobileCode(), '').trim();
    if (data?.mobile_2) data.mobile_2 = data.mobile_2?.replace(getMobileCode(), '').trim();
    setFieldsDataJson(data);
  }, [!!username]);

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

    updateDataRes('users', newFieldData, '_id', newFieldData._id, 'update')
      .then(async (res) => {
        setLoading(false);

        // dispatch(updateUser({ data: newFieldData }));

        notifications.show({
          title: `Profile Updated!`,
          message: ``,
          color: 'blue',
          autoClose: 5000,
        });
      })
      .catch((error) => {
        setLoading(false);

        notifications.show({
          title: `There is an issue please try again after some time !`,
          message: ``,
          color: 'red',
          autoClose: 5000,
        });
      });
  };

  let handleSave = (activePage: any) => {
    let { password, newPassword, confirmPassword } = resetPasswordFieldsJson;
    let isPassword = activePage.link == 'password';

    setResetPasswordFieldsJson({});
    if (isPassword) {
      if (!!password && !!newPassword && !!confirmPassword) {
        if (newPassword == confirmPassword) {
          let payload: any = {
            registration_details: username,
            ops_identifier: 'change_password',
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
  };

  const dataJson = [
    {
      label: 'name',
      placeholder: 'John Smith',
      value: fieldsDataJson.name || '',
      type: 'text',
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, 'name', e),
    },
    {
      label: 'Email',
      placeholder: 'John@gmail.com',
      value: fieldsDataJson.email_1 || '',
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, 'email_1', e),
      type: 'email',
    },
    {
      label: 'address',
      placeholder: 'Address',
      value: fieldsDataJson.address || '',
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, 'address', e),
      type: 'text',
      inputType: 'textArea',
    },
    {
      label: 'Mobile',
      placeholder: '0123456789',
      value: fieldsDataJson.mobile_1 || '',
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, 'mobile_1', e),
      type: 'text',
    },
    {
      disabled: true,
      label: 'City',
      placeholder: 'City',
      value: fieldsDataJson.city || '',
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, 'city', e),
      type: 'text',
    },
    {
      disabled: true,
      label: 'Country',
      placeholder: 'Country',
      value: fieldsDataJson.country || '',
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, 'country', e),
      type: 'text',
    },
    {
      disabled: true,
      label: 'DOB',
      placeholder: 'dob',
      value: fieldsDataJson.dob || '',
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, 'dob', e),
      type: 'text',
    },
    {
      disabled: true,
      label: 'Gender',
      placeholder: 'Gender',
      value: fieldsDataJson.gender || '',
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, 'gender', e),
      type: 'text',
    },
    {
      disabled: true,
      label: 'Last Login',
      placeholder: 'Last Login',
      value: fieldsDataJson.last_login || '',
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, 'last_login', e),
      type: 'text',
    },
    {
      disabled: true,
      label: 'Password',
      placeholder: 'Password',
      value: fieldsDataJson.password || '',
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, 'password', e),
      type: 'text',
    },
    {
      disabled: true,
      label: 'Pincode',
      placeholder: 'Pincode',
      value: fieldsDataJson.pincode || '',
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, 'pincode', e),
      type: 'text',
    },
    {
      disabled: true,
      label: 'Role',
      placeholder: 'Role',
      value: fieldsDataJson.role || '',
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, 'role', e),
      type: 'text',
    },
    {
      disabled: true,
      label: 'State',
      placeholder: 'State',
      value: fieldsDataJson.state || '',
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, 'state', e),
      type: 'text',
    },
    {
      disabled: true,
      label: 'Update At',
      placeholder: 'Update At',
      value: fieldsDataJson.updated_at || '',
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, 'updated_at', e),
      type: 'text',
    },
    {
      disabled: true,
      label: 'Update By',
      placeholder: 'Update By',
      value: fieldsDataJson.updated_by || '',
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, 'updated_by', e),
      type: 'text',
    },
    {
      disabled: true,
      label: 'User Name',
      placeholder: 'User Name',
      value: fieldsDataJson.username || '',
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, 'username', e),
      type: 'text',
    },
    {
      disabled: true,
      label: 'Id',
      placeholder: 'Id',
      value: fieldsDataJson._id || '',
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, '_id', e),
      type: 'text',
    },
    {
      disabled: true,
      label: 'Status',
      placeholder: 'Status',
      value: fieldsDataJson.status || '',
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, 'status', e),
      type: 'checkbox',
      inputType: 'checkbox',
    },
    {
      disabled: true,
      label: 'Consented',
      placeholder: 'Consented',
      value: fieldsDataJson.consented || '',
      onChange: (e: any) => handleFieldsChange(fieldsDataJson, setFieldsDataJson, 'consented', e),
      type: 'checkbox',
      inputType: 'checkbox',
    },
  ];

  const resetPasswordJson = [
    {
      label: 'Old Password',
      placeholder: '**********',
      value: resetPasswordFieldsJson.password || '',
      type: passwordVisible[0] ? 'text' : 'password',
      inputType: 'password',
      onChange: (e: any) => handleFieldsChange(resetPasswordFieldsJson, setResetPasswordFieldsJson, 'password', e),
    },
    {
      label: 'New Password',
      placeholder: '**********',
      value: resetPasswordFieldsJson.newPassword || '',
      onChange: (e: any) => handleFieldsChange(resetPasswordFieldsJson, setResetPasswordFieldsJson, 'newPassword', e),
      inputType: 'password',
      type: passwordVisible[1] ? 'text' : 'password',
    },
    {
      label: 'Confirm Password',
      placeholder: '**********',
      value: resetPasswordFieldsJson.confirmPassword || '',
      onChange: (e: any) =>
        handleFieldsChange(resetPasswordFieldsJson, setResetPasswordFieldsJson, 'confirmPassword', e),
      type: passwordVisible[2] ? 'text' : 'password',
      inputType: 'password',
    },
  ];

  return (
    <>
      <UserProfile
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
