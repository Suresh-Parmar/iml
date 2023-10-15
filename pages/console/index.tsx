import { Container, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setGetData } from "@/helpers/getLocalStorage";
import { ControlApplicationShellComponents } from "@/redux/slice";

export default function Console() {
  const router: any = useRouter();

  const dispatch = useDispatch();
  let authentication: any = setGetData("userData", false, true);
  let role = authentication?.user?.role;

  useEffect(() => {
    if (role == "student") {
      router.replace("/");
    }
    if (authentication?.metadata?.status == "unauthenticated" || !authentication) {
      router.replace("/authentication/signin");
    } else {
      dispatch(
        ControlApplicationShellComponents({
          showHeader: true,
          showFooter: false,
          showNavigationBar: false,
          hideNavigationBar: false,
          showAsideBar: false,
        })
      );
    }
  }, [authentication?.metadata?.status, dispatch, router]);
  return (
    <Container h={"100%"}>
      <Title>Console</Title>
    </Container>
  );
}
