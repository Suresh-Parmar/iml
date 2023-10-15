import { setGetData } from "@/helpers/getLocalStorage";

function IsLoggedIn() {
  const authentication: any = setGetData("userData", false, true);

  const isLogin = authentication?.metadata?.status === "authenticated";

  return isLogin;
}

export default IsLoggedIn;
