import { Container, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PaymentSuccessful() {
  const router = useRouter();
  // const dispatch = useApplicationDispatch();
  // const authentication = useAuthentication();
  // useEffect(() => {
  //   if (authentication?.metadata?.status === "unauthenticated") {
  //     router.push("/authentication/signin");
  //   } else {
  //     dispatch({
  //       type: "Client/UpdateApplicationShellPadding", payload: {
  //         applicationShellPadding: 0,
  //       }
  //     });
  //     dispatch({
  //       type: "Client/ControlApplicationShellComponents", payload: {
  //         showHeader: true,
  //         showFooter: false,
  //         showNavigationBar: true,
  //         hideNavigationBar: false,
  //         showAsideBar: false,
  //       }
  //     });
  //   }
  // }, [authentication?.metadata?.status, dispatch, router]);
  return (
    <Container h={"100%"}>
      <Title>Payment Successful!</Title>
    </Container>
  );
}
