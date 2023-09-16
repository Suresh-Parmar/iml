import { AuthenticationStateType } from '@/app/authentication/types';
import { BASE_URL, getGeographicalInformation } from '@/utilities/API';
import { nanoid } from 'nanoid';
import { isMobile } from 'react-device-detect';
import axios from 'axios';
import { RequestBodyType } from '@/utilities/api-types';

const signInWithEMail = async (
  loginType: 'super_admin' | 'users' = 'users',
  email?: string,
  password?: string
) => {
  const geographicalInformation = await getGeographicalInformation();
  if (email !== undefined && password !== undefined) {
    let requestBody: RequestBodyType = {
      session_id: `${nanoid()}`,
      user_ip: `${geographicalInformation.ip}`,
      user_device: `${isMobile ? 'Mobile' : 'Desktop'}`,
      username: `${email}`,
      password: `${password}`,
      collection: `${loginType}`,
    };
    const response = await axios.post(`${BASE_URL}/login`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseJSON = await response.data;
    let returnValue: AuthenticationStateType = {
      user: {},
      metadata: {},
    };

    const { response: res, role, token } = responseJSON;

    if (res === 'login success') {
      returnValue.user = responseJSON['user_details'];
      returnValue.metadata.status = 'authenticated';
      returnValue.metadata.role = role;
      returnValue.metadata.geodata = geographicalInformation;
      returnValue.metadata.token = token;
    } else {
      returnValue.metadata.status = 'unauthenticated';
      returnValue.metadata.role = undefined;
      returnValue.user = {};
      returnValue.metadata.geodata = undefined;
    }
    return returnValue;
  } else {
    let returnValue: AuthenticationStateType = {
      user: {},
      metadata: {},
    };
    return returnValue;
  }
};

export { signInWithEMail };
