import { setGetData } from "@/helpers/getLocalStorage";
import axios from "axios";

const authAPI = axios.create({});
let userData: any = setGetData("userData", false, true);
let token = userData?.metadata?.token;

if (token) {
  authAPI.interceptors.request.use((request) => {
    request.headers["Authorization"] = `Bearer ${token}`;
    return request;
  });
}

export default authAPI;
