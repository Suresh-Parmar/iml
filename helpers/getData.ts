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

export const genratePayload = (collection: string, filter?: any, required?: any, countryName?: any) => {
  if (required) {
    if (Array.isArray(required)) {
      for (let index = 0; index < required.length; index++) {
        const element = required[index];
        if (!filter[element]) {
          return "";
        }
      }
    } else {
      if (!filter[required]) {
        return "";
      }
    }
  }

  let obj: any = {
    collection_name: collection,
    filter_var: {
      country: countryName,
      status: true,
    },
    op_name: "find_many",
  };

  if (filter) {
    obj.filter_var = { ...obj.filter_var, ...filter };
  }

  return obj;
};

export let handleApiData = (data: any) => {
  if (Array.isArray(data)) {
    return structuredClone(data);
  }
  return [];
};
