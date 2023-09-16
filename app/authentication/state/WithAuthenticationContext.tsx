import Loader from "@/app/loader/page";
import { useAuthentication } from "./useAuthentication";

export const WithAuthenticationContext = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // const { user, metadata: { status, authenticationTokens: { access_token, refresh_token } } } = useAuthentication();
  const { metadata: { status } } = useAuthentication();
  if (status !== "unauthenticated" && status !== "authenticating") {
    return (
      <>
        {children}
      </>
    );
  }
  return <Loader />
}