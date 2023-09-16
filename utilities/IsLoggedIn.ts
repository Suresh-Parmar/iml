import { useAuthentication } from '@/app/authentication/state';

function IsLoggedIn() {
    const authentication = useAuthentication();
    const isLogin = authentication.metadata.status === "authenticated"

  return isLogin
}

export default IsLoggedIn