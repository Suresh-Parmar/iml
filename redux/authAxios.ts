import { clearLocalData, setGetData } from "@/helpers/getLocalStorage";
import axios from "axios";

const authAPI = axios.create({});
let userData: any = setGetData("userData", false, true);
let token = userData?.metadata?.token;

authAPI.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error?.response?.status === 401) {
      clearLocalData();
      window.location.pathname = "/";
    } else {
      return Promise.reject(error);
    }
  }
);

authAPI.interceptors.request.use((request) => {
  if (!token) {
    let userData: any = setGetData("userData", false, true);
    token = userData?.metadata?.token;
  }
  if (token) {
    request.headers["Authorization"] = `Bearer ${token}`;
  }
  return request;
});

export default authAPI;
