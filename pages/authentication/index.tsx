import { useRouter } from "next/router";
import React, { useEffect } from "react";

function AuthIndex() {
  const routes = useRouter();

  useEffect(() => {
    routes.replace("/authentication/signin");
  }, []);

  return <div>auth</div>;
}

export default AuthIndex;
