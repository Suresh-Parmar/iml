import { setGetData } from "./getLocalStorage";

export const getUserData = (key: any, from: any = "user") => {
  try {
    let userData: any = setGetData("userData", "", true);
    if (userData) {
      if (userData[from]) {
        return userData[from][key];
      }
    }
  } catch (e) {
    console.log(e);
  }
};

export const iterateData = (data: any) => {
  if (data?.data) {
    if (data?.data?.data) {
      if (data?.data?.data?.response) {
        return data?.data?.data?.response;
      }
      return data?.data?.data;
    }
    return data?.data;
  }
  return data;
};
