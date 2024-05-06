import React, { useEffect } from "react";
import RMHomePage from "../../components/relationshipmanager/HomePage";
import { useDispatch, useSelector } from "react-redux";
import { setGetData } from "@/helpers/getLocalStorage";
import { useRouter } from "next/router";
import { ControlApplicationShellComponents } from "@/redux/slice";

function RelationshipManager() {
  const dispatch = useDispatch();
  let authentication: any = setGetData("userData", false, true);
  let role = authentication?.user?.role;
  const router: any = useRouter();

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
          showNavigationBar: role == "student",
          hideNavigationBar: false,
          showAsideBar: false,
        })
      );
    }
  }, [authentication?.metadata?.status, dispatch, router]);

  return (
    <div>
      <RMHomePage />
    </div>
  );
}

export default RelationshipManager;
